import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CheckCircle2, ArrowRight, Clock, MapPin, Receipt, Sparkles } from 'lucide-react';
import { apiFetch } from '../../api/client';

export default function OrderSuccess() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    // Fire festive confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // Ignore if confetti not supported
    }

    if (!order && id) {
      const fetchOrder = async () => {
        try {
          const res = await apiFetch(`/orders/${id}`);
          if (res.order) {
            setOrder(res.order);
          }
        } catch (err) {
          console.error('Failed to load order:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchOrder();
    }
  }, [id, order]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <span className="text-4xl animate-bounce">🍕</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 sm:py-20 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Celebration Banner Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 shadow-lg text-center relative overflow-hidden">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">
            Payment & Order Confirmed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 mt-2">
            Order #{order?.orderNumber || 'PZ-10023'}
          </h1>
          <p className="text-stone-500 text-sm mt-2 max-w-md mx-auto">
            Hooray! Your order has been transferred to our kitchen stone ovens. Ingredients have been reserved and inventory deducted.
          </p>

          {/* Quick CTA to Real-time tracking */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={`/order-tracking/${order?._id || id}`}
              className="px-6 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center space-x-2"
            >
              <span>Track Real-Time Status</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/"
              className="px-6 py-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm transition-colors"
            >
              Back to Home
            </Link>
          </div>

          {/* Receipt Details Box */}
          <div className="mt-10 pt-8 border-t border-stone-100 text-left space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="flex items-center space-x-1.5">
                <Receipt className="w-4 h-4 text-stone-400" />
                <span>Transaction ID:</span>
              </span>
              <span className="font-mono text-stone-800">
                {order?.payment?.razorpayPaymentId || 'pay_test_simulated'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-stone-400" />
                <span>Estimated Delivery:</span>
              </span>
              <span className="font-bold text-stone-800">35 - 45 Minutes</span>
            </div>

            <div className="flex items-start justify-between text-xs text-stone-500">
              <span className="flex items-center space-x-1.5 mt-0.5">
                <MapPin className="w-4 h-4 text-stone-400 flex-shrink-0" />
                <span>Deliver To:</span>
              </span>
              <span className="text-right text-stone-800 max-w-xs">
                {order?.deliveryAddress?.address}, {order?.deliveryAddress?.city}
              </span>
            </div>

            {/* Items Summary */}
            <div className="bg-stone-50 p-4 rounded-2xl mt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Items Ordered
              </p>
              <div className="space-y-1.5">
                {order?.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs text-stone-800">
                    <span>
                      {item.quantity}× {item.name}
                    </span>
                    <span className="font-mono font-semibold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 mt-2 border-t border-stone-200 flex justify-between text-sm font-extrabold text-stone-900">
                <span>Total Paid:</span>
                <span className="font-mono text-orange-600">₹{order?.totalAmount}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

