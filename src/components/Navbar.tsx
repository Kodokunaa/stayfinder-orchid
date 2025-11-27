'use client';

import Link from 'next/link';
import { Home, LogIn, UserPlus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession, authClient } from '@/lib/auth-client';
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

export default function Navbar() {
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const token = localStorage.getItem('bearer_token');
          
          // Check admin status
          const adminResponse = await fetch('/api/admin/users', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (adminResponse.ok) {
            const users = await adminResponse.json();
            const currentUser = users.find((u: any) => u.email === session.user.email);
            setIsAdmin(currentUser?.role === 'admin');
          }

          // Fetch profile picture
          const profileResponse = await fetch('/api/profile', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            setProfilePicture(profileData.profilePicture || '');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
        setProfilePicture('');
      }
    };

    if (!isPending) {
      fetchUserData();
    }
  }, [session, isPending]);

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();
    if (error?.code) {
      toast.error(error.code);
    } else {
      localStorage.removeItem('bearer_token');
      setProfilePicture('');
      refetch();
      router.push('/');
      toast.success('Logged out successfully');
    }
  };

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
            {session?.user && (
              <Link href="/my-bookings" className="text-sm font-medium hover:text-primary transition-colors">
                My Bookings
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors">
                Admin
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 relative">
                    {profilePicture ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/20">
                        <Image
                          src={profilePicture}
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
                      {session.user.name || session.user.email}
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
        </div>
      </div>
    </nav>
  );
}