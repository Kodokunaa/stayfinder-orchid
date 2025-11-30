'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { MultiImageUpload } from '@/components/ui/multi-image-upload';
import { toast } from 'sonner';

interface ListingDialogProps {
  open: boolean;
  onClose: (shouldRefresh: boolean) => void;
  listing: any | null;
}

export default function ListingDialog({ open, onClose, listing }: ListingDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pricePerNight: '',
    numGuests: '',
    numBedrooms: '',
    numBeds: '',
    numBathrooms: '',
    featured: false,
  });
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  // Get user ID from session on mount
  useEffect(() => {
    const fetchUserId = async () => {
      const sessionToken = localStorage.getItem('session_token');
      if (!sessionToken) {
        toast.error('Please log in to manage listings');
        return;
      }

      try {
        const response = await fetch('/api/auth/verify-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionToken }),
        });

        if (response.ok) {
          const data = await response.json();
          setUserId(data.user.id);
        } else {
          toast.error('Session expired. Please log in again.');
        }
      } catch (error) {
        console.error('Error verifying session:', error);
        toast.error('Failed to verify session');
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (listing) {
      setFormData({
        title: listing.title,
        description: listing.description,
        pricePerNight: listing.pricePerNight.toString(),
        numGuests: listing.numGuests.toString(),
        numBedrooms: listing.numBedrooms.toString(),
        numBeds: listing.numBeds.toString(),
        numBathrooms: listing.numBathrooms.toString(),
        featured: listing.featured === 1 || listing.featured === true,
      });
      setImages(Array.isArray(listing.images) ? listing.images : []);
    } else {
      setFormData({
        title: '',
        description: '',
        pricePerNight: '',
        numGuests: '',
        numBedrooms: '',
        numBeds: '',
        numBathrooms: '',
        featured: false,
      });
      setImages([]);
    }
  }, [listing, open]);

  // Prevent typing 'e', '+', '-' in number inputs
  const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, allowDecimal = false) => {
    const invalidChars = allowDecimal ? ['e', 'E', '+', '-'] : ['e', 'E', '+', '-', '.'];
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast.error('User session not found. Please log in again.');
      return;
    }

    if (images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        pricePerNight: parseInt(formData.pricePerNight),
        numGuests: parseInt(formData.numGuests),
        numBedrooms: parseInt(formData.numBedrooms),
        numBeds: parseInt(formData.numBeds),
        numBathrooms: parseFloat(formData.numBathrooms),
        images,
        userId: userId,
        featured: formData.featured,
      };

      const url = listing ? `/api/listings?id=${listing.id}` : '/api/listings';
      const method = listing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(listing ? 'Listing updated successfully' : 'Listing created successfully');
        onClose(true);
      } else {
        console.error('API Error:', data);
        toast.error(data.error || 'Error saving listing');
      }
    } catch (error) {
      console.error('Error saving listing:', error);
      toast.error('Error saving listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose(false)}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{listing ? 'Edit Listing' : 'Add New Listing'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Beautiful apartment in downtown"
              required
              minLength={10}
              className="text-sm"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your property..."
              rows={4}
              required
              minLength={20}
              className="text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pricePerNight" className="text-sm">Price per Night (₱)</Label>
              <Input
                id="pricePerNight"
                type="number"
                min="0"
                step="1"
                value={formData.pricePerNight}
                onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                onKeyDown={(e) => handleNumberKeyDown(e, false)}
                required
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="numGuests" className="text-sm">Number of Guests</Label>
              <Input
                id="numGuests"
                type="number"
                min="0"
                step="1"
                value={formData.numGuests}
                onChange={(e) => setFormData({ ...formData, numGuests: e.target.value })}
                onKeyDown={(e) => handleNumberKeyDown(e, false)}
                required
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="numBedrooms" className="text-sm">Number of Bedrooms</Label>
              <Input
                id="numBedrooms"
                type="number"
                min="0"
                step="1"
                value={formData.numBedrooms}
                onChange={(e) => setFormData({ ...formData, numBedrooms: e.target.value })}
                onKeyDown={(e) => handleNumberKeyDown(e, false)}
                required
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="numBeds" className="text-sm">Number of Beds</Label>
              <Input
                id="numBeds"
                type="number"
                min="0"
                step="1"
                value={formData.numBeds}
                onChange={(e) => setFormData({ ...formData, numBeds: e.target.value })}
                onKeyDown={(e) => handleNumberKeyDown(e, false)}
                required
                className="text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="numBathrooms" className="text-sm">Number of Bathrooms</Label>
              <Input
                id="numBathrooms"
                type="number"
                min="0"
                step="0.5"
                value={formData.numBathrooms}
                onChange={(e) => setFormData({ ...formData, numBathrooms: e.target.value })}
                onKeyDown={(e) => handleNumberKeyDown(e, true)}
                required
                className="text-sm"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData({ ...formData, featured: checked as boolean })}
            />
            <Label htmlFor="featured" className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Enable Featured (Show in featured section on homepage)
            </Label>
          </div>

          <div>
            <Label className="text-sm">Property Images (Required)</Label>
            <MultiImageUpload value={images} onChange={setImages} maxImages={10} className="mt-2" />
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Upload at least 1 image (max 10). First image will be the cover.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onClose(false)} disabled={loading} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" disabled={loading || images.length === 0 || !userId} className="w-full sm:w-auto">
              {loading ? 'Saving...' : listing ? 'Update Listing' : 'Create Listing'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}