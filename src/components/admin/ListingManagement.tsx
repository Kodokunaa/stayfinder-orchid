'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
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
} from '@/components/ui/alert-dialog';
import Image from 'next/image';
import ListingDialog from './ListingDialog';
import { toast } from 'sonner';

interface Listing {
  id: number;
  title: string;
  description: string;
  pricePerNight: number;
  numGuests: number;
  numBedrooms: number;
  numBeds: number;
  numBathrooms: number;
  images: string[];
  userId: number;
}

export default function ListingManagement() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchListings();
  }, [searchQuery]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: '100',
        ...(searchQuery && { search: searchQuery }),
      });
      
      const token = localStorage.getItem('bearer_token');
      const response = await fetch(`/api/listings?${params}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const data = await response.json();
      
      const formattedListings = data.map((listing: any) => ({
        ...listing,
        images: typeof listing.images === 'string' ? JSON.parse(listing.images) : listing.images,
      }));
      
      setListings(formattedListings);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('bearer_token');
      const response = await fetch(`/api/listings?id=${id}`, {
        method: 'DELETE',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      
      if (response.ok) {
        toast.success('Listing deleted successfully');
        fetchListings();
      } else {
        toast.error('Failed to delete listing');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error('Failed to delete listing');
    }
    setDeleteId(null);
  };

  const handleEdit = (listing: Listing) => {
    setEditingListing(listing);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingListing(null);
    setDialogOpen(true);
  };

  const handleDialogClose = (shouldRefresh: boolean) => {
    setDialogOpen(false);
    setEditingListing(null);
    if (shouldRefresh) {
      fetchListings();
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleAdd} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Listing
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <Card key={listing.id}>
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="relative w-full sm:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={listing.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'}
                      alt={listing.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg mb-1 truncate">{listing.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{listing.description}</p>
                    <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                      <span>₱{listing.pricePerNight}/night</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{listing.numGuests} guests</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{listing.numBedrooms} bedrooms</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{listing.numBeds} beds</span>
                    </div>
                  </div>
                  
                  <div className="flex sm:flex-col gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(listing)}
                      className="flex-1 sm:flex-none"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon" className="flex-1 sm:flex-none">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Listing</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{listing.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                          <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(listing.id)} className="w-full sm:w-auto">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ListingDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        listing={editingListing}
      />
    </div>
  );
}