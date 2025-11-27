import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { listings, bookings } from '@/db/schema';
import { eq, and, gte, lte, like, or, desc, sql, notInArray, inArray } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single listing by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const listing = await db
        .select()
        .from(listings)
        .where(eq(listings.id, parseInt(id)))
        .limit(1);

      if (listing.length === 0) {
        return NextResponse.json(
          { error: 'Listing not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(listing[0], { status: 200 });
    }

    // List with pagination, search, and filters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const guests = searchParams.get('guests');
    const bedrooms = searchParams.get('bedrooms');
    const userId = searchParams.get('userId');
    const featured = searchParams.get('featured');

    let query = db.select().from(listings);
    const conditions = [];

    // Featured filter
    if (featured === 'true') {
      conditions.push(eq(listings.featured, true));
      
      // Get listing IDs that have confirmed or pending bookings
      const bookedListingIds = await db
        .selectDistinct({ listingId: bookings.listingId })
        .from(bookings)
        .where(
          or(
            eq(bookings.status, 'confirmed'),
            eq(bookings.status, 'pending')
          )
        );
      
      // If there are booked listings, exclude them
      if (bookedListingIds.length > 0) {
        const idsToExclude = bookedListingIds.map(b => b.listingId);
        conditions.push(notInArray(listings.id, idsToExclude));
      }
    }

    // Search filter
    if (search) {
      conditions.push(
        or(
          like(listings.title, `%${search}%`),
          like(listings.description, `%${search}%`)
        )
      );
    }

    // Price range filter
    if (minPrice) {
      conditions.push(gte(listings.pricePerNight, parseInt(minPrice)));
    }
    if (maxPrice) {
      conditions.push(lte(listings.pricePerNight, parseInt(maxPrice)));
    }

    // Guests filter
    if (guests) {
      conditions.push(gte(listings.numGuests, parseInt(guests)));
    }

    // Bedrooms filter
    if (bedrooms) {
      conditions.push(gte(listings.numBedrooms, parseInt(bedrooms)));
    }

    // User filter
    if (userId) {
      conditions.push(eq(listings.userId, parseInt(userId)));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(listings.createdAt))
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      pricePerNight,
      numGuests,
      numBedrooms,
      numBeds,
      numBathrooms,
      images,
      userId,
      featured,
    } = body;

    // Validation
    if (!title || typeof title !== 'string' || title.trim().length < 10) {
      return NextResponse.json(
        {
          error: 'Title is required and must be at least 10 characters',
          code: 'INVALID_TITLE',
        },
        { status: 400 }
      );
    }

    if (!description || typeof description !== 'string' || description.trim().length < 20) {
      return NextResponse.json(
        {
          error: 'Description is required and must be at least 20 characters',
          code: 'INVALID_DESCRIPTION',
        },
        { status: 400 }
      );
    }

    if (!pricePerNight || typeof pricePerNight !== 'number' || pricePerNight <= 0) {
      return NextResponse.json(
        {
          error: 'Price per night must be greater than 0',
          code: 'INVALID_PRICE',
        },
        { status: 400 }
      );
    }

    if (!numGuests || typeof numGuests !== 'number' || numGuests < 1) {
      return NextResponse.json(
        {
          error: 'Number of guests must be at least 1',
          code: 'INVALID_GUESTS',
        },
        { status: 400 }
      );
    }

    if (typeof numBedrooms !== 'number' || numBedrooms < 0) {
      return NextResponse.json(
        {
          error: 'Number of bedrooms must be 0 or greater',
          code: 'INVALID_BEDROOMS',
        },
        { status: 400 }
      );
    }

    if (!numBeds || typeof numBeds !== 'number' || numBeds < 1) {
      return NextResponse.json(
        {
          error: 'Number of beds must be at least 1',
          code: 'INVALID_BEDS',
        },
        { status: 400 }
      );
    }

    if (!numBathrooms || typeof numBathrooms !== 'number' || numBathrooms < 1) {
      return NextResponse.json(
        {
          error: 'Number of bathrooms must be at least 1',
          code: 'INVALID_BATHROOMS',
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(images) || images.length < 1) {
      return NextResponse.json(
        {
          error: 'Images must be an array with at least 1 image URL',
          code: 'INVALID_IMAGES',
        },
        { status: 400 }
      );
    }

    if (!userId || typeof userId !== 'number' || isNaN(userId)) {
      return NextResponse.json(
        {
          error: 'Valid user ID is required',
          code: 'INVALID_USER_ID',
        },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const imagesJson = JSON.stringify(images);
    const featuredValue = featured ? 1 : 0;

    // Use raw SQL to bypass Drizzle's id field issue
    const result = await db.run(
      sql`INSERT INTO listings (title, description, price_per_night, num_guests, num_bedrooms, num_beds, num_bathrooms, images, user_id, status, featured, created_at, updated_at)
          VALUES (${title.trim()}, ${description.trim()}, ${pricePerNight}, ${numGuests}, ${numBedrooms}, ${numBeds}, ${numBathrooms}, ${imagesJson}, ${userId}, 'available', ${featuredValue}, ${timestamp}, ${timestamp})`
    );

    // Fetch the newly created listing
    const newListing = await db
      .select()
      .from(listings)
      .where(eq(listings.id, result.lastInsertRowid as number))
      .limit(1);

    return NextResponse.json(newListing[0], { status: 201 });
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

    const listingId = parseInt(id);

    // Check if listing exists
    const existingListing = await db
      .select()
      .from(listings)
      .where(eq(listings.id, listingId))
      .limit(1);

    if (existingListing.length === 0) {
      return NextResponse.json(
        { error: 'Listing not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      pricePerNight,
      numGuests,
      numBedrooms,
      numBeds,
      numBathrooms,
      images,
      featured,
    } = body;

    const updates: any = {
      updatedAt: new Date().toISOString(),
    };

    // Validate and add fields if provided
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length < 10) {
        return NextResponse.json(
          {
            error: 'Title must be at least 10 characters',
            code: 'INVALID_TITLE',
          },
          { status: 400 }
        );
      }
      updates.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== 'string' || description.trim().length < 20) {
        return NextResponse.json(
          {
            error: 'Description must be at least 20 characters',
            code: 'INVALID_DESCRIPTION',
          },
          { status: 400 }
        );
      }
      updates.description = description.trim();
    }

    if (pricePerNight !== undefined) {
      if (typeof pricePerNight !== 'number' || pricePerNight <= 0) {
        return NextResponse.json(
          {
            error: 'Price per night must be greater than 0',
            code: 'INVALID_PRICE',
          },
          { status: 400 }
        );
      }
      updates.pricePerNight = pricePerNight;
    }

    if (numGuests !== undefined) {
      if (typeof numGuests !== 'number' || numGuests < 1) {
        return NextResponse.json(
          {
            error: 'Number of guests must be at least 1',
            code: 'INVALID_GUESTS',
          },
          { status: 400 }
        );
      }
      updates.numGuests = numGuests;
    }

    if (numBedrooms !== undefined) {
      if (typeof numBedrooms !== 'number' || numBedrooms < 0) {
        return NextResponse.json(
          {
            error: 'Number of bedrooms must be 0 or greater',
            code: 'INVALID_BEDROOMS',
          },
          { status: 400 }
        );
      }
      updates.numBedrooms = numBedrooms;
    }

    if (numBeds !== undefined) {
      if (typeof numBeds !== 'number' || numBeds < 1) {
        return NextResponse.json(
          {
            error: 'Number of beds must be at least 1',
            code: 'INVALID_BEDS',
          },
          { status: 400 }
        );
      }
      updates.numBeds = numBeds;
    }

    if (numBathrooms !== undefined) {
      if (typeof numBathrooms !== 'number' || numBathrooms < 1) {
        return NextResponse.json(
          {
            error: 'Number of bathrooms must be at least 1',
            code: 'INVALID_BATHROOMS',
          },
          { status: 400 }
        );
      }
      updates.numBathrooms = numBathrooms;
    }

    if (images !== undefined) {
      if (!Array.isArray(images) || images.length < 1) {
        return NextResponse.json(
          {
            error: 'Images must be an array with at least 1 image URL',
            code: 'INVALID_IMAGES',
          },
          { status: 400 }
        );
      }
      updates.images = JSON.stringify(images);
    }

    if (featured !== undefined) {
      updates.featured = featured ? 1 : 0;
    }

    const updated = await db
      .update(listings)
      .set(updates)
      .where(eq(listings.id, listingId))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const listingId = parseInt(id);

    // Check if listing exists
    const existingListing = await db
      .select()
      .from(listings)
      .where(eq(listings.id, listingId))
      .limit(1);

    if (existingListing.length === 0) {
      return NextResponse.json(
        { error: 'Listing not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    await db.delete(listings).where(eq(listings.id, listingId)).returning();

    return NextResponse.json(
      {
        message: 'Listing deleted successfully',
        id: listingId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}