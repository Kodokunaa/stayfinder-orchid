'use client';

import Link from 'next/link';
import { Home, LogIn, UserPlus, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profilePicture: string | null;
}

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const sessionToken = localStorage.getItem('session_token');
      
      if (!sessionToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/verify-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionToken }),
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // Invalid session, clear localStorage
          localStorage.removeItem('session_token');
          localStorage.removeItem('user_data');
          setUser(null);
        }
      } catch (error) {
        console.error('Error verifying session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('session_token');
    localStorage.removeItem('user_data');
    setUser(null);
    router.push('/');
    toast.success('Logged out successfully');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <nav className="w-full border-b bg-white sticky top-0 z-50">
      <div className="max-w-[90vw] lg:max-w-[70vw] mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl md:text-2xl font-bold text-primary">
            <Home className="w-6 h-6 md:w-8 md:h-8" />
            <span className="hidden sm:inline">StayFinder</span>
            <span className="sm:hidden">SF</span>
          </Link>

          {/* Desktop Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
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

          {/* Desktop Auth Section - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-20 h-9 bg-gray-200 animate-pulse rounded-md"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 relative">
                    {user.profilePicture ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/20">
                        <Image
                          src={user.profilePicture}
                          alt="Profile"
                          width={32}
                          height={32}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    <span className="text-sm font-medium">
                      {user.firstName} {user.lastName}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/my-bookings')}>
                    My Bookings
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => router.push('/admin')}>
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
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
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
                <div className="flex flex-col h-full">
                  {/* User Info */}
                  {loading ? (
                    <div className="mb-6">
                      <div className="w-full h-16 bg-gray-200 animate-pulse rounded-md"></div>
                    </div>
                  ) : user ? (
                    <div className="mb-6 pb-6 border-b">
                      <div className="flex items-center gap-3 mb-4">
                        {user.profilePicture ? (
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                            <Image
                              src={user.profilePicture}
                              alt="Profile"
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-6 h-6 text-primary" />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6 pb-6 border-b space-y-3">
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full gap-2">
                          <LogIn className="w-4 h-4" />
                          Login
                        </Button>
                      </Link>
                      <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full gap-2">
                          <UserPlus className="w-4 h-4" />
                          Register
                        </Button>
                      </Link>
                    </div>
                  )}

                  {/* Navigation Links */}
                  <nav className="flex-1 space-y-1">
                    <Link
                      href="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-base font-medium hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Home
                    </Link>
                    <Link
                      href="/listings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-base font-medium hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Listings
                    </Link>
                    {user && (
                      <>
                        <Link
                          href="/profile"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-4 py-3 text-base font-medium hover:bg-gray-100 rounded-md transition-colors"
                        >
                          Profile
                        </Link>
                        <Link
                          href="/my-bookings"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-4 py-3 text-base font-medium hover:bg-gray-100 rounded-md transition-colors"
                        >
                          My Bookings
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-3 text-base font-medium hover:bg-gray-100 rounded-md transition-colors"
                          >
                            Admin Dashboard
                          </Link>
                        )}
                      </>
                    )}
                  </nav>

                  {/* Logout Button */}
                  {user && (
                    <div className="pt-6 border-t">
                      <Button
                        variant="outline"
                        className="w-full text-destructive hover:text-destructive"
                        onClick={() => {
                          handleSignOut();
                          setMobileMenuOpen(false);
                        }}
                      >
                        Log Out
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}