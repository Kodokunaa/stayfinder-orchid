# StayFinder - XAMPP MySQL Setup Guide

This guide will help you set up and run StayFinder locally using XAMPP's MySQL database.

## Prerequisites

- [XAMPP](https://www.apachefriends.org/download.html) installed on your computer
- [Node.js](https://nodejs.org/) (v18 or higher) or [Bun](https://bun.sh/)
- [Git](https://git-scm.com/) (optional, for cloning)

## Step 1: Install and Start XAMPP

1. **Download and Install XAMPP** from https://www.apachefriends.org/
2. **Start XAMPP Control Panel**
3. **Start Apache and MySQL** modules by clicking the "Start" buttons

![XAMPP Control Panel](https://i.imgur.com/xampp-example.png)

## Step 2: Create Database

1. **Open phpMyAdmin** by clicking the "Admin" button next to MySQL in XAMPP Control Panel
   - Or navigate to: http://localhost/phpmyadmin

2. **Create a new database**:
   - Click "New" in the left sidebar
   - Database name: `stayfinder`
   - Collation: `utf8mb4_general_ci` (recommended)
   - Click "Create"

## Step 3: Configure Environment Variables

The `.env` file in your project root is already configured for XAMPP defaults:

```env
# MySQL Database Configuration (XAMPP)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=stayfinder

# Authentication
BETTER_AUTH_SECRET=a99ap/NKTAf8LL6K0T9yjZphgHHWbwaItxuNXl3ungU=
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth (Optional - for Google Sign-In)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Note**: XAMPP's default MySQL configuration:
- Host: `localhost`
- Port: `3306`
- User: `root`
- Password: `` (empty by default)

If you've set a MySQL password in XAMPP, update `DB_PASSWORD` accordingly.

## Step 4: Install Dependencies

Open a terminal in your project directory and run:

```bash
# Using npm
npm install

# Or using bun (faster)
bun install
```

## Step 5: Set Up Database Schema

Run the following command to create all database tables:

```bash
# Using npm
npm run db:push

# Or using bun
bun run db:push
```

This will create all necessary tables:
- `user` - Better Auth user accounts
- `session` - Better Auth sessions
- `account` - Better Auth OAuth accounts
- `verification` - Better Auth email verification
- `users` - Legacy users table
- `user_sessions` - Custom sessions for legacy users
- `listings` - Property listings
- `bookings` - User bookings
- `transactions` - Transaction history

## Step 6: Seed Sample Data (Optional)

To populate your database with sample listings and users for testing:

```bash
# Using npm
npm run seed

# Or using bun
bun run seed
```

## Step 7: Start the Development Server

```bash
# Using npm
npm run dev

# Or using bun
bun run dev
```

The application will be available at: **http://localhost:3000**

## Troubleshooting

### MySQL Connection Issues

**Problem**: "Cannot connect to MySQL server"
- **Solution**: Ensure MySQL is running in XAMPP Control Panel
- Check if port 3306 is not being used by another application
- Verify your `.env` credentials match your MySQL configuration

**Problem**: "Access denied for user 'root'@'localhost'"
- **Solution**: Check if you've set a password for MySQL root user in XAMPP
- Update `DB_PASSWORD` in `.env` file accordingly

### Database Already Exists

If you get "database already exists" errors:
1. Go to phpMyAdmin
2. Drop the existing `stayfinder` database
3. Create a new one
4. Run `npm run db:push` again

### Port 3000 Already in Use

If port 3000 is already in use:
```bash
# Kill the process using port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill the process using port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9
```

### Viewing Database in phpMyAdmin

1. Open http://localhost/phpmyadmin
2. Click on `stayfinder` database in the left sidebar
3. You can view, edit, and manage all tables

## Database Studio (Alternative to phpMyAdmin)

Drizzle provides a modern database viewer:

```bash
# Using npm
npm run db:studio

# Or using bun
bun run db:studio
```

This opens a web interface at https://local.drizzle.studio

## Default Test Accounts

After seeding, you can use these test accounts:

**Admin Account**:
- Email: `admin@stayfinder.com`
- Password: `admin123`

**Regular User**:
- Email: `user@stayfinder.com`
- Password: `user123`

## Project Structure

```
stayfinder/
├── src/
│   ├── app/              # Next.js pages and API routes
│   │   ├── api/          # API endpoints
│   │   ├── admin/        # Admin dashboard
│   │   ├── listings/     # Listings page
│   │   └── property/     # Property details
│   ├── components/       # React components
│   ├── db/               # Database configuration
│   │   ├── schema.ts     # Database schema
│   │   └── index.ts      # Database connection
│   └── lib/              # Utility functions
├── drizzle/              # Database migrations
├── .env                  # Environment variables
└── package.json          # Dependencies
```

## Important Notes

1. **XAMPP must be running** whenever you want to use the application
2. **MySQL service** must be started in XAMPP Control Panel
3. Always check `.env` file for correct database credentials
4. For production, never use empty passwords and change `BETTER_AUTH_SECRET`

## Need Help?

- Check the [Next.js Documentation](https://nextjs.org/docs)
- Check the [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- Check the [XAMPP Documentation](https://www.apachefriends.org/docs/)

## Next Steps

1. Register a new account at http://localhost:3000/register
2. Explore listings at http://localhost:3000/listings
3. Create your own listing (requires admin role)
4. Test the booking system

---

**Happy coding! 🚀**
