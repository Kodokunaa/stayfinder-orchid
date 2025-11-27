'use client';

import Link from 'next/link';
import { Home, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/auth-client';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (session?.user?.email) {
        try {
          const token = localStorage.getItem('bearer_token');
          const response = await fetch('/api/admin/users', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const users = await response.json();
            const currentUser = users.find((u: any) => u.email === session.user.email);
            setIsAdmin(currentUser?.role === 'admin');
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    if (!isPending) {
      checkAdminStatus();
    }
  }, [session, isPending]);

  return (
    <nav className="w-full border-b bg-white sticky top-0 z-50">
      <div className="max-w-[70vw] mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
            <Home className="w-8 h-8" />
            <span>StayFinder</span>
          </Link>

          {/* Navigation Links - Centered */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/listings" className="text-sm font-medium hover:text-primary transition-colors">
              Listings
            </Link>
            {isAdmin && (
              <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors">
                Admin
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
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
    </nav>
  );
}