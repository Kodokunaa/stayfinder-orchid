import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About StayFinder</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-4">
            StayFinder is your trusted platform for finding and booking unique accommodations around the world. 
            Whether you're looking for a cozy apartment in the city, a beachfront villa, or a mountain retreat, 
            we connect you with the perfect stay for your needs.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            We believe that everyone deserves to find their perfect home away from home. Our mission is to make 
            travel accommodation booking simple, transparent, and accessible to everyone.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Choose StayFinder?</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Thousands of verified properties worldwide</li>
            <li>Secure booking and payment processing</li>
            <li>24/7 customer support</li>
            <li>Best price guarantee</li>
            <li>Easy cancellation policies</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Join Our Community</h2>
          <p className="text-gray-700">
            Whether you're a traveler looking for your next adventure or a property owner wanting to share 
            your space, StayFinder welcomes you to our growing community of hosts and guests.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
