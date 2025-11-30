# MySQL Setup Guide for StayFinder with XAMPP

## Prerequisites
- XAMPP installed on your system
- MySQL service running via XAMPP Control Panel

## Step-by-Step Setup

### 1. Start XAMPP Services
1. Open XAMPP Control Panel
2. Start **Apache** and **MySQL** services
3. Ensure both services are running (green indicators)

### 2. Create Database
1. Open phpMyAdmin by clicking "Admin" next to MySQL in XAMPP Control Panel
   - Or navigate to: `http://localhost/phpmyadmin`
2. Click on "New" in the left sidebar
3. Enter database name: `stayfinder`
4. Select collation: `utf8mb4_general_ci`
5. Click "Create"

### 3. Configure Environment Variables
The `.env` file has been updated with MySQL configuration:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=stayfinder
```

**Note:** Default XAMPP MySQL has:
- Username: `root`
- Password: (empty)
- Port: `3306`

If you've changed these settings in XAMPP, update the `.env` file accordingly.

### 4. Push Database Schema
Run the following command to create all tables in MySQL:

```bash
npm run db:push
```

This will create all the necessary tables:
- `user`, `session`, `account`, `verification` (Better Auth tables)
- `users`, `user_sessions` (Legacy auth tables)
- `listings` (Property listings)
- `bookings` (User bookings)
- `transactions` (Transaction history)

### 5. (Optional) View Database in Drizzle Studio
To visually inspect and manage your database:

```bash
npm run db:studio
```

This will open Drizzle Studio in your browser at `http://localhost:4983`

### 6. Start the Development Server
```bash
npm run dev
```

Your app will be available at `http://localhost:3000`

## Verifying the Setup

### Check Database Connection
1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Select `stayfinder` database from the left sidebar
3. You should see all tables listed:
   - account
   - bookings
   - listings
   - session
   - transactions
   - user
   - user_sessions
   - users
   - verification

### Test the Application
1. Navigate to `http://localhost:3000`
2. Try registering a new user
3. Browse listings
4. Test booking functionality

## Troubleshooting

### MySQL Service Won't Start
- **Port Conflict**: Another application might be using port 3306
  - Solution: Stop other MySQL services or change the port in XAMPP config
  
### Connection Error: "Access denied for user 'root'"
- **Wrong Password**: If you set a password for MySQL root user
  - Solution: Update `DB_PASSWORD` in `.env` file

### "Database does not exist" Error
- **Database not created**: The `stayfinder` database wasn't created
  - Solution: Follow Step 2 above to create the database manually

### Tables Not Created
- **Schema not pushed**: Run `npm run db:push` to create tables
  - If it fails, check that MySQL service is running
  - Verify database credentials in `.env`

### Port Already in Use (3306)
- Another MySQL instance is running
  - Solution 1: Stop other MySQL services
  - Solution 2: Change MySQL port in XAMPP config and update `.env`

## Key Changes from Turso to MySQL

### Database Types Mapping
- `sqliteTable` → `mysqlTable`
- `text` → `varchar(255)` or `text`
- `integer` → `int`
- `integer({ mode: 'timestamp' })` → `timestamp`
- `integer({ mode: 'boolean' })` → `boolean`
- `text({ mode: 'json' })` → `json`
- `autoIncrement: true` → `autoincrement()`

### Connection
- Changed from `@libsql/client` to `mysql2`
- Using connection pool for better performance
- Supports multiple concurrent connections

## Additional Configuration

### Change MySQL Root Password (Optional)
If you want to secure your MySQL installation:

1. Open phpMyAdmin
2. Go to "User accounts" tab
3. Find `root@localhost`
4. Click "Change password"
5. Set a new password
6. Update `DB_PASSWORD` in `.env` file

### Import Sample Data (Optional)
If you have seed data to import:

```bash
# Create a seed file in src/db/seeds/
# Then run it through your API or directly in phpMyAdmin
```

## Production Deployment

For production deployment with MySQL:
1. Use a proper MySQL password
2. Consider using environment-specific `.env` files
3. Enable MySQL SSL connections
4. Regular database backups
5. Use a dedicated MySQL server (not XAMPP)

## Support

If you encounter issues:
1. Check XAMPP error logs: `xampp/mysql/data/mysql_error.log`
2. Check Next.js console for connection errors
3. Verify all environment variables are set correctly
4. Ensure MySQL service is running in XAMPP Control Panel
