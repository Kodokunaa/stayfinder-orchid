'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingCard from '@/components/BookingCard';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Receipt } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

interface Booking {
  id: number;
  listingId: number;
  checkInDate: string;
  checkOutDate: string;
  numNights: number;
  total: number;
  status: string;
  paymentMethod: string;
  refundedAt?: string | null;
  listing?: {
    title: string;
    images: string[];
    pricePerNight: number;
  };
}

interface Transaction {
  id: number;
  amount: number;
  type: 'booking' | 'refund';
  description: string;
  createdAt: string;
  bookingId?: number | null;
}

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export default function MyBookingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const sessionToken = localStorage.getItem('session_token');
      
      if (!sessionToken) {
        toast.error('Please log in to view your bookings');
        router.push('/login?redirect=/my-bookings');
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
          toast.error('Session expired. Please log in again.');
          router.push('/login?redirect=/my-bookings');
        }
      } catch (error) {
        console.error('Error verifying session:', error);
        toast.error('Authentication error');
        router.push('/login?redirect=/my-bookings');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!user) return;

    fetchBookings();
    fetchTransactions();

    // Refetch data when page becomes visible (e.g., after navigation back)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchBookings();
        fetchTransactions();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup listener
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/bookings?userId=${user.id}`);
      const bookingsData = await response.json();
      
      // Fetch listing details for each booking
      const bookingsWithListings = await Promise.all(
        bookingsData.map(async (booking: Booking) => {
          const listingResponse = await fetch(`/api/listings?id=${booking.listingId}`);
          const listingData = await listingResponse.json();
          return {
            ...booking,
            listing: {
              ...listingData,
              images: typeof listingData.images === 'string' 
                ? JSON.parse(listingData.images) 
                : listingData.images,
            },
          };
        })
      );
      
      setBookings(bookingsWithListings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;
    
    try {
      setTransactionsLoading(true);
      const response = await fetch(`/api/transactions?userId=${user.id}&limit=50`);
      
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setTransactionsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    try {
      const response = await fetch(`/api/bookings?id=${bookingId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      
      if (response.ok) {
        toast.success('Booking cancelled successfully', {
          description: 'A refund has been processed to your account',
        });
        fetchBookings();
        fetchTransactions(); // Refresh transactions to show refund
      } else {
        toast.error('Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">
            Manage your bookings and view transaction history
          </p>
        </div>

        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="transactions">
              <Receipt className="w-4 h-4 mr-2" />
              Transactions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-lg mb-2">No bookings yet</p>
                <p className="text-gray-400">Start exploring and book your first stay!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {bookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onCancel={handleCancelBooking}
                    onRefresh={fetchBookings}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="transactions">
            {transactionsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-lg mb-2">No transactions yet</p>
                <p className="text-gray-400">Your transaction history will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              transaction.amount < 0 ? 'bg-red-100' : 'bg-green-100'
                            }`}>
                              <Receipt className={`w-6 h-6 ${
                                transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                              }`} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {transaction.description}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatDate(transaction.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${
                            transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount / 100).toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {transaction.type}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}