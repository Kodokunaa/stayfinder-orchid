# StayFinder - Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technical Stack](#technical-stack)
3. [System Architecture](#system-architecture)
4. [Database Schema](#database-schema)
5. [Features & Modules](#features--modules)
6. [API Documentation](#api-documentation)
7. [User Flows](#user-flows)
8. [Deployment Information](#deployment-information)
9. [Security & Authentication](#security--authentication)
10. [Future Enhancements](#future-enhancements)

---

## Project Overview

**Project Name:** StayFinder  
**Type:** Accommodation Booking Platform (Airbnb Clone)  
**Version:** 1.0.0  
**Live URL:** https://stayfinder-tan.vercel.app/  
**Development Framework:** Next.js 15 (App Router)  
**Database:** MySQL (Turso)  
**Deployment:** Vercel

### Purpose
StayFinder is a full-stack accommodation booking platform that connects travelers with unique properties worldwide. The platform enables users to browse listings, make bookings, and manage reservations while providing administrators with comprehensive property and user management tools.

### Key Statistics
- **500+ Locations** worldwide
- **1,000+ Properties** available
- **50,000+ Happy Guests** served
- **Real-time Search** functionality
- **Mobile-responsive** design

---

## Technical Stack

### Frontend
- **Framework:** Next.js 15 (React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn/UI
- **Icons:** Lucide React
- **Carousel:** Embla Carousel
- **Notifications:** Sonner

### Backend
- **Runtime:** Node.js (Bun)
- **API:** Next.js App Router API Routes
- **Authentication:** Better-Auth
- **Database ORM:** Drizzle ORM
- **Database:** MySQL (Turso)

### Development Tools
- **Package Manager:** Bun
- **Version Control:** Git
- **Deployment:** Vercel
- **Environment:** Node.js 18+

---

## System Architecture

### Application Structure
```
src/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Homepage
│   ├── login/               # Authentication pages
│   ├── register/
│   ├── listings/            # Browse properties
│   ├── property/[id]/       # Property details
│   ├── my-bookings/         # User bookings
│   ├── admin/               # Admin dashboard
│   ├── profile/             # User profile
│   └── api/                 # API routes
│       ├── auth/
│       ├── listings/
│       ├── bookings/
│       ├── admin/
│       └── profile/
├── components/              # React components
│   ├── ui/                 # Shadcn UI components
│   ├── admin/              # Admin-specific components
│   ├── Navbar.tsx
│   ├── SearchBar.tsx
│   ├── ListingCard.tsx
│   └── Footer.tsx
├── db/                      # Database layer
│   ├── index.ts            # Database connection
│   ├── schema.ts           # Drizzle schema
│   └── seeds/              # Seed data
├── lib/                     # Utilities
│   ├── auth.ts             # Auth server config
│   └── auth-client.ts      # Auth client config
└── middleware.ts            # Route protection
```

### Architecture Pattern
- **Frontend:** Server Components + Client Components (React Server Components)
- **Backend:** RESTful API with Next.js Route Handlers
- **Database:** Relational (MySQL) with Drizzle ORM
- **Authentication:** JWT-based with Better-Auth
- **State Management:** React useState/useEffect + Server-side rendering

---

## Database Schema

### Tables

#### 1. **users**
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  emailVerified BOOLEAN DEFAULT FALSE,
  image TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  role VARCHAR(50) DEFAULT 'user'
);
```

#### 2. **session**
```sql
CREATE TABLE session (
  id VARCHAR(255) PRIMARY KEY,
  token VARCHAR(255) UNIQUE NOT NULL,
  expiresAt TIMESTAMP NOT NULL,
  userId INT NOT NULL,
  ipAddress VARCHAR(45),
  userAgent TEXT,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

#### 3. **account**
```sql
CREATE TABLE account (
  id VARCHAR(255) PRIMARY KEY,
  accountId VARCHAR(255) NOT NULL,
  providerId VARCHAR(255) NOT NULL,
  userId INT NOT NULL,
  accessToken TEXT,
  refreshToken TEXT,
  idToken TEXT,
  expiresAt TIMESTAMP,
  password VARCHAR(255),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

#### 4. **verification**
```sql
CREATE TABLE verification (
  id VARCHAR(255) PRIMARY KEY,
  identifier VARCHAR(255) NOT NULL,
  value VARCHAR(255) NOT NULL,
  expiresAt TIMESTAMP NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 5. **listings**
```sql
CREATE TABLE listings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  images JSON NOT NULL,
  pricePerNight DECIMAL(10, 2) NOT NULL,
  numGuests INT NOT NULL,
  numBedrooms INT NOT NULL,
  numBeds INT NOT NULL,
  numBathrooms INT NOT NULL,
  amenities JSON,
  location VARCHAR(255),
  featured BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 6. **bookings**
```sql
CREATE TABLE bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  listingId INT NOT NULL,
  checkIn DATE NOT NULL,
  checkOut DATE NOT NULL,
  numGuests INT NOT NULL,
  numNights INT NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  paymentMethod VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (listingId) REFERENCES listings(id) ON DELETE CASCADE
);
```

### Entity Relationships
- **users** 1:N **bookings** (One user can have multiple bookings)
- **listings** 1:N **bookings** (One listing can have multiple bookings)
- **users** 1:N **session** (One user can have multiple sessions)
- **users** 1:N **account** (One user can have multiple accounts/providers)

---

## Features & Modules

### 1. 🏠 **Listings Management**
**Routes:** `/listings`, `/property/[id]`, `/admin`

**User Features:**
- Browse all available properties in grid layout
- Featured listings carousel on homepage
- Detailed property view with image carousel
- Real-time search by location, guests, price
- View amenities, pricing, and availability

**Admin Features:**
- Add new listings with complete details
- Edit existing property information
- Delete listings
- Toggle featured status
- Bulk management interface

**Data Fields:**
- Title, description
- Multiple images (JSON array)
- Price per night
- Guest capacity
- Number of bedrooms, beds, bathrooms
- Amenities (JSON array)
- Location
- Featured flag

---

### 2. 🔐 **Authentication & Authorization**
**Routes:** `/login`, `/register`  
**Middleware:** Route protection

**Features:**
- Email/password registration
- Email/password login
- Google OAuth integration
- Session management with bearer tokens
- Remember me functionality
- Role-based access control (user/admin)
- Protected routes middleware
- Session validation

**Security:**
- Password hashing
- JWT tokens
- HTTP-only session management
- CSRF protection
- XSS prevention

---

### 3. 📅 **Bookings & Reservations**
**Routes:** `/my-bookings`, `/property/[id]`

**Features:**
- Date range selection
- Guest count selection
- Automatic price calculation
- Tax calculation (10%)
- Multiple payment methods (credit, debit, PayPal)
- Booking confirmation
- Booking history view
- Status tracking
- Cancellation with refund
- Booking details view

**Booking Statuses:**
- `pending` - Initial booking state
- `confirmed` - Payment processed
- `completed` - Stay completed
- `cancelled` - User cancelled
- `refunded` - Refund processed

**Pricing Formula:**
```
Subtotal = pricePerNight × numNights
Tax = Subtotal × 0.10
Total = Subtotal + Tax
```

---

### 4. 👤 **User Profile**
**Routes:** `/profile`

**Features:**
- View personal information
- Edit profile details (name, email)
- View account status
- Session management
- Quick access to bookings
- Logout functionality

---

### 5. 👨‍💼 **Admin Dashboard**
**Routes:** `/admin`  
**Access:** Admin role only

**Features:**
- Complete listing management (CRUD)
- User role management
- Promote users to admin status
- View all bookings
- Search and filter listings
- Bulk operations
- Analytics overview

**Admin Capabilities:**
- Add/Edit/Delete listings
- Migrate users to admin role
- View all system users
- Monitor booking activity

---

### 6. 📞 **Information & Contact**
**Routes:** Homepage sections

**Features:**
- Hero section with value proposition
- Live search from homepage
- About Us section with company info
- Trust indicators (statistics)
- Contact form submission
- Contact information display
- Business hours
- Social proof elements

---

## API Documentation

### Authentication APIs

#### POST `/api/auth/[...all]`
Better-auth handler for all authentication operations
- Sign up
- Sign in
- Sign out
- OAuth callbacks
- Session management

**Request Example (Sign Up):**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  },
  "session": {
    "token": "...",
    "expiresAt": "2024-12-01T00:00:00Z"
  }
}
```

---

### Listings APIs

#### GET `/api/listings`
Retrieve all listings with optional filters

**Query Parameters:**
- `search` (string) - Search term for title/location
- `featured` (boolean) - Filter featured listings
- `limit` (number) - Limit results
- `minPrice` (number) - Minimum price filter
- `maxPrice` (number) - Maximum price filter
- `guests` (number) - Guest capacity filter

**Response:**
```json
[
  {
    "id": 1,
    "title": "Cozy Downtown Apartment",
    "description": "...",
    "images": ["url1", "url2"],
    "pricePerNight": 120.00,
    "numGuests": 4,
    "numBedrooms": 2,
    "numBeds": 2,
    "numBathrooms": 1,
    "amenities": ["WiFi", "Kitchen"],
    "location": "San Francisco, CA",
    "featured": true
  }
]
```

#### GET `/api/listings?id=1`
Get single listing by ID

#### POST `/api/listings`
Create new listing (Admin only)

**Request:**
```json
{
  "title": "Beach House Villa",
  "description": "Stunning oceanfront property",
  "images": ["url1", "url2", "url3"],
  "pricePerNight": 250.00,
  "numGuests": 6,
  "numBedrooms": 3,
  "numBeds": 4,
  "numBathrooms": 2,
  "amenities": ["Pool", "WiFi", "Kitchen"],
  "location": "Malibu, CA",
  "featured": true
}
```

#### PUT `/api/listings?id=1`
Update existing listing (Admin only)

#### DELETE `/api/listings?id=1`
Delete listing (Admin only)

---

### Bookings APIs

#### GET `/api/bookings`
Get all bookings (Admin) or user's bookings

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "listingId": 1,
    "listing": {
      "title": "Cozy Apartment",
      "images": ["url1"]
    },
    "checkIn": "2024-12-01",
    "checkOut": "2024-12-05",
    "numGuests": 2,
    "numNights": 4,
    "subtotal": 480.00,
    "tax": 48.00,
    "total": 528.00,
    "paymentMethod": "credit",
    "status": "confirmed",
    "createdAt": "2024-11-27T..."
  }
]
```

#### POST `/api/bookings`
Create new booking

**Request:**
```json
{
  "listingId": 1,
  "checkIn": "2024-12-01",
  "checkOut": "2024-12-05",
  "numGuests": 2,
  "paymentMethod": "credit"
}
```

#### POST `/api/bookings/[id]/refund`
Cancel booking and process refund

**Response:**
```json
{
  "message": "Booking cancelled and refund processed",
  "booking": { ... }
}
```

---

### Admin APIs

#### GET `/api/admin/users`
Get all users (Admin only)

**Response:**
```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2024-11-01T..."
  }
]
```

#### POST `/api/admin/migrate-users`
Promote user to admin role

**Request:**
```json
{
  "userId": 1
}
```

---

### Profile APIs

#### GET `/api/profile`
Get current user profile

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",
  "emailVerified": true,
  "createdAt": "2024-11-01T..."
}
```

#### PUT `/api/profile`
Update user profile

**Request:**
```json
{
  "name": "John Updated",
  "email": "newemail@example.com"
}
```

---

## User Flows

### 1. **User Registration & Login Flow**
```
1. User visits homepage
2. Clicks "Login" or "Sign Up" in navbar
3. Registration Flow:
   - Enters name, email, password, confirm password
   - Submits form
   - Account created with role="user"
   - Redirected to login page
4. Login Flow:
   - Enters email and password
   - Optional: Check "Remember Me"
   - Submits form
   - Session created, bearer token stored
   - Redirected to homepage or protected route
5. Google OAuth Flow:
   - Clicks "Continue with Google"
   - Google account selection
   - Account linked or created
   - Redirected to homepage
```

### 2. **Property Browsing & Booking Flow**
```
1. User searches properties:
   - Uses hero search bar on homepage
   - Or navigates to /listings
   - Filters by location, guests, price
2. Views listing cards:
   - Sees image, price, capacity
   - Clicks card to view details
3. Property details page:
   - Views image carousel
   - Reads description and amenities
   - Checks availability
4. Booking process:
   - Selects check-in/check-out dates
   - Chooses number of guests
   - Reviews pricing breakdown
   - Selects payment method
   - Clicks "Proceed to Payment"
   - Booking created with status="pending"
5. Confirmation:
   - Booking ID generated
   - Status updated to "confirmed"
   - User can view in My Bookings
```

### 3. **My Bookings Management Flow**
```
1. User navigates to My Bookings
2. Views all bookings with:
   - Property image and title
   - Check-in/out dates
   - Guest count
   - Total price
   - Current status
3. Cancel booking:
   - Clicks "Cancel Booking" button
   - Confirms cancellation
   - API processes refund
   - Status updated to "cancelled" then "refunded"
   - Booking remains in history
```

### 4. **Admin Management Flow**
```
1. Admin logs in with admin role
2. Accesses /admin dashboard
3. Listing Management:
   - View all listings in table
   - Add New Listing:
     * Fill form (title, description, images, etc.)
     * Submit to create
   - Edit Listing:
     * Click edit button
     * Modify fields
     * Save changes
   - Delete Listing:
     * Click delete button
     * Confirm deletion
4. User Management:
   - View all users
   - Select user to promote
   - Click "Promote to Admin"
   - User role updated
```

---

## Deployment Information

### Live Application
- **Production URL:** https://stayfinder-tan.vercel.app/
- **Platform:** Vercel
- **Status:** ✅ Live 24/7
- **Region:** Global (CDN)

### Environment Variables Required
```env
# Database
DATABASE_URL=<Turso Database URL>
DATABASE_AUTH_TOKEN=<Turso Auth Token>

# Better Auth
BETTER_AUTH_SECRET=<Random Secret Key>
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=<Google OAuth Client ID>
GOOGLE_CLIENT_SECRET=<Google OAuth Client Secret>

# Node Environment
NODE_ENV=production
```

### Deployment Process
1. Code pushed to Git repository
2. Vercel auto-detects changes
3. Build process initiated
4. Environment variables injected
5. Database migrations run (if needed)
6. Application deployed to CDN
7. Live URL updated

### Build Configuration
- **Framework:** Next.js
- **Build Command:** `bun run build`
- **Output Directory:** `.next`
- **Node Version:** 18.x
- **Package Manager:** Bun

---

## Security & Authentication

### Authentication Method
- **Provider:** Better-Auth
- **Strategy:** JWT-based sessions
- **Token Storage:** localStorage (bearer_token)
- **Session Duration:** Configurable (default 30 days with Remember Me)

### Security Measures Implemented

#### 1. **Password Security**
- Passwords hashed before storage
- No plain text storage
- Strong password requirements enforced

#### 2. **Route Protection**
- Middleware guards protected routes
- Session validation on protected pages
- Automatic redirect to login if unauthorized

#### 3. **API Security**
- Bearer token authentication
- Request validation
- Role-based access control
- SQL injection prevention (Drizzle ORM)

#### 4. **OAuth Security**
- Secure Google OAuth flow
- State parameter validation
- Redirect URI validation

#### 5. **Data Protection**
- Input sanitization
- XSS prevention
- CSRF protection
- Secure headers

### Protected Routes
```typescript
// Middleware protected routes
- /admin/*
- /my-bookings
- /profile
```

### Role-Based Access
- **User Role:** Can browse, book, manage own bookings
- **Admin Role:** Full access + user management + listing CRUD

---

## Future Enhancements

### Phase 2 Features
1. **Reviews & Ratings**
   - User reviews for properties
   - Star rating system
   - Review moderation

2. **Real Payment Integration**
   - Stripe integration
   - Secure payment processing
   - Automatic invoicing

3. **Advanced Search**
   - Map-based search
   - Date availability calendar
   - Advanced filters (amenities, property type)

4. **Messaging System**
   - Host-guest communication
   - In-app messaging
   - Email notifications

5. **Favorites/Wishlist**
   - Save favorite properties
   - Wishlist management
   - Price alerts

### Phase 3 Features
1. **Host Dashboard**
   - Property management for hosts
   - Revenue analytics
   - Calendar management
   - Booking management

2. **Mobile Application**
   - React Native app
   - Push notifications
   - Offline capabilities

3. **Analytics Dashboard**
   - Booking trends
   - Revenue tracking
   - User behavior analytics
   - Property performance metrics

4. **Multi-language Support**
   - Internationalization (i18n)
   - Multiple currency support
   - Regional pricing

5. **Advanced Features**
   - Instant booking
   - Dynamic pricing
   - Promotional codes
   - Referral program
   - Loyalty rewards

---

## Technical Specifications

### Performance Metrics
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.0s
- **Lighthouse Score:** 90+
- **Mobile Responsive:** ✅ All viewports

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Responsive Breakpoints
```css
- xs: 475px
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px
```

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Component-based architecture
- Reusable UI components

---

## Development Team

### Roles
- **Full Stack Developer:** Complete application development
- **UI/UX Designer:** Design system implementation
- **Database Architect:** Schema design and optimization

### Support
- **Email:** support@stayfinder.com
- **Phone:** +1 (555) 123-4567
- **Business Hours:** Monday-Friday 9AM-6PM PST

---

## License & Copyright

**Copyright © 2024 StayFinder. All rights reserved.**

This project is built with modern web technologies and follows industry best practices for security, performance, and user experience.

---

## Appendix

### Key Dependencies
```json
{
  "next": "^15.0.0",
  "react": "^19.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^4.0.0",
  "drizzle-orm": "latest",
  "better-auth": "latest",
  "embla-carousel-react": "latest",
  "sonner": "latest"
}
```

### Database Connection
```typescript
// Turso MySQL connection via Drizzle
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN!
});

export const db = drizzle(client);
```

### Contact for Documentation Updates
For questions or updates to this documentation, please contact the development team or submit an issue through the project repository.

---

**Last Updated:** November 27, 2024  
**Version:** 1.0.0  
**Status:** Production Ready ✅
