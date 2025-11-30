import { mysqlTable, int, varchar, text, boolean, timestamp, bigint } from 'drizzle-orm/mysql-core';

// Better Auth tables - required for authentication
export const user = mysqlTable('user', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
  role: varchar('role', { length: 50 }).notNull().default('renter'),
  profilePicture: text('profilePicture'),
});

export const session = mysqlTable('session', {
  id: varchar('id', { length: 255 }).primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
  ipAddress: varchar('ipAddress', { length: 45 }),
  userAgent: text('userAgent'),
  userId: varchar('userId', { length: 255 }).notNull().references(() => user.id, { onDelete: 'cascade' }),
});

export const account = mysqlTable('account', {
  id: varchar('id', { length: 255 }).primaryKey(),
  accountId: varchar('accountId', { length: 255 }).notNull(),
  providerId: varchar('providerId', { length: 255 }).notNull(),
  userId: varchar('userId', { length: 255 }).notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: varchar('password', { length: 255 }),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
});

export const verification = mysqlTable('verification', {
  id: varchar('id', { length: 255 }).primaryKey(),
  identifier: varchar('identifier', { length: 255 }).notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt'),
  updatedAt: timestamp('updatedAt'),
});

// Legacy users table - keeping for backward compatibility
export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('renter'),
  profilePicture: text('profile_picture'),
  createdAt: timestamp('created_at').notNull(),
});

// Custom sessions table for users table
export const userSessions = mysqlTable('user_sessions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
});

// Listings table
export const listings = mysqlTable('listings', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description').notNull(),
  pricePerNight: int('price_per_night').notNull(),
  numGuests: int('num_guests').notNull(),
  numBedrooms: int('num_bedrooms').notNull(),
  numBeds: int('num_beds').notNull(),
  numBathrooms: int('num_bathrooms').notNull(),
  images: text('images').notNull(),
  userId: int('user_id').notNull().references(() => users.id),
  status: varchar('status', { length: 50 }).notNull().default('available'),
  featured: boolean('featured').notNull().default(false),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

// Bookings table
export const bookings = mysqlTable('bookings', {
  id: int('id').primaryKey().autoincrement(),
  listingId: int('listing_id').notNull().references(() => listings.id),
  userId: int('user_id').notNull().references(() => users.id),
  checkInDate: varchar('check_in_date', { length: 50 }).notNull(),
  checkOutDate: varchar('check_out_date', { length: 50 }).notNull(),
  numNights: int('num_nights').notNull(),
  subtotal: int('subtotal').notNull(),
  tax: int('tax').notNull(),
  total: int('total').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  paymentMethod: varchar('payment_method', { length: 50 }).notNull(),
  refundedAt: timestamp('refunded_at'),
  createdAt: timestamp('created_at').notNull(),
});

// Add new transactions table
export const transactions = mysqlTable('transactions', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull().references(() => users.id),
  bookingId: int('booking_id').references(() => bookings.id),
  listingId: int('listing_id').references(() => listings.id),
  amount: int('amount').notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').notNull(),
});