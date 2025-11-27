import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { transactions } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userIdParam = searchParams.get('userId');
    
    if (!userIdParam || isNaN(parseInt(userIdParam))) {
      return NextResponse.json({ 
        error: 'Valid userId is required',
        code: 'INVALID_USER_ID' 
      }, { status: 400 });
    }

    const userId = parseInt(userIdParam);

    // Parse pagination parameters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Fetch transactions for the user
    const userTransactions = await db.select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(userTransactions, { status: 200 });

  } catch (error) {
    console.error('GET transactions error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { userId, amount, type, description, bookingId, listingId } = body;

    // Validate required fields
    if (!userId || isNaN(parseInt(userId))) {
      return NextResponse.json({ 
        error: 'Valid userId is required',
        code: 'MISSING_USER_ID' 
      }, { status: 400 });
    }

    if (amount === undefined || amount === null) {
      return NextResponse.json({ 
        error: 'Amount is required',
        code: 'MISSING_AMOUNT' 
      }, { status: 400 });
    }

    if (typeof amount !== 'number' || isNaN(amount)) {
      return NextResponse.json({ 
        error: 'Amount must be a valid number',
        code: 'INVALID_AMOUNT' 
      }, { status: 400 });
    }

    if (!type) {
      return NextResponse.json({ 
        error: 'Type is required',
        code: 'MISSING_TYPE' 
      }, { status: 400 });
    }

    if (type !== 'booking' && type !== 'refund') {
      return NextResponse.json({ 
        error: 'Type must be either "booking" or "refund"',
        code: 'INVALID_TYPE' 
      }, { status: 400 });
    }

    if (!description || typeof description !== 'string' || description.trim() === '') {
      return NextResponse.json({ 
        error: 'Description is required and must be a non-empty string',
        code: 'INVALID_DESCRIPTION' 
      }, { status: 400 });
    }

    // Validate optional integer fields
    if (bookingId !== undefined && bookingId !== null && (typeof bookingId !== 'number' || isNaN(bookingId))) {
      return NextResponse.json({ 
        error: 'Booking ID must be a valid number',
        code: 'INVALID_BOOKING_ID' 
      }, { status: 400 });
    }

    if (listingId !== undefined && listingId !== null && (typeof listingId !== 'number' || isNaN(listingId))) {
      return NextResponse.json({ 
        error: 'Listing ID must be a valid number',
        code: 'INVALID_LISTING_ID' 
      }, { status: 400 });
    }

    // Create transaction data
    const transactionData: any = {
      userId: parseInt(userId),
      amount: Math.floor(amount),
      type,
      description: description.trim(),
      createdAt: new Date().toISOString(),
    };

    // Add optional fields if provided
    if (bookingId !== undefined && bookingId !== null) {
      transactionData.bookingId = Math.floor(bookingId);
    }

    if (listingId !== undefined && listingId !== null) {
      transactionData.listingId = Math.floor(listingId);
    }

    // Insert transaction into database
    const newTransaction = await db.insert(transactions)
      .values(transactionData)
      .returning();

    return NextResponse.json(newTransaction[0], { status: 201 });

  } catch (error) {
    console.error('POST transactions error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}