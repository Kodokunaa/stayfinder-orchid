'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-white sticky top-0 z-50">
      <div className="max-w-[70vw] mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
            <Home className="w-8 h-8" />
            <span>StayFinder</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/listings" className="text-sm font-medium hover:text-primary transition-colors">
              Listings
            </Link>
            <Link href="/my-bookings" className="text-sm font-medium hover:text-primary transition-colors">
              My Bookings
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}