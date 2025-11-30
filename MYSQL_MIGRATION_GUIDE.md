# MySQL Migration Guide for StayFinder

## ✅ Completed Changes

Your StayFinder app has been successfully migrated from Turso/libSQL to MySQL!

### Files Updated:

1. **`src/db/schema.ts`**
   - Changed from `sqliteTable` to `mysqlTable`
   - Updated column types:
     - `integer` → `int`
     - `text` → `varchar` or `text` (with appropriate lengths)
     - `integer({ mode: 'boolean' })` → `boolean`
     - `integer({ mode: 'timestamp' })` → `timestamp`
   - Updated auto-increment syntax: `autoIncrement: true` → `autoincrement()`

2. **`src/db/index.ts`**
   - Changed from `drizzle-orm/libsql` to `drizzle-orm/mysql2`
   - Replaced `@libsql/client` with `mysql2/promise`
   - Updated connection from Turso to MySQL connection pool

3. **`drizzle.config.ts`**
   - Changed dialect from `turso` to `mysql`
   - Updated database credentials to MySQL format

4. **`.env`**
   - Replaced Turso credentials with MySQL credentials
   - Kept Better Auth and Google OAuth configuration

5. **`package.json`**
   - Added `mysql2` package (installed)

---

## 🗄️ Database Setup

### Option 1: Local MySQL Installation

#### Install MySQL:

**macOS (using Homebrew):**
```bash
brew install mysql
brew services start mysql
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

**Windows:**
Download and install from: https://dev.mysql.com/downloads/installer/

#### Create Database:
```bash
mysql -u root -p
```

Then run:
```sql
CREATE DATABASE stayfinder;
CREATE USER 'stayfinder_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON stayfinder.* TO 'stayfinder_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Update `.env`:
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=stayfinder_user
MYSQL_PASSWORD=your_secure_password
MYSQL_DATABASE=stayfinder
```

---

### Option 2: Cloud MySQL Services

#### **PlanetScale** (Recommended - Free Tier Available)
1. Sign up at https://planetscale.com
2. Create a new database
3. Get connection details
4. Update `.env`:
```env
MYSQL_HOST=your-database.us-east-1.psdb.cloud
MYSQL_PORT=3306
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=stayfinder
```

#### **Railway**
1. Sign up at https://railway.app
2. Create MySQL database
3. Copy connection details to `.env`

#### **AWS RDS**
1. Create MySQL instance in AWS RDS
2. Configure security groups
3. Update `.env` with endpoint details

#### **Google Cloud SQL**
1. Create MySQL instance
2. Configure authorized networks
3. Update `.env` with connection details

---

## 🚀 Migration Steps

### 1. Generate Migration Files
```bash
npx drizzle-kit generate
```

### 2. Push Schema to Database
```bash
npx drizzle-kit push
```

Or manually run migrations:
```bash
npx drizzle-kit migrate
```

### 3. Seed Database (Optional)
If you have seed files in `src/db/seeds/`, run them to populate initial data.

---

## 🔧 Environment Variables

Update your `.env` file with your MySQL credentials:

```env
# MySQL Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=stayfinder

# Better Auth Configuration
BETTER_AUTH_SECRET=a99ap/NKTAf8LL6K0T9yjZphgHHWbwaItxuNXl3ungU=
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth Configuration
GOOGLE_CLIENT_ID=3263888714-mhb5nve2hm2nv2am4l6024dqtl1fcb63.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

---

## 📋 Tables Created

Your database will include these tables:

1. **`user`** - Better Auth users (OAuth)
2. **`session`** - Better Auth sessions
3. **`account`** - Better Auth provider accounts
4. **`verification`** - Better Auth email verification
5. **`users`** - Legacy custom users table
6. **`user_sessions`** - Custom session management
7. **`listings`** - Property listings
8. **`bookings`** - Booking records
9. **`transactions`** - Transaction history

---

## 🧪 Testing

After migration, test these features:

- [ ] User registration (custom auth)
- [ ] Google OAuth login
- [ ] Browse listings
- [ ] Create booking
- [ ] Admin dashboard access
- [ ] View my bookings
- [ ] Profile management

---

## 🐛 Troubleshooting

### Error: "Access denied for user"
- Check MySQL username and password in `.env`
- Verify user has proper privileges

### Error: "Unknown database 'stayfinder'"
- Create the database: `CREATE DATABASE stayfinder;`

### Error: "connect ECONNREFUSED"
- Ensure MySQL server is running
- Check `MYSQL_HOST` and `MYSQL_PORT` in `.env`

### Error: "Too many connections"
- Adjust MySQL `max_connections` setting
- Check for connection leaks in your code

### Schema Differences
- Run `npx drizzle-kit generate` to create new migration
- Review generated SQL before applying
- Run `npx drizzle-kit push` to apply changes

---

## 📦 Package Changes

### Added:
- `mysql2@3.15.3` - MySQL client for Node.js

### Can Remove (Old Dependencies):
- `@libsql/client` - No longer needed

To remove old package:
```bash
npm uninstall @libsql/client
```

---

## 🔐 Security Best Practices

1. **Never commit `.env` file** - Already in `.gitignore`
2. **Use strong passwords** for MySQL users
3. **Enable SSL/TLS** for production databases
4. **Restrict database access** to your application IP only
5. **Regular backups** - Set up automated backups
6. **Update credentials** regularly

---

## 📊 Performance Tips

1. **Connection Pooling** - Already configured in `src/db/index.ts`
2. **Add Indexes** - Index frequently queried columns
3. **Query Optimization** - Use Drizzle's query builder efficiently
4. **Caching** - Consider Redis for session/data caching
5. **Monitor Performance** - Use MySQL slow query log

---

## 🎯 Next Steps

1. ✅ Set up MySQL database (local or cloud)
2. ✅ Update `.env` with your MySQL credentials
3. ✅ Run `npx drizzle-kit push` to create tables
4. ✅ Test authentication and core features
5. ✅ Seed database with sample data (optional)
6. ✅ Deploy to production with production MySQL instance

---

## 🆘 Need Help?

- **Drizzle ORM Docs**: https://orm.drizzle.team/docs/overview
- **MySQL Docs**: https://dev.mysql.com/doc/
- **Better Auth Docs**: https://www.better-auth.com/docs

---

## ✨ Benefits of MySQL

- ✅ Industry-standard relational database
- ✅ Better tooling and ecosystem support
- ✅ More hosting options (AWS, GCP, Azure, PlanetScale, etc.)
- ✅ Advanced features (stored procedures, triggers, views)
- ✅ Mature and well-documented
- ✅ Great performance for complex queries
- ✅ ACID compliance for data integrity

Your app is now ready to use MySQL! 🚀
