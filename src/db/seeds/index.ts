import { db } from '@/db';
import { users, listings, bookings, transactions } from '@/db/schema';
import bcrypt from 'bcrypt';
import { sql } from 'drizzle-orm';

async function clearDatabase() {
    console.log('🗑️  Clearing existing data...');
    await db.delete(transactions);
    await db.delete(bookings);
    await db.delete(listings);
    await db.delete(users);
    console.log('✅ Database cleared');
}

async function seedUsers() {
    console.log('👤 Seeding users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const sampleUsers = [
        {
            email: 'admin@stayfinder.com',
            firstName: 'Admin',
            lastName: 'User',
            password: hashedPassword,
            role: 'admin',
            profilePicture: null,
            createdAt: new Date('2024-01-01'),
        },
        {
            email: 'john.doe@example.com',
            firstName: 'John',
            lastName: 'Doe',
            password: hashedPassword,
            role: 'renter',
            profilePicture: null,
            createdAt: new Date('2024-01-05'),
        },
        {
            email: 'jane.smith@example.com',
            firstName: 'Jane',
            lastName: 'Smith',
            password: hashedPassword,
            role: 'renter',
            profilePicture: null,
            createdAt: new Date('2024-01-10'),
        },
        {
            email: 'mike.johnson@example.com',
            firstName: 'Mike',
            lastName: 'Johnson',
            password: hashedPassword,
            role: 'renter',
            profilePicture: null,
            createdAt: new Date('2024-01-15'),
        },
        {
            email: 'sarah.williams@example.com',
            firstName: 'Sarah',
            lastName: 'Williams',
            password: hashedPassword,
            role: 'renter',
            profilePicture: null,
            createdAt: new Date('2024-01-20'),
        },
    ];

    await db.insert(users).values(sampleUsers);
    console.log('✅ Users seeded');
}

