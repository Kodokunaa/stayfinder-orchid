import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, userSessions } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function verifySession(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const sessionToken = authHeader.substring(7);

  // Verify session
  const sessionRecords = await db
    .select()
    .from(userSessions)
    .where(eq(userSessions.token, sessionToken))
    .limit(1);

  if (sessionRecords.length === 0) {
    return null;
  }

  const session = sessionRecords[0];

  // Check if session is expired
  if (new Date(session.expiresAt) < new Date()) {
    return null;
  }

  // Get user
  const userRecords = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  if (userRecords.length === 0) {
    return null;
  }

  return userRecords[0];
}

export async function GET(request: NextRequest) {
  try {
    const user = await verifySession(request);
    
    if (!user) {
      return NextResponse.json({ 
        error: 'Authentication required', 
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt
    }, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await verifySession(request);
    
    if (!user) {
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

    const updated = await db.update(users)
      .set(updates)
      .where(eq(users.id, user.id))
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