import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Users table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  image: text('image'),
  role: text('role').notNull().default('renter'),
  createdAt: text('created_at').notNull(),
});

// Listings table
export const listings = sqliteTable('listings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  pricePerNight: integer('price_per_night').notNull(),
  numGuests: integer('num_guests').notNull(),
  numBedrooms: integer('num_bedrooms').notNull(),
  numBeds: integer('num_beds').notNull(),
  numBathrooms: integer('num_bathrooms').notNull(),
  images: text('images', { mode: 'json' }).notNull(),
  userId: integer('user_id').notNull().references(() => users.id),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Bookings table
export const bookings = sqliteTable('bookings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  listingId: integer('listing_id').notNull().references(() => listings.id),
  userId: integer('user_id').notNull().references(() => users.id),
  checkInDate: text('check_in_date').notNull(),
  checkOutDate: text('check_out_date').notNull(),
  numNights: integer('num_nights').notNull(),
  subtotal: integer('subtotal').notNull(),
  tax: integer('tax').notNull(),
  total: integer('total').notNull(),
  status: text('status').notNull().default('pending'),
  paymentMethod: text('payment_method').notNull(),
  refundedAt: text('refunded_at'),
  createdAt: text('created_at').notNull(),
});

// Add new transactions table
export const transactions = sqliteTable('transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  bookingId: integer('booking_id').references(() => bookings.id),
  listingId: integer('listing_id').references(() => listings.id),
  amount: integer('amount').notNull(),
  type: text('type').notNull(),
  description: text('description').notNull(),
  createdAt: text('created_at').notNull(),
});