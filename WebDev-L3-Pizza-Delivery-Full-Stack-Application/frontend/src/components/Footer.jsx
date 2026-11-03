import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Phone, MapPin, Heart, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">🍕</span>
              <span className="font-serif text-2xl font-bold text-white">
                Pizza<span className="text-orange-500">Craft</span>
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              Handcrafted artisanal pizzas prepared fresh in our authentic 480°C wood-fired ovens. Made from Italian San Marzano tomatoes, local herbs, and slow-fermented dough.
            </p>
            <div className="flex items-center space-x-2 text-xs text-stone-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Razorpay Test Gateway Enabled</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Explore Menu</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-orange-400 transition-colors">Pre-made Signature Pizzas</Link>
              </li>
              <li>
                <Link to="/custom-builder" className="hover:text-orange-400 transition-colors">Custom Pizza Builder (4-Step)</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-orange-400 transition-colors">Cart & Order Review</Link>
              </li>
              <li>
                <Link to="/my-orders" className="hover:text-orange-400 transition-colors">Live Order Tracking</Link>
              </li>
            </ul>
          </div>

          {/* Kitchen Hours & Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Kitchen & Delivery</h4>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <span>Open Daily: 11:00 AM – 11:30 PM</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <span>Indiranagar Kitchen Hub, Bangalore, KA</span>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
            </ul>
          </div>

          {/* Admin & Operations */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Kitchen Staff Portal</h4>
            <p className="text-xs text-stone-400 mb-3">
              Inventory managers and kitchen supervisors log in here to monitor stock levels and update order statuses.
            </p>
            <Link
              to="/admin/login"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-lg bg-stone-800 text-stone-200 hover:bg-stone-700 hover:text-white border border-stone-700 transition-colors"
            >
              🔒 Admin Login Portal
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} PizzaCraft Platform. Built with React, Node.js, Express & MongoDB.</p>
          <p className="flex items-center space-x-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for pizza lovers</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

