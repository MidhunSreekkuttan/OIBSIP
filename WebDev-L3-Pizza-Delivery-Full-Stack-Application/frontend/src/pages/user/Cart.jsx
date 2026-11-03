import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, Tag, ShieldCheck, Sparkles, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    subtotal,
    deliveryFee,
    tax,
    discountCode,
    discountAmount,
    totalAmount,
    updateQuantity,
    removeFromCart,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [promoMessage, setPromoMessage] = useState(null);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!inputCode) return;
    const res = applyPromoCode(inputCode);
    setPromoMessage(res);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-stone-50 px-4">
        <div className="max-w-md w-full text-center bg-white p-8 sm:p-12 rounded-3xl border border-stone-200 shadow-sm">
          <span className="text-6xl select-none">🍕</span>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mt-4">
            Your Cart is Empty
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm mt-2 leading-relaxed">
            You haven't added any handcrafted pizzas yet. Explore our signature menu or craft your own in our 4-step builder!
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="flex-1 py-3 px-4 rounded-xl bg-stone-900 text-white font-bold text-sm hover:bg-stone-800 transition-colors"
            >
              Browse Menu
            </Link>
            <Link
              to="/custom-builder"
              className="flex-1 py-3 px-4 rounded-xl bg-orange-600 text-white font-bold text-sm hover:bg-orange-700 transition-colors flex items-center justify-center space-x-1"
            >
              <Sparkles className="w-4 h-4" />
              <span>Custom Builder</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            Order Review
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 mt-1">
            Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Items List (Left Column) */}
          <div className="lg:col-span-7 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Image & Description */}
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover border border-stone-100 flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-stone-900 text-base">{item.name}</h3>
                      {item.type === 'custom' && (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                          Custom Built
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5 line-clamp-2 max-w-sm">
                      {item.description}
                    </p>
                    <span className="text-sm font-bold text-stone-900 font-mono mt-1 block">
                      ₹{item.price} each
                    </span>
                  </div>
                </div>

                {/* Quantity Controls & Delete */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-4 pt-2 sm:pt-0 border-t sm:border-0 border-stone-100">
                  <div className="flex items-center space-x-2 bg-stone-100 p-1 rounded-xl">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-stone-700 hover:text-stone-950 shadow-sm transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold font-mono text-sm px-2">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-stone-700 hover:text-stone-950 shadow-sm transition-colors"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="font-bold text-stone-900 font-mono text-base min-w-[70px] text-right">
                    ₹{item.price * item.quantity}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-stone-400 hover:text-rose-600 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Quick action buttons */}
            <div className="flex items-center justify-between pt-2">
              <Link
                to="/"
                className="text-xs font-bold text-orange-600 hover:underline flex items-center space-x-1"
              >
                <span>← Add more pizzas from menu</span>
              </Link>
              <Link
                to="/custom-builder"
                className="text-xs font-bold text-orange-600 hover:underline flex items-center space-x-1"
              >
                <span>+ Build another custom pizza</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary & Coupon */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Promo Code Card */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
              <h3 className="font-bold text-sm text-stone-900 flex items-center space-x-2 mb-3">
                <Tag className="w-4 h-4 text-orange-500" />
                <span>Apply Promo Voucher</span>
              </h3>

              {discountCode ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-emerald-800 text-xs font-bold">
                  <span>Coupon {discountCode} Applied (-₹{discountAmount})</span>
                  <button
                    onClick={removePromoCode}
                    className="text-rose-600 hover:underline font-normal"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="Enter PIZZA50 or CRUST100"
                    className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none uppercase font-semibold"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {promoMessage && (
                <p
                  className={`text-xs mt-2 font-medium ${
                    promoMessage.success ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {promoMessage.message}
                </p>
              )}
            </div>

            {/* Bill Summary Card */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-5">
                Order Summary
              </h3>

              <div className="space-y-3.5 text-sm text-stone-600">
                <div className="flex justify-between">
                  <span>Items Subtotal:</span>
                  <span className="font-mono font-bold text-stone-900">₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>GST & Restaurant Tax (5%):</span>
                  <span className="font-mono font-bold text-stone-900">₹{tax}</span>
                </div>

                <div className="flex justify-between">
                  <div>
                    <span>Delivery Charge:</span>
                    {subtotal > 600 && (
                      <span className="block text-[10px] text-emerald-600 font-bold">
                        Free delivery on orders above ₹600!
                      </span>
                    )}
                  </div>
                  <span className="font-mono font-bold text-stone-900">
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount Voucher:</span>
                    <span className="font-mono">-₹{discountAmount}</span>
                  </div>
                )}

                <div className="pt-4 border-t border-stone-200 flex justify-between items-center text-base sm:text-lg font-extrabold text-stone-900">
                  <span>Grand Total:</span>
                  <span className="font-mono text-2xl text-orange-600">₹{totalAmount}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full mt-7 py-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-base shadow-lg shadow-orange-600/30 hover:shadow-orange-600/40 transition-all flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="mt-4 flex items-center justify-center space-x-1.5 text-stone-400 text-xs text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Test Mode Razorpay Checkout Enabled</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

