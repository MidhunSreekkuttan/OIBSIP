import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../api/client';
import PizzaCard from '../../components/PizzaCard';
import { Sparkles, Flame, ShieldCheck, Clock, ArrowRight, Award, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const data = await apiFetch('/pizzas');
        if (data.pizzas) {
          setPizzas(data.pizzas);
        }
      } catch (err) {
        console.error('Failed to load pizzas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPizzas();
  }, []);

  // Fetch active order for banner if logged in
  useEffect(() => {
    if (!user) return;
    const fetchLatestOrder = async () => {
      try {
        const res = await apiFetch('/orders/my-orders');
        if (res.orders && res.orders.length > 0) {
          const ongoing = res.orders.find(
            (o) => o.status !== 'Delivered' && o.status !== 'Cancelled'
          );
          if (ongoing) {
            setActiveOrder(ongoing);
          }
        }
      } catch (err) {
        // Silently continue
      }
    };

    fetchLatestOrder();
  }, [user]);

  const filteredPizzas = pizzas.filter((p) => {
    if (filter === 'All') return true;
    if (filter === 'Vegetarian') return p.isVegetarian;
    if (filter === 'Bestseller') return p.badge === 'Bestseller';
    if (filter === "Chef's Pick") return p.badge === "Chef's Pick";
    return true;
  });

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      
      {/* Active Live Order Alert Banner (if user has an in-progress order) */}
      {activeOrder && (
        <div className="bg-orange-600 text-white px-4 py-3 shadow-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm font-medium">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-300 animate-ping" />
              <span>
                Active Order <strong>#{activeOrder.orderNumber}</strong> is currently{' '}
                <span className="underline font-bold">{activeOrder.status}</span>!
              </span>
            </div>
            <Link
              to={`/order-tracking/${activeOrder._id}`}
              className="inline-flex items-center space-x-1 bg-white text-orange-600 px-3.5 py-1 rounded-full text-xs font-bold hover:bg-orange-50 transition-colors shadow-sm"
            >
              <span>Track Live Status</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50 via-stone-50 to-stone-50 pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left text column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-700 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider">
                <Flame className="w-4 h-4 text-orange-600" />
                <span>Wood-Fired Neapolitan & Artisanal Crusts</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.15]">
                Pizzas crafted with <span className="text-orange-600 italic">passion</span>, baked to crisp perfection.
              </h1>

              <p className="text-stone-600 text-base sm:text-lg max-w-2xl leading-relaxed">
                Choose from our master chef's signature wood-fired recipes, or design your own customized pizza from scratch with 5 handcrafted crusts, 5 gourmet sauces, cheeses, and farm-fresh garden toppings!
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#menu"
                  className="px-6 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-orange-600/20 hover:shadow-orange-600/30 transition-all flex items-center space-x-2"
                >
                  <span>Explore Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <Link
                  to="/custom-builder"
                  className="px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-100 text-stone-900 font-bold text-sm sm:text-base border border-stone-300 shadow-sm transition-all flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>Build Custom Pizza</span>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="pt-6 border-t border-stone-200 grid grid-cols-3 gap-4 text-xs font-medium text-stone-500">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span>35 Min Fast Delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-orange-500" />
                  <span>100% Fresh Ingredients</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-orange-500" />
                  <span>Razorpay Verified</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-900">
                  <img
                    src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&auto=format&fit=crop&q=80"
                    alt="Wood fired artisanal pizza"
                    className="w-full h-80 sm:h-96 object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="px-3 py-1 bg-orange-600 rounded-full text-xs font-bold uppercase tracking-wider">
                      Chef Recommendation
                    </span>
                    <h3 className="font-serif text-2xl font-bold mt-2">
                      Margherita Di Bufala
                    </h3>
                    <p className="text-stone-300 text-xs mt-1">
                      San Marzano tomatoes, whole milk mozzarella, and fresh basil leaves.
                    </p>
                  </div>
                </div>

                {/* Floating promo badge */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-stone-200 flex items-center space-x-3">
                  <span className="text-3xl">🎉</span>
                  <div>
                    <p className="text-xs font-bold text-stone-900">Special Promo: Use PIZZA50</p>
                    <p className="text-[11px] text-stone-500">₹50 off on orders above ₹400</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Custom Pizza Builder Teaser CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-6 sm:p-10 shadow-xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive 4-Step Wizard</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold">
              Craft Your Signature Dream Pizza
            </h2>
            <p className="text-orange-100 text-sm max-w-xl">
              Choose your Base (5 styles) ➔ Pick Sauce (5 styles) ➔ Select Cheese ➔ Layer with Fresh Veggies. Live real-time visualizer & pricing!
            </p>
          </div>
          <Link
            to="/custom-builder"
            className="flex-shrink-0 px-8 py-4 bg-white text-orange-600 hover:bg-stone-50 font-extrabold rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 text-sm sm:text-base flex items-center space-x-2"
          >
            <span>Launch Pizza Builder</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Menu Varieties Section */}
      <section id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600">
              Fresh From Our Ovens
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 mt-1">
              Available Pizza Varieties
            </h2>
            <p className="text-stone-500 text-sm mt-1 max-w-lg">
              Every pizza is freshly baked to order using fermented dough, authentic San Marzano sauce, and premium cheeses.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center flex-wrap gap-2">
            {['All', 'Vegetarian', 'Bestseller', "Chef's Pick"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filter === f
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Pizzas Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 bg-stone-200/60 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredPizzas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPizzas.map((pizza) => (
              <PizzaCard key={pizza._id} pizza={pizza} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
            <span className="text-4xl">🍕</span>
            <h3 className="font-bold text-stone-800 text-lg mt-3">No pizzas found</h3>
            <p className="text-xs text-stone-500 mt-1">
              Try changing the filter or check back later!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

