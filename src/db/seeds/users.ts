import { db } from '@/db';
import { users } from '@/db/schema';
import bcrypt from 'bcrypt';

async function main() {
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
    
    console.log('✅ Users seeder completed successfully');
    console.log('📝 Default password for all users: password123');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
    process.exit(1);
});
