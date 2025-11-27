import { db } from '@/db';
import { users } from '@/db/schema';

async function main() {
    const sampleUsers = [
        {
            email: 'admin@rentalplatform.com',
            firstName: 'Sarah',
            lastName: 'Admin',
            password: 'hashed_password_here',
            role: 'admin',
            createdAt: new Date('2023-08-15').toISOString(),
        },
        {
            email: 'admin.support@rentalplatform.com',
            firstName: 'Michael',
            lastName: 'Thompson',
            password: 'hashed_password_here',
            role: 'admin',
            createdAt: new Date('2023-09-01').toISOString(),
        },
        {
            email: 'james.martinez@gmail.com',
            firstName: 'James',
            lastName: 'Martinez',
            password: 'hashed_password_here',
            role: 'renter',
            createdAt: new Date('2023-10-12').toISOString(),
        },
        {
            email: 'emily.chen@outlook.com',
            firstName: 'Emily',
            lastName: 'Chen',
            password: 'hashed_password_here',
            role: 'renter',
            createdAt: new Date('2023-11-05').toISOString(),
        },
        {
            email: 'david.johnson@email.com',
            firstName: 'David',
            lastName: 'Johnson',
            password: 'hashed_password_here',
            role: 'renter',
            createdAt: new Date('2023-11-18').toISOString(),
        },
        {
            email: 'maria.garcia@yahoo.com',
            firstName: 'Maria',
            lastName: 'Garcia',
            password: 'hashed_password_here',
            role: 'renter',
            createdAt: new Date('2023-12-03').toISOString(),
        },
        {
            email: 'robert.patel@gmail.com',
            firstName: 'Robert',
            lastName: 'Patel',
            password: 'hashed_password_here',
            role: 'renter',
            createdAt: new Date('2023-12-20').toISOString(),
        },
        {
            email: 'jessica.williams@outlook.com',
            firstName: 'Jessica',
            lastName: 'Williams',
            password: 'hashed_password_here',
            role: 'renter',
            createdAt: new Date('2024-01-08').toISOString(),
        },
        {
            email: 'ahmed.hassan@email.com',
            firstName: 'Ahmed',
            lastName: 'Hassan',
            password: 'hashed_password_here',
            role: 'renter',
            createdAt: new Date('2024-01-25').toISOString(),
        },
        {
            email: 'sophia.nguyen@gmail.com',
            firstName: 'Sophia',
            lastName: 'Nguyen',
            password: 'hashed_password_here',
            role: 'renter',
            createdAt: new Date('2024-02-10').toISOString(),
        },
    ];

    await db.insert(users).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});