async function seedListings() {
    console.log('🏠 Seeding listings...');
    const featuredListings = [
        {
            featured: 1,
            title: 'Cozy Downtown Loft with Skyline Views',
            description: 'Modern industrial loft in the heart of downtown featuring floor-to-ceiling windows with stunning city skyline views. Perfect for business travelers and couples seeking an urban escape. Walking distance to restaurants, shops, and entertainment.',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
                'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800'
            ]),
            pricePerNight: 145,
            numGuests: 2,
            numBedrooms: 1,
            numBeds: 1,
            numBathrooms: 1,
            status: 'available',
            userId: 1,
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15'),
        },
        {
            featured: 1,
            title: 'Luxury Urban Penthouse Suite',
            description: 'Spectacular penthouse with panoramic city views, private rooftop terrace, and designer furnishings. This executive residence offers ultimate comfort with a gourmet kitchen, spa-like bathrooms, and concierge services. Ideal for executives and luxury travelers.',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
                'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800'
            ]),
            pricePerNight: 425,
            numGuests: 6,
            numBedrooms: 3,
            numBeds: 4,
            numBathrooms: 3,
            status: 'available',
            userId: 2,
            createdAt: new Date('2024-01-20'),
            updatedAt: new Date('2024-01-20'),
        },
        {
            featured: 1,
            title: 'Beachfront Paradise Villa',
            description: 'Wake up to ocean waves in this stunning beachfront villa with private beach access and infinity pool. Features open-plan living spaces, outdoor dining areas, and breathtaking sunset views. Perfect for families and groups seeking a tropical getaway.',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800',
                'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800',
                'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
                'https://images.unsplash.com/photo-1615571022219-eb45cf7faa9d?w=800'
            ]),
            pricePerNight: 380,
            numGuests: 8,
            numBedrooms: 4,
            numBeds: 5,
            numBathrooms: 3,
            status: 'available',
            userId: 3,
            createdAt: new Date('2024-02-01'),
            updatedAt: new Date('2024-02-01'),
        },
        {
            featured: 1,
            title: 'Coastal Cottage by the Sea',
            description: 'Charming seaside cottage with direct beach access and spectacular ocean views from every room. Features a cozy fireplace, screened porch, and outdoor shower. Ideal for romantic getaways and small families seeking coastal tranquility.',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
                'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800',
                'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800',
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
            ]),
            pricePerNight: 195,
            numGuests: 4,
            numBedrooms: 2,
            numBeds: 3,
            numBathrooms: 2,
            status: 'available',
            userId: 4,
            createdAt: new Date('2024-02-10'),
            updatedAt: new Date('2024-02-10'),
        },
        {
            featured: 1,
            title: 'Mountain View Retreat Cabin',
            description: 'Secluded mountain cabin surrounded by towering pines with panoramic mountain vistas. Features a stone fireplace, wraparound deck, and hot tub. Perfect for nature lovers and those seeking a peaceful mountain escape with hiking trails nearby.',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800',
                'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800',
                'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800',
                'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800'
            ]),
            pricePerNight: 175,
            numGuests: 6,
            numBedrooms: 3,
            numBeds: 4,
            numBathrooms: 2,
            status: 'available',
            userId: 5,
            createdAt: new Date('2024-02-15'),
            updatedAt: new Date('2024-02-15'),
        },
        {
            featured: 1,
            title: 'Alpine Lodge with Mountain Views',
            description: 'Luxurious alpine lodge featuring vaulted ceilings, floor-to-ceiling windows overlooking snow-capped peaks, and a grand stone fireplace. Includes game room, ski storage, and heated outdoor pool. Ideal for large groups and winter sports enthusiasts.',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1518732714860-b62714ce0c59?w=800',
                'https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?w=800',
                'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800',
                'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
                'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800'
            ]),
            pricePerNight: 340,
            numGuests: 8,
            numBedrooms: 4,
            numBeds: 6,
            numBathrooms: 3,
            status: 'available',
            userId: 1,
            createdAt: new Date('2024-02-20'),
            updatedAt: new Date('2024-02-20'),
        },
        {
            featured: 1,
            title: 'Mediterranean Villa with Private Pool',
            description: 'Stunning Mediterranean-style villa featuring terracotta tiles, arched doorways, and a resort-style pool with waterfall. Expansive outdoor living spaces with al fresco dining, pizza oven, and lush gardens. Perfect for entertaining and luxury family vacations.',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
                'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
                'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800',
                'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800'
            ]),
            pricePerNight: 450,
            numGuests: 8,
            numBedrooms: 4,
            numBeds: 5,
            numBathrooms: 3,
            status: 'available',
            userId: 2,
            createdAt: new Date('2024-03-01'),
            updatedAt: new Date('2024-03-01'),
        },
        {
            featured: 1,
            title: 'Elegant Garden Estate',
            description: 'Sophisticated estate home nestled on manicured grounds with English gardens, koi pond, and outdoor pavilion. Features gourmet kitchen, wine cellar, and library. Ideal for special occasions, family reunions, and those seeking refined luxury.',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800',
                'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800',
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
                'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800',
                'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800'
            ]),
            pricePerNight: 320,
            numGuests: 6,
            numBedrooms: 3,
            numBeds: 4,
            numBathrooms: 2,
            status: 'available',
            userId: 3,
            createdAt: new Date('2024-03-05'),
            updatedAt: new Date('2024-03-05'),
        },
        {
            featured: 1,
            title: 'Enchanted Treehouse Escape',
            description: 'Magical treehouse nestled 20 feet high among ancient oaks with suspension bridges connecting multiple rooms. Features modern amenities, skylight bedroom, and wraparound deck. Perfect for adventurous couples and families seeking a unique nature experience.',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1618767689160-da3fb810aad7?w=800',
                'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
                'https://images.unsplash.com/photo-1537726235470-8504e3beef77?w=800',
                'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800'
            ]),
            pricePerNight: 125,
            numGuests: 4,
            numBedrooms: 2,
            numBeds: 2,
            numBathrooms: 1,
            status: 'available',
            userId: 4,
            createdAt: new Date('2024-03-10'),
            updatedAt: new Date('2024-03-10'),
        },
        {
            featured: 1,
            title: 'Restored Historic Farmhouse',
            description: 'Beautifully restored 1890s farmhouse blending original character with modern comforts. Features exposed beams, vintage fixtures, chef\'s kitchen, and wrap-around porch overlooking rolling pastures. Perfect for families, reunions, and those seeking authentic rural charm.',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800',
                'https://images.unsplash.com/photo-1469022563428-aa04fef9f5a2?w=800',
                'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800',
                'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800'
            ]),
            pricePerNight: 210,
            numGuests: 6,
            numBedrooms: 3,
            numBeds: 4,
            numBathrooms: 2,
            status: 'available',
            userId: 5,
            createdAt: new Date('2024-03-15'),
            updatedAt: new Date('2024-03-15'),
        }
    ];

    await db.insert(listings).values(featuredListings);
    console.log('✅ Listings seeded');
}

