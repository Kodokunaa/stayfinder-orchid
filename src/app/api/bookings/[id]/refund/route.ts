import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings, transactions, users, userSessions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication check
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'INVALID_SESSION' },
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
        { error: 'Invalid session', code: 'INVALID_SESSION' },
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

    // Get user from session
    const userRecords = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (userRecords.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    const userId = userRecords[0].id;

    // Validate booking ID
    const { id } = params;
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid booking ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const bookingId = parseInt(id);

    // Fetch booking by ID
    const bookingRecords = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (bookingRecords.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found', code: 'BOOKING_NOT_FOUND' },
        { status: 404 }
      );
    }

    const booking = bookingRecords[0];

    // Validate booking status
    if (booking.status !== 'confirmed') {
      let message = 'Booking cannot be refunded';
      if (booking.status === 'pending') {
        message = 'Cannot refund a pending booking';
      } else if (booking.status === 'refunded') {
        message = 'Booking has already been refunded';
      }
      
      return NextResponse.json(
        { error: message, code: 'INVALID_STATUS' },
        { status: 400 }
      );
    }

    // Update booking status to refunded
    const updatedBooking = await db
      .update(bookings)
      .set({
        status: 'refunded',
        refundedAt: new Date().toISOString(),
      })
      .where(eq(bookings.id, bookingId))
      .returning();

    // Create positive refund transaction
    const transaction = await db
      .insert(transactions)
      .values({
        userId: userId,
        bookingId: bookingId,
        listingId: booking.listingId,
        amount: booking.total,
        type: 'refund',
        description: `Refund for booking #${bookingId}`,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(
      {
        booking: updatedBooking[0],
        transaction: transaction[0],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('POST /api/bookings/[id]/refund error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}