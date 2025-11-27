import Link from 'next/link';
import { Home, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white min-h-[20vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-lg sm:text-xl font-bold mb-4">
              <Home className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>StayFinder</span>
            </div>
            <p className="text-gray-400 text-sm">
              Find your perfect stay anywhere in the world. Book unique homes and experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-base sm:text-lg">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/listings" className="hover:text-white transition-colors">All Listings</Link></li>
              <li><Link href="/my-bookings" className="hover:text-white transition-colors">My Bookings</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4 text-base sm:text-lg">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Safety Information</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Cancellation Options</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-base sm:text-lg">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="break-all">support@stayfinder.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} StayFinder. All rights reserved.</p>
          <div className="mt-4 space-y-1">
            <p className="font-semibold text-gray-300">Development Team</p>
            <p className="text-xs sm:text-sm">Front-End: Patrick Sola, Kassandra Inog</p>
            <p className="text-xs sm:text-sm">Back-End: Paul Castillo</p>
          </div>
        </div>
      </div>
    </footer>
  );
}