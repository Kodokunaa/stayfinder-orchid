import { db } from '@/db';
import { users } from '@/db/schema';

async function main() {
    const now = new Date();
    
    const sampleUsers = [
        {
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@airbnb.com',
            role: 'admin',
            image: 'https://i.pravatar.cc/150?img=1',
            createdAt: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            firstName: 'John',
            lastName: 'Smith',
            email: 'john.smith@email.com',
            role: 'user',
            image: 'https://i.pravatar.cc/150?img=12',
            createdAt: new Date(now.getTime() - 145 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah.j@email.com',
            role: 'user',
            image: 'https://i.pravatar.cc/150?img=45',
            createdAt: new Date(now.getTime() - 98 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            firstName: 'Michael',
            lastName: 'Chen',
            email: 'michael.chen@email.com',
            role: 'user',
            image: 'https://i.pravatar.cc/150?img=33',
            createdAt: new Date(now.getTime() - 62 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            firstName: 'Emma',
            lastName: 'Williams',
            email: 'emma.w@email.com',
            role: 'user',
            image: 'https://i.pravatar.cc/150?img=25',
            createdAt: new Date(now.getTime() - 34 * 24 * 60 * 60 * 1000).toISOString(),
        }
    ];

    await db.insert(users).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});