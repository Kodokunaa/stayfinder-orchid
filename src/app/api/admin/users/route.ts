import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, userSessions } from '@/db/schema';
import { eq, like, or, and, desc, gte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const role = searchParams.get('role');

    let query = db.select().from(users);

    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(users.firstName, `%${search}%`),
          like(users.lastName, `%${search}%`),
          like(users.email, `%${search}%`)
        )
      );
    }

    if (role) {
      conditions.push(eq(users.role, role));
    }

    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }

    const results = await query
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Authentication check
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'MISSING_AUTH_TOKEN' },
        { status: 401 }
      );
    }

    const sessionToken = authHeader.substring(7);

    // Verify session and get requesting user
    const sessionRecords = await db
      .select()
      .from(userSessions)
      .where(
        and(
          eq(userSessions.token, sessionToken),
          gte(userSessions.expiresAt, new Date())
        )
      )
      .limit(1);

    if (sessionRecords.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or expired session', code: 'INVALID_SESSION' },
        { status: 401 }
      );
    }

    const session = sessionRecords[0];

    // Get requesting user
    const requestingUserRecords = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (requestingUserRecords.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    const requestingUser = requestingUserRecords[0];

    // Only managers can change roles
    if (requestingUser.role !== 'manager') {
      return NextResponse.json(
        { error: 'Only managers can change user roles', code: 'UNAUTHORIZED' },
        { status: 403 }
      );
    }

    // Get target user ID from query params
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Get request body
    const body = await request.json();
    const { role } = body;

    if (!role) {
      return NextResponse.json(
        { error: 'Role is required', code: 'MISSING_ROLE' },
        { status: 400 }
      );
    }

    // Validate role value
    const validRoles = ['renter', 'admin', 'manager'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Role must be one of: renter, admin, manager', code: 'INVALID_ROLE' },
        { status: 400 }
      );
    }

    // Get target user
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(id)))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    const targetUser = existingUser[0];

    // Validate state transitions - managers can only:
    // 1. Promote renter → admin
    // 2. Demote admin → renter
    // Invalid transitions:
    // - admin → admin (no change)
    // - renter → renter (no change)
    // - renter → manager (not allowed)
    // - admin → manager (not allowed)
    // - manager → anything (cannot change manager roles)

    if (targetUser.role === role) {
      return NextResponse.json(
        { error: 'User already has this role', code: 'NO_CHANGE' },
        { status: 400 }
      );
    }

    if (targetUser.role === 'manager') {
      return NextResponse.json(
        { error: 'Cannot change manager roles', code: 'INVALID_TRANSITION' },
        { status: 400 }
      );
    }

    if (role === 'manager') {
      return NextResponse.json(
        { error: 'Cannot promote users to manager role', code: 'INVALID_TRANSITION' },
        { status: 400 }
      );
    }

    // Valid transitions at this point:
    // - renter → admin (promotion)
    // - admin → renter (demotion)
    if (targetUser.role === 'renter' && role === 'admin') {
      // Promotion: valid
    } else if (targetUser.role === 'admin' && role === 'renter') {
      // Demotion: valid
    } else {
      return NextResponse.json(
        { error: 'Invalid role transition. Can only promote renter to admin or demote admin to renter', code: 'INVALID_TRANSITION' },
        { status: 400 }
      );
    }

    const updated = await db
      .update(users)
      .set({
        role: role
      })
      .where(eq(users.id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update user', code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}