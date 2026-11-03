import React, { useState } from 'react';
import { Star, Plus, Check, SlidersHorizontal } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function PizzaCard({ pizza }) {
  const { addPremadeToCart } = useCart();
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addPremadeToCart(pizza, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleCustomize = () => {
    navigate('/custom-builder', { state: { prefill: pizza } });
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300 flex flex-col justify-between">
      
      {/* Top Image & Badge */}
      <div className="relative h-52 sm:h-56 overflow-hidden bg-stone-100">
        <img
          src={pizza.image}
          alt={pizza.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {pizza.badge && (
            <span className="px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase rounded-full bg-orange-600 text-white shadow-sm">
              {pizza.badge}
            </span>
          )}
          {pizza.isVegetarian ? (
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-600/90 text-white flex items-center space-x-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              <span>Pure Veg</span>
            </span>
          ) : (
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-rose-600/90 text-white">
              Non-Veg
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-stone-900/80 backdrop-blur-md px-2 py-1 rounded-md text-amber-400 text-xs font-bold">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{pizza.rating || 4.8}</span>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
            {pizza.name}
          </h3>
          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
            {pizza.description}
          </p>

          {/* Ingredients Breakdown */}
          <div className="mt-3.5 pt-3 border-t border-stone-100 flex flex-wrap gap-1">
            <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-medium">
              Crust: {pizza.base}
            </span>
            <span className="text-[10px] bg-orange-50 text-orange-700 px-2 py-0.5 rounded font-medium">
              Sauce: {pizza.sauce}
            </span>
            <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-medium">
              Cheese: {pizza.cheese}
            </span>
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400 font-medium block">Price</span>
            <span className="text-xl font-extrabold text-stone-900 font-mono">
              ₹{pizza.price}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCustomize}
              title="Customize this pizza"
              className="p-2 text-stone-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl border border-stone-200 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            <button
              onClick={handleAddToCart}
              className={`px-3.5 py-2 rounded-xl text-sm font-bold flex items-center space-x-1.5 shadow-sm transition-all duration-200 ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-orange-600 hover:bg-orange-700 text-white hover:shadow-orange-200'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

