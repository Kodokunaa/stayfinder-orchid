'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import ListingCard from '@/components/ListingCard';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, MapPin, Users, Home, Mail, Phone, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import useEmblaCarousel from 'embla-carousel-react';

interface Listing {
  id: number;
  title: string;
  images: string[];
  pricePerNight: number;
  numGuests: number;
  numBeds: number;
}

export default function HomePage() {
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false,
    align: 'start',
    skipSnaps: false,
    dragFree: true,
    containScroll: 'trimSnaps',
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    fetchFeaturedListings();
  }, []);

  // Update scroll button states
  useEffect(() => {
    if (!emblaApi) return;

    const updateScrollButtons = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on('select', updateScrollButtons);
    emblaApi.on('init', updateScrollButtons);
    updateScrollButtons();

    return () => {
      emblaApi.off('select', updateScrollButtons);
      emblaApi.off('init', updateScrollButtons);
    };
  }, [emblaApi]);

  const fetchFeaturedListings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/listings?featured=true&limit=10');
      const data = await response.json();
      
      const formattedListings = data.map((listing: any) => ({
        id: listing.id,
        title: listing.title,
        images: typeof listing.images === 'string' ? JSON.parse(listing.images) : listing.images,
        pricePerNight: listing.pricePerNight,
        numGuests: listing.numGuests,
        numBeds: listing.numBeds,
      }));
      
      setFeaturedListings(formattedListings);
    } catch (error) {
      console.error('Error fetching featured listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      window.location.href = `/listings?search=${encodeURIComponent(query)}`;
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      toast.success('Message sent!', {
        description: 'We\'ll get back to you as soon as possible.',
      });
      setContactForm({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-primary/5 min-h-[50vh] sm:min-h-[60vh] flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
              Find Your Perfect Stay
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">
              Discover unique homes and experiences around the world
            </p>
            
            {/* Hero Search */}
            <div className="mt-6 sm:mt-8">
              <SearchBar onSearch={handleSearch} />
            </div>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 pt-6 sm:pt-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-xl sm:text-2xl font-bold">500+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Locations</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Home className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-xl sm:text-2xl font-bold">1000+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Properties</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-xl sm:text-2xl font-bold">50K+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Happy Guests</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="w-full bg-background py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Stays</h2>
              <p className="text-sm sm:text-base text-gray-600 mt-2">Handpicked properties available now</p>
            </div>
            <Link href="/listings">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">View All Listings</Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : featuredListings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-base sm:text-lg">No featured listings available yet.</p>
            </div>
          ) : (
            <div className="relative group">
              {/* Carousel Navigation Buttons - Hidden on mobile */}
              {canScrollPrev && (
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 rounded-full bg-background shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex"
                  onClick={scrollPrev}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              {canScrollNext && (
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 rounded-full bg-background shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex"
                  onClick={scrollNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}

              {/* Carousel Container */}
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-4 sm:gap-6">
                  {featuredListings.map((listing) => (
                    <div 
                      key={listing.id} 
                      className="flex-[0_0_100%] min-w-0 xs:flex-[0_0_calc(50%-8px)] sm:flex-[0_0_calc(50%-12px)] md:flex-[0_0_calc(33.333%-16px)] lg:flex-[0_0_calc(25%-18px)] xl:flex-[0_0_calc(20%-19.2px)]"
                    >
                      <ListingCard {...listing} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="w-full bg-gray-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">About StayFinder</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
              StayFinder is your trusted platform for discovering and booking unique accommodations 
              around the world. Whether you're looking for a cozy apartment in the city, a beachfront 
              villa, or a mountain cabin, we connect travelers with exceptional places to stay.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pt-6 sm:pt-8">
              <div className="space-y-3">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg sm:text-xl">Trusted & Secure</h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  All properties are verified and secure payments guaranteed
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Home className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg sm:text-xl">Best Selection</h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Thousands of unique properties in top destinations
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg sm:text-xl">24/7 Support</h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Our team is here to help you anytime, anywhere
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="w-full bg-background py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Get In Touch</h2>
              <p className="text-sm sm:text-base text-gray-600 mt-2">Have questions? We'd love to hear from you.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
              {/* Contact Form */}
              <div>
                <form onSubmit={handleContactSubmit} className="space-y-4 sm:space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-sm">Name</Label>
                    <Input
                      id="name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Your name"
                      required
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-sm">Message</Label>
                    <textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="How can we help you?"
                      required
                      rows={5}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h3 className="font-semibold text-lg sm:text-xl mb-4 sm:mb-6">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-sm sm:text-base">Email</div>
                        <div className="text-xs sm:text-sm text-gray-600 break-all">support@stayfinder.com</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-sm sm:text-base">Phone</div>
                        <div className="text-xs sm:text-sm text-gray-600">+1 (555) 123-4567</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-sm sm:text-base">Address</div>
                        <div className="text-xs sm:text-sm text-gray-600">123 Market Street<br />San Francisco, CA 94103</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 p-4 sm:p-6 rounded-lg">
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">Business Hours</h4>
                  <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                    <div>Monday - Friday: 9:00 AM - 6:00 PM</div>
                    <div>Saturday: 10:00 AM - 4:00 PM</div>
                    <div>Sunday: Closed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}