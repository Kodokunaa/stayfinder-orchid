import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session) {
      return NextResponse.json({ 
        error: 'Authentication required', 
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    const user = await db.select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
      profilePicture: users.profilePicture,
      createdAt: users.createdAt
    })
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ 
        error: 'User not found', 
        code: 'USER_NOT_FOUND' 
      }, { status: 404 });
    }

    return NextResponse.json(user[0], { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session) {
      return NextResponse.json({ 
        error: 'Authentication required', 
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    const requestBody = await request.json();
    const { firstName, lastName, profilePicture } = requestBody;

    const updates: Record<string, any> = {};

    if (firstName !== undefined) {
      const trimmedFirstName = typeof firstName === 'string' ? firstName.trim() : '';
      if (!trimmedFirstName) {
        return NextResponse.json({ 
          error: 'First name must be a non-empty string', 
          code: 'INVALID_FIRST_NAME' 
        }, { status: 400 });
      }
      updates.firstName = trimmedFirstName;
    }

    if (lastName !== undefined) {
      const trimmedLastName = typeof lastName === 'string' ? lastName.trim() : '';
      if (!trimmedLastName) {
        return NextResponse.json({ 
          error: 'Last name must be a non-empty string', 
          code: 'INVALID_LAST_NAME' 
        }, { status: 400 });
      }
      updates.lastName = trimmedLastName;
    }

    if (profilePicture !== undefined) {
      updates.profilePicture = profilePicture;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ 
        error: 'No valid fields provided to update', 
        code: 'NO_UPDATES' 
      }, { status: 400 });
    }

    const existingUser = await db.select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json({ 
        error: 'User not found', 
        code: 'USER_NOT_FOUND' 
      }, { status: 404 });
    }

    const updated = await db.update(users)
      .set(updates)
      .where(eq(users.email, session.user.email))
      .returning({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
        profilePicture: users.profilePicture,
        createdAt: users.createdAt
      });

    if (updated.length === 0) {
      return NextResponse.json({ 
        error: 'Failed to update user', 
        code: 'UPDATE_FAILED' 
      }, { status: 500 });
    }

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}