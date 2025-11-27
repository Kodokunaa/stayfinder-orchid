'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ListingManagement from '@/components/admin/ListingManagement';
import UserManagement from '@/components/admin/UserManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface CurrentUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export default function AdminDashboard() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const sessionToken = localStorage.getItem('bearer_token');
      if (!sessionToken) {
        router.push('/login?redirect=/admin');
        return;
      }

      const response = await fetch('/api/auth/verify-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionToken }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user.role === 'renter') {
          toast.error('Access denied. Admin or Manager access required.');
          router.push('/');
          return;
        }
        setCurrentUser(data.user);
      } else {
        router.push('/login?redirect=/admin');
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      router.push('/login?redirect=/admin');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  const dashboardTitle = currentUser.role === 'manager' ? 'Manager Dashboard' : 'Admin Dashboard';
  const dashboardDescription = currentUser.role === 'manager' 
    ? 'Manage listings, users, and system settings' 
    : 'Manage listings';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{dashboardTitle}</h1>
          <p className="text-gray-600">{dashboardDescription}</p>
        </div>

        <Tabs defaultValue="listings" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="listings" className="mt-6">
            <ListingManagement />
          </TabsContent>
          
          <TabsContent value="users" className="mt-6">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}