'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ImageCarousel from '@/components/ImageCarousel';
import PropertyInfo from '@/components/PropertyInfo';
import PaymentSidebar from '@/components/PaymentSidebar';
import { Skeleton } from '@/components/ui/skeleton';

interface Listing {
  id: number;
  title: string;
  description: string;
  images: string[];
  pricePerNight: number;
  numGuests: number;
  numBedrooms: number;
  numBeds: number;
  numBathrooms: number;
}

export default function PropertyPage() {
  const params = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchListing(params.id as string);
    }
  }, [params.id]);

  const fetchListing = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/listings?id=${id}`);
      const data = await response.json();
      
      setListing({
        ...data,
        images: typeof data.images === 'string' ? JSON.parse(data.images) : data.images,
      });
    } catch (error) {
      console.error('Error fetching listing:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full mb-8" />
          <div className="flex gap-8">
            <div className="flex-1">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="w-96 h-96" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
            <p className="text-gray-600">The property you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full px-4 py-8">
        <div className="max-w-[75vw] mx-auto mb-8">
          <ImageCarousel images={listing.images} title={listing.title} />
        </div>

        <div className="max-w-7xl mx-auto flex gap-8">
          <div className="flex-1">
            <PropertyInfo listing={listing} />
          </div>
          
          <div className="w-[25vw] max-w-md">
            <PaymentSidebar listing={listing} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
