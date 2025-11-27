import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    // Query all users from Better Auth user table
    const betterAuthUsers = await db.select().from(user);
    
    if (betterAuthUsers.length === 0) {
      return NextResponse.json({
        totalUsersInBetterAuth: 0,
        usersMigrated: 0,
        usersSkipped: 0,
        migratedUserEmails: [],
        skippedUserEmails: [],
        allCustomUsers: []
      }, { status: 200 });
    }

    const migratedEmails: string[] = [];
    const skippedEmails: string[] = [];
    let migratedCount = 0;
    let skippedCount = 0;

    // Process each user
    for (const betterAuthUser of betterAuthUsers) {
      try {
        // Check if email already exists in custom users table
        const existingUser = await db.select()
          .from(users)
          .where(eq(users.email, betterAuthUser.email))
          .limit(1);

        if (existingUser.length > 0) {
          // User already exists, skip
          skippedEmails.push(betterAuthUser.email);
          skippedCount++;
          continue;
        }

        // Split name into firstName and lastName
        const nameParts = betterAuthUser.name.trim().split(/\s+/);
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Hash the temporary password
        const hashedPassword = await bcrypt.hash('temppassword123', 10);

        // Convert timestamp to ISO string
        const createdAtISO = betterAuthUser.createdAt.toISOString();

        // Insert into custom users table
        await db.insert(users).values({
          email: betterAuthUser.email,
          firstName: firstName,
          lastName: lastName,
          password: hashedPassword,
          role: 'renter',
          profilePicture: betterAuthUser.image || null,
          createdAt: createdAtISO
        });

        migratedEmails.push(betterAuthUser.email);
        migratedCount++;
      } catch (userError) {
        console.error(`Error migrating user ${betterAuthUser.email}:`, userError);
        // Continue with next user even if one fails
        skippedEmails.push(betterAuthUser.email);
        skippedCount++;
      }
    }

    // Query all users from custom users table
    const allCustomUsers = await db.select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
      createdAt: users.createdAt
    }).from(users);

    return NextResponse.json({
      totalUsersInBetterAuth: betterAuthUsers.length,
      usersMigrated: migratedCount,
      usersSkipped: skippedCount,
      migratedUserEmails: migratedEmails,
      skippedUserEmails: skippedEmails,
      allCustomUsers: allCustomUsers
    }, { status: 200 });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ 
      error: 'Internal server error during migration: ' + (error instanceof Error ? error.message : 'Unknown error'),
      code: 'MIGRATION_FAILED'
    }, { status: 500 });
  }
}