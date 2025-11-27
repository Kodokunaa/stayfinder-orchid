'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Users, Bed } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface ListingCardProps {
  id: number;
  title: string;
  images: string[];
  pricePerNight: number;
  numGuests: number;
  numBeds: number;
}

export default function ListingCard({
  id,
  title,
  images,
  pricePerNight,
  numGuests,
  numBeds,
}: ListingCardProps) {
  const mainImage = images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';

  return (
    <Link href={`/property/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="relative h-48 w-full">
          <Image
            src={mainImage}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{title}</h3>
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{numGuests} guests</span>
            </div>
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{numBeds} beds</span>
            </div>
          </div>
          <div className="text-lg font-bold text-primary">
            ${pricePerNight}
            <span className="text-sm font-normal text-gray-600"> / night</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
