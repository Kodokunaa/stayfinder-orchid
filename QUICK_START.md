# StayFinder - Quick Start Guide for XAMPP

## 🚀 Quick Setup (5 Steps)

### 1. Start XAMPP
- Open XAMPP Control Panel
- Click **Start** on Apache and MySQL modules

### 2. Create Database
- Open phpMyAdmin: http://localhost/phpmyadmin
- Click **New** → Database name: `stayfinder` → Click **Create**

### 3. Install Dependencies
```bash
npm install
```

### 4. Setup Database Tables
```bash
npm run db:push
```

### 5. Seed Sample Data (Optional)
```bash
npm run db:seed
```

### 6. Start the App
```bash
npm run dev
```

**Your app is now running at: http://localhost:3000** 🎉

---

## 📝 Test Accounts

After seeding, login with:

**Admin Account:**
- Email: `admin@stayfinder.com`
- Password: `password123`

**Regular Users:**
- Email: `john.doe@example.com` / Password: `password123`
- Email: `jane.smith@example.com` / Password: `password123`

---

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:push` | Create/update database tables |
| `npm run db:seed` | Populate database with sample data |
| `npm run db:studio` | Open database viewer |

---

## ⚙️ Configuration

Your `.env` file is already configured for XAMPP defaults:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=stayfinder
```

**If you set a MySQL password in XAMPP**, update `DB_PASSWORD` in `.env`

---

## 🔍 Database Management

### Using phpMyAdmin:
- URL: http://localhost/phpmyadmin
- Navigate to `stayfinder` database to view/edit tables

### Using Drizzle Studio:
```bash
npm run db:studio
```
Opens at: https://local.drizzle.studio

---

## 📋 Database Tables Created

After running `npm run db:push`:

✅ `user` - Better Auth user accounts  
✅ `session` - Better Auth sessions  
✅ `account` - Better Auth OAuth accounts  
✅ `verification` - Better Auth email verification  
✅ `users` - Legacy users table  
✅ `user_sessions` - Custom sessions  
✅ `listings` - Property listings  
✅ `bookings` - User bookings  
✅ `transactions` - Transaction history  

---

## 🎯 What Gets Seeded

Running `npm run db:seed` creates:

- **5 Users**: 1 admin + 4 regular users
- **10 Featured Listings**: Various properties (lofts, villas, cabins, etc.)
- **5 Sample Bookings**: Mix of confirmed bookings
- **3 Sample Transactions**: Payment history

---

## ❌ Troubleshooting

**MySQL not connecting?**
- Ensure MySQL is running in XAMPP Control Panel (green indicator)
- Check port 3000 isn't being used by another app

**Database already exists error?**
- Drop existing database in phpMyAdmin
- Create new `stayfinder` database
- Run `npm run db:push` again

**Port 3000 already in use?**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

---

## 📖 Full Documentation

For detailed setup instructions, see:
- [XAMPP_SETUP_GUIDE.md](./XAMPP_SETUP_GUIDE.md) - Complete setup guide
- [README.md](./README.md) - Project overview

---

## 🆘 Need Help?

1. Ensure XAMPP MySQL is running (green in Control Panel)
2. Verify database `stayfinder` exists in phpMyAdmin
3. Check `.env` credentials match your MySQL configuration
4. Review error messages in terminal

---

**Happy coding! 🚀**
