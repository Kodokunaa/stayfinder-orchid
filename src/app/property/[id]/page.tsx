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
  status: string;
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
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <Skeleton className="h-64 sm:h-96 w-full mb-6 sm:mb-8" />
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="flex-1">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="w-full lg:w-96 h-96" />
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
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
            <p className="text-sm sm:text-base text-gray-600">The property you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="max-w-[90vw] lg:max-w-[75vw] mx-auto mb-6 sm:mb-8">
          <ImageCarousel images={listing.images} title={listing.title} />
        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex-1 order-2 lg:order-1">
            <PropertyInfo listing={listing} />
          </div>
          
          <div className="w-full lg:w-[30vw] lg:max-w-md order-1 lg:order-2 lg:sticky lg:top-24 self-start">
            <PaymentSidebar listing={listing} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}