async function seedBookings() {
    console.log('📅 Seeding bookings...');
    const sampleBookings = [
        {
            listingId: 5,
            userId: 2,
            checkInDate: new Date('2025-02-10').toISOString(),
            checkOutDate: new Date('2025-02-15').toISOString(),
            numNights: 5,
            subtotal: 60000,
            tax: 6000,
            total: 66000,
            status: 'confirmed',
            paymentMethod: 'credit_card',
            refundedAt: null,
            createdAt: new Date('2025-01-25T10:30:00'),
        },
        {
            listingId: 2,
            userId: 3,
            checkInDate: new Date('2025-02-18').toISOString(),
            checkOutDate: new Date('2025-02-22').toISOString(),
            numNights: 4,
            subtotal: 72000,
            tax: 7200,
            total: 79200,
            status: 'confirmed',
            paymentMethod: 'debit_card',
            refundedAt: null,
            createdAt: new Date('2025-01-26T14:15:00'),
        },
        {
            listingId: 3,
            userId: 4,
            checkInDate: new Date('2025-03-05').toISOString(),
            checkOutDate: new Date('2025-03-12').toISOString(),
            numNights: 7,
            subtotal: 161000,
            tax: 16100,
            total: 177100,
            status: 'confirmed',
            paymentMethod: 'paypal',
            refundedAt: null,
            createdAt: new Date('2025-01-27T09:45:00'),
        },
        {
            listingId: 4,
            userId: 5,
            checkInDate: new Date('2025-02-25').toISOString(),
            checkOutDate: new Date('2025-02-28').toISOString(),
            numNights: 3,
            subtotal: 151200,
            tax: 15120,
            total: 166320,
            status: 'confirmed',
            paymentMethod: 'credit_card',
            refundedAt: null,
            createdAt: new Date('2025-01-28T16:20:00'),
        },
        {
            listingId: 8,
            userId: 2,
            checkInDate: new Date('2025-03-15').toISOString(),
            checkOutDate: new Date('2025-03-21').toISOString(),
            numNights: 6,
            subtotal: 57600,
            tax: 5760,
            total: 63360,
            status: 'confirmed',
            paymentMethod: 'debit_card',
            refundedAt: null,
            createdAt: new Date('2025-01-29T11:00:00'),
        },
    ];

    await db.insert(bookings).values(sampleBookings);
    console.log('✅ Bookings seeded');
}

async function seedTransactions() {
    console.log('💳 Seeding transactions...');
    const sampleTransactions = [
        {
            userId: 2,
            bookingId: 1,
            listingId: 1,
            amount: -66000,
            type: 'booking',
            description: 'Payment for booking #1',
            createdAt: new Date('2024-02-15T10:30:00Z'),
        },
        {
            userId: 3,
            bookingId: 2,
            listingId: 2,
            amount: -79200,
            type: 'booking',
            description: 'Payment for booking #2',
            createdAt: new Date('2024-02-16T14:15:00Z'),
        },
        {
            userId: 4,
            bookingId: 3,
            listingId: 3,
            amount: -177100,
            type: 'booking',
            description: 'Payment for booking #3',
            createdAt: new Date('2024-02-17T09:45:00Z'),
        },
    ];

    await db.insert(transactions).values(sampleTransactions);
    console.log('✅ Transactions seeded');
}

async function main() {
    try {
        console.log('🌱 Starting database seeding...\n');
        
        await clearDatabase();
        await seedUsers();
        await seedListings();
        await seedBookings();
        await seedTransactions();
        
        console.log('\n✅ Database seeding completed successfully!');
        console.log('\n📝 Test Accounts:');
        console.log('   Admin: admin@stayfinder.com / password123');
        console.log('   User: john.doe@example.com / password123');
        console.log('   User: jane.smith@example.com / password123');
        
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Seeding failed:', error);
        process.exit(1);
    }
}

main();
