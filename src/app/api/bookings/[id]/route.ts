import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings, userSessions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication check
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { 
          error: 'Authentication required',
          code: 'MISSING_AUTH_TOKEN'
        },
        { status: 401 }
      );
    }

    const sessionToken = authHeader.substring(7);

    // Verify session
    const sessionRecords = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.token, sessionToken))
      .limit(1);

    if (sessionRecords.length === 0) {
      return NextResponse.json(
        { 
          error: 'Invalid or expired session',
          code: 'INVALID_SESSION'
        },
        { status: 401 }
      );
    }

    const session = sessionRecords[0];

    // Check if session is expired
    if (new Date(session.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'Session expired', code: 'SESSION_EXPIRED' },
        { status: 401 }
      );
    }

    // Extract and validate ID
    const { id } = params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid booking ID is required',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    const bookingId = parseInt(id);

    // Fetch booking by ID
    const booking = await db.select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (booking.length === 0) {
      return NextResponse.json(
        { 
          error: 'Booking not found',
          code: 'BOOKING_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(booking[0], { status: 200 });

  } catch (error) {
    console.error('GET booking error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}