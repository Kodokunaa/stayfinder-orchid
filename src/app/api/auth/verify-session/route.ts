import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, userSessions } from '@/db/schema';
import { eq, and, gte } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionToken } = body;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Session token required', code: 'MISSING_TOKEN' },
        { status: 400 }
      );
    }

    // Find valid session in database
    const [validSession] = await db
      .select()
      .from(userSessions)
      .where(
        and(
          eq(userSessions.token, sessionToken),
          gte(userSessions.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!validSession) {
      return NextResponse.json(
        { error: 'Invalid or expired session', code: 'INVALID_SESSION' },
        { status: 401 }
      );
    }

    // Get user data
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, validSession.userId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Return user data
    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          profilePicture: user.profilePicture,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}