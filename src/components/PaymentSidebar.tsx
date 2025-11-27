'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CreditCard, DollarSign, CalendarIcon, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from './ui/alert';

interface PaymentSidebarProps {
  listing: {
    id: number;
    pricePerNight: number;
    status: string;
  };
}

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export default function PaymentSidebar({ listing }: PaymentSidebarProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Payment form fields
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [paypalPassword, setPaypalPassword] = useState('');

  const isBooked = listing.status === 'booked';

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const sessionToken = localStorage.getItem('session_token');
      
      if (!sessionToken) {
        setUser(null);
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
          setUser(null);
        }
      } catch (error) {
        console.error('Error verifying session:', error);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  const numNights = dateRange.from && dateRange.to 
    ? differenceInDays(dateRange.to, dateRange.from) 
    : 0;

  const subtotal = listing.pricePerNight * numNights;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  // Format card number with spaces (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted.slice(0, 19)); // Max 16 digits + 3 spaces
  };

  // Format expiry date as MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    
    setExpiryDate(value.slice(0, 5));
  };

  // Only allow numbers for CVV (3-4 digits)
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCvv(value.slice(0, 4));
  };

  // Only allow letters and spaces for cardholder name
  const handleCardholderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    setCardholderName(value.slice(0, 50));
  };

  // Validate payment form
  const validatePaymentForm = () => {
    if (paymentMethod === 'paypal') {
      if (!paypalEmail || !paypalEmail.includes('@')) {
        toast.error('Please enter a valid PayPal email');
        return false;
      }
      if (!paypalPassword || paypalPassword.length < 6) {
        toast.error('Please enter your PayPal password');
        return false;
      }
    } else {
      const cardNumberDigits = cardNumber.replace(/\s/g, '');
      if (cardNumberDigits.length !== 16) {
        toast.error('Please enter a valid 16-digit card number');
        return false;
      }
      
      const expiryParts = expiryDate.split('/');
      if (expiryParts.length !== 2 || expiryParts[0].length !== 2 || expiryParts[1].length !== 2) {
        toast.error('Please enter expiry date as MM/YY');
        return false;
      }
      
      const month = parseInt(expiryParts[0]);
      if (month < 1 || month > 12) {
        toast.error('Please enter a valid month (01-12)');
        return false;
      }
      
      if (cvv.length < 3) {
        toast.error('Please enter a valid CVV (3-4 digits)');
        return false;
      }
      
      if (!cardholderName || cardholderName.trim().length < 3) {
        toast.error('Please enter the cardholder name');
        return false;
      }
    }
    return true;
  };

  const handleProceedToPayment = () => {
    // Check if listing is already booked
    if (isBooked) {
      toast.error('Property is not available', {
        description: 'This property has already been booked',
      });
      return;
    }

    // Check if user is logged in first
    if (!user) {
      toast.error('Please log in to continue', {
        description: 'You need to be logged in to make a booking',
      });
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (!dateRange.from || !dateRange.to) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    if (numNights === 0) {
      toast.error('Please select at least one night');
      return;
    }

    setShowPaymentForm(true);
  };

  const handleCompleteBooking = async () => {
    // Double-check listing availability
    if (isBooked) {
      toast.error('Property is not available', {
        description: 'This property has already been booked',
      });
      setShowPaymentForm(false);
      return;
    }

    // Double-check authentication before booking
    if (!user) {
      toast.error('Session expired. Please log in again.');
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    // Validate payment form
    if (!validatePaymentForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Create booking with actual logged-in user ID
      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId: listing.id,
          userId: user.id,
          checkInDate: dateRange.from?.toISOString(),
          checkOutDate: dateRange.to?.toISOString(),
          numNights,
          subtotal: Math.round(subtotal * 100),
          tax: Math.round(tax * 100),
          total: Math.round(total * 100),
          paymentMethod,
          status: 'confirmed',
        }),
      });

      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json();
        
        // Check if listing was already booked
        if (errorData.code === 'LISTING_ALREADY_BOOKED') {
          toast.error('Property is no longer available', {
            description: 'This property was just booked by another user',
          });
          // Refresh the page to update the status
          window.location.reload();
          return;
        }
        
        throw new Error(errorData.error || 'Failed to create booking');
      }

      const booking = await bookingResponse.json();

      // Create negative transaction for the payment
      const transactionResponse = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          amount: -Math.round(total * 100), // Negative for payment
          type: 'booking',
          description: `Payment for booking #${booking.id}`,
          bookingId: booking.id,
          listingId: listing.id,
        }),
      });

      if (!transactionResponse.ok) {
        console.error('Failed to create transaction record');
      }

      toast.success('Booking confirmed!', {
        description: `Your ${numNights}-night stay has been booked successfully.`,
      });
      
      // Reset form
      setShowPaymentForm(false);
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
      setCardholderName('');
      setPaypalEmail('');
      setPaypalPassword('');
      
      setTimeout(() => {
        router.push('/my-bookings');
      }, 2000);
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Booking failed', {
        description: error instanceof Error ? error.message : 'Please try again or contact support.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-2xl font-bold">
            ${listing.pricePerNight}
            <span className="text-base font-normal text-gray-600"> / night</span>
          </span>
        </CardTitle>
        {isBooked && (
          <div className="mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              Already Booked
            </span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {isBooked && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This property has already been booked and is not available for new reservations.
            </AlertDescription>
          </Alert>
        )}

        {!showPaymentForm ? (
          <>
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold mb-2 block">
                  Check-in / Check-out
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={isBooked}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd, yyyy")}
                          </>
                        ) : (
                          format(dateRange.from, "MMM dd, yyyy")
                        )
                      ) : (
                        <span>Select dates</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {numNights > 0 && (
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <span className="font-semibold">{numNights}</span> night{numNights !== 1 ? 's' : ''} selected
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Order Summary</h3>
              
              {numNights > 0 ? (
                <>
                  <div className="flex justify-between text-gray-700">
                    <span>${listing.pricePerNight} x {numNights} nights</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500">Select dates to see pricing</p>
              )}
            </div>

            <Separator />

            <div>
              <Label className="text-base font-semibold mb-3 block">Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} disabled={isBooked}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="credit" id="credit" disabled={isBooked} />
                  <Label htmlFor="credit" className="flex items-center gap-2 cursor-pointer flex-1">
                    <CreditCard className="w-5 h-5" />
                    Credit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="debit" id="debit" disabled={isBooked} />
                  <Label htmlFor="debit" className="flex items-center gap-2 cursor-pointer flex-1">
                    <CreditCard className="w-5 h-5" />
                    Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="paypal" id="paypal" disabled={isBooked} />
                  <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer flex-1">
                    <DollarSign className="w-5 h-5" />
                    PayPal
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button 
              onClick={handleProceedToPayment} 
              className="w-full" 
              size="lg"
              disabled={!dateRange.from || !dateRange.to || numNights === 0 || isBooked}
            >
              {isBooked ? 'Not Available' : 'Proceed to Payment'}
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">
                {paymentMethod === 'paypal' ? 'PayPal Details' : 'Card Details'}
              </h3>

              {paymentMethod === 'paypal' ? (
                <>
                  <div>
                    <Label htmlFor="email">PayPal Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com"
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">PayPal Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••"
                      value={paypalPassword}
                      onChange={(e) => setPaypalPassword(e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input 
                      id="cardNumber" 
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      autoComplete="off"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input 
                        id="expiry" 
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={handleExpiryChange}
                        autoComplete="off"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input 
                        id="cvv" 
                        placeholder="123"
                        value={cvv}
                        onChange={handleCvvChange}
                        type="password"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input 
                      id="cardName" 
                      placeholder="John Doe"
                      value={cardholderName}
                      onChange={handleCardholderNameChange}
                      autoComplete="off"
                    />
                  </div>
                </>
              )}
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowPaymentForm(false)} 
                className="flex-1"
                disabled={isSubmitting}
              >
                Back
              </Button>
              <Button 
                onClick={handleCompleteBooking} 
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Complete Booking'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}