import { db } from '@/db';
import { transactions } from '@/db/schema';

async function main() {
    const sampleTransactions = [
        // Booking payment transactions (negative amounts)
        {
            userId: 2,
            bookingId: 1,
            listingId: 1,
            amount: -66000,
            type: 'booking',
            description: 'Payment for booking #1',
            createdAt: new Date('2024-02-15T10:30:00Z').toISOString(),
        },
        {
            userId: 3,
            bookingId: 2,
            listingId: 2,
            amount: -79200,
            type: 'booking',
            description: 'Payment for booking #2',
            createdAt: new Date('2024-02-16T14:15:00Z').toISOString(),
        },
        {
            userId: 4,
            bookingId: 3,
            listingId: 3,
            amount: -177100,
            type: 'booking',
            description: 'Payment for booking #3',
            createdAt: new Date('2024-02-17T09:45:00Z').toISOString(),
        },
        {
            userId: 5,
            bookingId: 4,
            listingId: 4,
            amount: -158400,
            type: 'booking',
            description: 'Payment for booking #4',
            createdAt: new Date('2024-02-18T11:20:00Z').toISOString(),
        },
        {
            userId: 2,
            bookingId: 5,
            listingId: 5,
            amount: -198000,
            type: 'booking',
            description: 'Payment for booking #5',
            createdAt: new Date('2024-02-19T16:30:00Z').toISOString(),
        },
        {
            userId: 3,
            bookingId: 6,
            listingId: 1,
            amount: -92400,
            type: 'booking',
            description: 'Payment for booking #6',
            createdAt: new Date('2024-02-20T13:10:00Z').toISOString(),
        },
        {
            userId: 4,
            bookingId: 7,
            listingId: 2,
            amount: -110880,
            type: 'booking',
            description: 'Payment for booking #7',
            createdAt: new Date('2024-02-21T10:00:00Z').toISOString(),
        },
        {
            userId: 5,
            bookingId: 8,
            listingId: 3,
            amount: -248160,
            type: 'booking',
            description: 'Payment for booking #8',
            createdAt: new Date('2024-02-22T15:45:00Z').toISOString(),
        },
        {
            userId: 2,
            bookingId: 11,
            listingId: 5,
            amount: -277200,
            type: 'booking',
            description: 'Payment for booking #11',
            createdAt: new Date('2024-02-25T12:20:00Z').toISOString(),
        },
        {
            userId: 3,
            bookingId: 12,
            listingId: 1,
            amount: -145200,
            type: 'booking',
            description: 'Payment for booking #12',
            createdAt: new Date('2024-02-26T09:30:00Z').toISOString(),
        },
        // Refund transactions (positive amounts)
        {
            userId: 2,
            bookingId: 9,
            listingId: 4,
            amount: 79200,
            type: 'refund',
            description: 'Refund for booking #9',
            createdAt: new Date('2024-02-26T14:30:00Z').toISOString(),
        },
        {
            userId: 3,
            bookingId: 10,
            listingId: 5,
            amount: 110880,
            type: 'refund',
            description: 'Refund for booking #10',
            createdAt: new Date('2024-02-27T16:45:00Z').toISOString(),
        },
        {
            userId: 4,
            bookingId: 11,
            listingId: 5,
            amount: 277200,
            type: 'refund',
            description: 'Refund for booking #11',
            createdAt: new Date('2024-02-28T11:20:00Z').toISOString(),
        },
        {
            userId: 5,
            bookingId: 12,
            listingId: 1,
            amount: 145200,
            type: 'refund',
            description: 'Refund for booking #12',
            createdAt: new Date('2024-02-29T10:15:00Z').toISOString(),
        },
        {
            userId: 2,
            bookingId: 9,
            listingId: 4,
            amount: 158400,
            type: 'refund',
            description: 'Refund for booking #9',
            createdAt: new Date('2024-02-25T15:00:00Z').toISOString(),
        },
    ];

    await db.insert(transactions).values(sampleTransactions);
    
    console.log('✅ Transactions seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});