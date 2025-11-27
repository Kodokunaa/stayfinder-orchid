import { db } from '@/db';
import { users } from '@/db/schema';

async function main() {
    const sampleUsers = [
        {
            email: 'admin@airbnb.com',
            name: 'Admin User',
            role: 'admin',
            image: 'https://i.pravatar.cc/150?img=1',
            createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            email: 'john.smith@email.com',
            name: 'John Smith',
            role: 'user',
            image: 'https://i.pravatar.cc/150?img=12',
            createdAt: new Date(Date.now() - 145 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            email: 'sarah.j@email.com',
            name: 'Sarah Johnson',
            role: 'user',
            image: 'https://i.pravatar.cc/150?img=45',
            createdAt: new Date(Date.now() - 98 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            email: 'michael.chen@email.com',
            name: 'Michael Chen',
            role: 'user',
            image: 'https://i.pravatar.cc/150?img=33',
            createdAt: new Date(Date.now() - 62 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            email: 'emma.w@email.com',
            name: 'Emma Williams',
            role: 'user',
            image: 'https://i.pravatar.cc/150?img=25',
            createdAt: new Date(Date.now() - 34 * 24 * 60 * 60 * 1000).toISOString(),
        }
    ];

    await db.insert(users).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});