'use client';

import Link from 'next/link';
import { Home, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors">
              Admin
            </Link>
            
            {/* Auth Buttons */}
            <div className="flex items-center gap-3 ml-4 border-l pl-6">
              <Link href="/login">
                <Button variant="outline" size="sm" className="gap-2">
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="gap-2">
                  <UserPlus className="w-4 h-4" />
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}