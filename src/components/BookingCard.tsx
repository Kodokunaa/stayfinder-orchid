'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, CreditCard } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

interface BookingCardProps {
  booking: {
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
  };
  onCancel: (bookingId: number) => void;
  onRefresh?: () => void;
}

export default function BookingCard({ booking, onCancel, onRefresh }: BookingCardProps) {
  const statusColors = {
    confirmed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-blue-100 text-blue-800',
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative w-full md:w-64 h-48 md:h-auto flex-shrink-0">
          <Image
            src={booking.listing?.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'}
            alt={booking.listing?.title || 'Property'}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <CardContent className="flex-1 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <Link 
                href={`/property/${booking.listingId}`}
                className="text-xl font-semibold text-gray-900 hover:text-primary transition-colors"
              >
                {booking.listing?.title}
              </Link>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={statusColors[booking.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Badge>
                {booking.refundedAt && (
                  <span className="text-xs text-gray-500">
                    Refunded on {formatDate(booking.refundedAt)}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                ${(booking.total / 100).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-start gap-2">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900">Check-in</div>
                <div className="text-sm text-gray-600">{formatDate(booking.checkInDate)}</div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900">Check-out</div>
                <div className="text-sm text-gray-600">{formatDate(booking.checkOutDate)}</div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900">Payment</div>
                <div className="text-sm text-gray-600 capitalize">
                  {booking.paymentMethod.replace('_', ' ')}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-gray-600">
              {booking.numNights} night{booking.numNights > 1 ? 's' : ''} • 
              ${booking.listing?.pricePerNight} per night
            </div>
            
            <div className="flex gap-2">
              {(booking.status === 'confirmed' || booking.status === 'pending') && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Cancel Booking
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to cancel this booking? This action cannot be undone and a refund will be processed.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>No, keep it</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onCancel(booking.id)}>
                        Yes, cancel booking
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}