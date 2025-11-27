import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings, transactions, listings } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single booking by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const booking = await db
        .select()
        .from(bookings)
        .where(eq(bookings.id, parseInt(id)))
        .limit(1);

      if (booking.length === 0) {
        return NextResponse.json(
          { error: 'Booking not found', code: 'BOOKING_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(booking[0], { status: 200 });
    }

    // List bookings with pagination and filters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const userId = searchParams.get('userId');
    const listingId = searchParams.get('listingId');
    const status = searchParams.get('status');

    let query = db.select().from(bookings);

    // Build filter conditions
    const conditions = [];
    
    if (userId) {
      if (isNaN(parseInt(userId))) {
        return NextResponse.json(
          { error: 'Valid userId is required', code: 'INVALID_USER_ID' },
          { status: 400 }
        );
      }
      conditions.push(eq(bookings.userId, parseInt(userId)));
    }

    if (listingId) {
      if (isNaN(parseInt(listingId))) {
        return NextResponse.json(
          { error: 'Valid listingId is required', code: 'INVALID_LISTING_ID' },
          { status: 400 }
        );
      }
      conditions.push(eq(bookings.listingId, parseInt(listingId)));
    }

    if (status) {
      const validStatuses = ['pending', 'confirmed', 'cancelled', 'refunded'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: 'Status must be one of: pending, confirmed, cancelled, refunded', code: 'INVALID_STATUS' },
          { status: 400 }
        );
      }
      conditions.push(eq(bookings.status, status));
    }

    // Apply filters if any
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      listingId,
      userId,
      checkInDate,
      checkOutDate,
      numNights,
      subtotal,
      tax,
      total,
      paymentMethod,
      status
    } = body;

    // Validate required fields
    if (!listingId || isNaN(parseInt(listingId))) {
      return NextResponse.json(
        { error: 'Valid listingId is required', code: 'MISSING_LISTING_ID' },
        { status: 400 }
      );
    }

    if (!userId || isNaN(parseInt(userId))) {
      return NextResponse.json(
        { error: 'Valid userId is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    if (!checkInDate) {
      return NextResponse.json(
        { error: 'checkInDate is required', code: 'MISSING_CHECK_IN_DATE' },
        { status: 400 }
      );
    }

    if (!checkOutDate) {
      return NextResponse.json(
        { error: 'checkOutDate is required', code: 'MISSING_CHECK_OUT_DATE' },
        { status: 400 }
      );
    }

    // Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (isNaN(checkIn.getTime())) {
      return NextResponse.json(
        { error: 'checkInDate must be a valid ISO date string', code: 'INVALID_CHECK_IN_DATE' },
        { status: 400 }
      );
    }

    if (isNaN(checkOut.getTime())) {
      return NextResponse.json(
        { error: 'checkOutDate must be a valid ISO date string', code: 'INVALID_CHECK_OUT_DATE' },
        { status: 400 }
      );
    }

    if (checkOut <= checkIn) {
      return NextResponse.json(
        { error: 'checkOutDate must be after checkInDate', code: 'INVALID_DATE_RANGE' },
        { status: 400 }
      );
    }

    if (!numNights || isNaN(parseInt(numNights)) || parseInt(numNights) < 1) {
      return NextResponse.json(
        { error: 'numNights must be at least 1', code: 'INVALID_NUM_NIGHTS' },
        { status: 400 }
      );
    }

    if (!subtotal || isNaN(parseInt(subtotal)) || parseInt(subtotal) <= 0) {
      return NextResponse.json(
        { error: 'subtotal must be greater than 0', code: 'INVALID_SUBTOTAL' },
        { status: 400 }
      );
    }

    if (tax === undefined || tax === null || isNaN(parseInt(tax)) || parseInt(tax) < 0) {
      return NextResponse.json(
        { error: 'tax must be greater than or equal to 0', code: 'INVALID_TAX' },
        { status: 400 }
      );
    }

    if (!total || isNaN(parseInt(total)) || parseInt(total) <= 0) {
      return NextResponse.json(
        { error: 'total must be greater than 0', code: 'INVALID_TOTAL' },
        { status: 400 }
      );
    }

    if (!paymentMethod || typeof paymentMethod !== 'string' || paymentMethod.trim() === '') {
      return NextResponse.json(
        { error: 'paymentMethod is required', code: 'MISSING_PAYMENT_METHOD' },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ['pending', 'confirmed', 'cancelled', 'refunded'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: 'Status must be one of: pending, confirmed, cancelled, refunded', code: 'INVALID_STATUS' },
          { status: 400 }
        );
      }
    }

    // Check if listing exists and get its status
    const listing = await db
      .select()
      .from(listings)
      .where(eq(listings.id, parseInt(listingId)))
      .limit(1);

    if (listing.length === 0) {
      return NextResponse.json(
        { error: 'Listing not found', code: 'LISTING_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Check if listing is already booked
    if (listing[0].status === 'booked') {
      return NextResponse.json(
        { error: 'Listing is already booked', code: 'LISTING_ALREADY_BOOKED' },
        { status: 400 }
      );
    }

    const bookingStatus = status || 'confirmed';

    // Create booking
    const newBooking = await db
      .insert(bookings)
      .values({
        listingId: parseInt(listingId),
        userId: parseInt(userId),
        checkInDate: checkInDate.trim(),
        checkOutDate: checkOutDate.trim(),
        numNights: parseInt(numNights),
        subtotal: parseInt(subtotal),
        tax: parseInt(tax),
        total: parseInt(total),
        paymentMethod: paymentMethod.trim(),
        status: bookingStatus,
        createdAt: new Date().toISOString()
      })
      .returning();

    // If booking is confirmed, update listing status to booked
    if (bookingStatus === 'confirmed') {
      await db
        .update(listings)
        .set({
          status: 'booked',
          updatedAt: new Date().toISOString()
        })
        .where(eq(listings.id, parseInt(listingId)));
    }

    return NextResponse.json(newBooking[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!status) {
      return NextResponse.json(
        { error: 'status is required', code: 'MISSING_STATUS' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Status must be one of: pending, confirmed, cancelled, refunded', code: 'INVALID_STATUS' },
        { status: 400 }
      );
    }

    // Check if booking exists
    const existing = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found', code: 'BOOKING_NOT_FOUND' },
        { status: 404 }
      );
    }

    const booking = existing[0];

    // Update booking
    const updated = await db
      .update(bookings)
      .set({
        status: status.trim()
      })
      .where(eq(bookings.id, parseInt(id)))
      .returning();

    // If status changed to 'cancelled', update listing status to 'available' and create refund transaction
    if (status === 'cancelled' && booking.status !== 'cancelled') {
      // Update listing status to available
      await db
        .update(listings)
        .set({
          status: 'available',
          updatedAt: new Date().toISOString()
        })
        .where(eq(listings.id, booking.listingId));

      // Get listing title for description
      const listingResult = await db
        .select()
        .from(listings)
        .where(eq(listings.id, booking.listingId))
        .limit(1);

      const listingTitle = listingResult.length > 0 ? listingResult[0].title : `Listing #${booking.listingId}`;

      // Create refund transaction with positive amount
      await db.insert(transactions).values({
        userId: booking.userId,
        bookingId: booking.id,
        listingId: booking.listingId,
        amount: booking.total,
        type: 'refund',
        description: `Refund for cancelled booking at ${listingTitle}`,
        createdAt: new Date().toISOString(),
      });
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