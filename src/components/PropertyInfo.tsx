import { Users, Bed, Bath, Home } from 'lucide-react';
import { Separator } from './ui/separator';

interface PropertyInfoProps {
  listing: {
    title: string;
    description: string;
    pricePerNight: number;
    numGuests: number;
    numBedrooms: number;
    numBeds: number;
    numBathrooms: number;
  };
}

export default function PropertyInfo({ listing }: PropertyInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
        <div className="flex items-center gap-4 text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="w-5 h-5" />
            <span>{listing.numGuests} guests</span>
          </div>
          <div className="flex items-center gap-1">
            <Home className="w-5 h-5" />
            <span>{listing.numBedrooms} bedrooms</span>
          </div>
          <div className="flex items-center gap-1">
            <Bed className="w-5 h-5" />
            <span>{listing.numBeds} beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-5 h-5" />
            <span>{listing.numBathrooms} bathrooms</span>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{listing.description}</p>
      </div>

      <Separator />

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">What this place offers</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Users className="w-5 h-5" />
            <span>Accommodates {listing.numGuests} guests</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Home className="w-5 h-5" />
            <span>{listing.numBedrooms} Bedrooms</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Bed className="w-5 h-5" />
            <span>{listing.numBeds} Beds</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Bath className="w-5 h-5" />
            <span>{listing.numBathrooms} Bathrooms</span>
          </div>
        </div>
      </div>
    </div>
  );
}
