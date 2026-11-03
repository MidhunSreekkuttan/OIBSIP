import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../api/client';
import { Shield, CreditCard, MapPin, Phone, User as UserIcon, CheckCircle2, AlertTriangle, ArrowRight, Lock } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, subtotal, deliveryFee, tax, discountAmount, totalAmount, clearCart } = useCart();
  const { user } = useAuth();

  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState('Bangalore');
  const [postalCode, setPostalCode] = useState('560038');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showTestModal, setShowTestModal] = useState(false);
  const [pendingRazorpayOrder, setPendingRazorpayOrder] = useState(null);

  // If cart is empty, redirect
  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  // Handle Form Submission and Initiate Payment
  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName || !phone || !address) {
      setErrorMessage('Please fill in your delivery name, phone, and complete address.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create Razorpay order on backend
      const res = await apiFetch('/payment/create-order', {
        method: 'POST',
        body: JSON.stringify({
          amount: totalAmount,
          currency: 'INR',
        }),
      });

      const razorpayOrder = res.order;
      const keyId = res.keyId;

      setPendingRazorpayOrder(razorpayOrder);

      // Check if standard Razorpay checkout is available on window and key is real
      const hasRealKey = keyId && !keyId.includes('placeholder') && !keyId.includes('simulated');

      if (window.Razorpay && hasRealKey) {
        const options = {
          key: keyId,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'PizzaCraft Artisanal Pizzas',
          description: `Order for ${cartItems.length} handcrafted items`,
          order_id: razorpayOrder.id,
          handler: async function (response) {
            // Payment success callback from Razorpay Modal
            await handlePaymentSuccess({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
          },
          prefill: {
            name: fullName,
            email: user?.email || 'customer@pizzacraft.com',
            contact: phone,
          },
          theme: {
            color: '#ea580c',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          setErrorMessage(`Payment failed: ${response.error.description}`);
          setLoading(false);
        });
        rzp.open();
      } else {
        // Test Simulation Modal (As specified in requirement: "Razorpay checkout integration (test mode — clicking 'Success' confirms the order)")
        setShowTestModal(true);
      }
    } catch (err) {
      console.error('Payment initiation error:', err);
      setErrorMessage(err.message || 'Failed to initiate payment gateway.');
    } finally {
      setLoading(false);
    }
  };

  // Payment Success Handler (called after Razorpay success or Test Modal Success button)
  const handlePaymentSuccess = async ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
    setLoading(true);
    setShowTestModal(false);

    try {
      // 1. Verify Payment on Backend
      await apiFetch('/payment/verify', {
        method: 'POST',
        body: JSON.stringify({
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: razorpaySignature,
        }),
      });

      // 2. Create Order in Database (which atomically decrements stock)
      const orderPayload = {
        items: cartItems.map((item) => ({
          name: item.name,
          type: item.type,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          customization: item.customization,
        })),
        deliveryAddress: {
          fullName,
          phone,
          address,
          city,
          postalCode,
          notes,
        },
        payment: {
          method: 'Razorpay (Test Mode)',
          status: 'Completed',
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
        },
        subtotal,
        tax,
        deliveryFee,
        discount: discountAmount,
        totalAmount,
      };

      const orderRes = await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify(orderPayload),
      });

      if (orderRes.success && orderRes.order) {
        clearCart();
        navigate(`/order-success/${orderRes.order._id}`, {
          state: { order: orderRes.order },
        });
      }
    } catch (err) {
      console.error('Order confirmation error:', err);
      setErrorMessage(err.message || 'Failed to finalize order. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            Secure Payment
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 mt-1">
            Delivery & Checkout
          </h1>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Checkout Notice</p>
              <p className="text-xs mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Form: Delivery Address & Customer Details */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-6 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-orange-600" />
              <span>1. Delivery Destination</span>
            </h2>

            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">
                  Complete Street Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat/House number, building name, street name, landmark"
                  className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Postal PIN Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">
                  Special Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Please ring doorbell twice, leave at door"
                  className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              {/* Payment Method Notice */}
              <div className="mt-6 pt-6 border-t border-stone-100">
                <h3 className="font-bold text-sm text-stone-900 flex items-center space-x-2 mb-2">
                  <CreditCard className="w-4 h-4 text-orange-600" />
                  <span>2. Payment Gateway: Razorpay Test Mode</span>
                </h3>
                <div className="bg-orange-50/70 border border-orange-200 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">💳</span>
                    <div>
                      <p className="text-xs font-bold text-stone-900">
                        Razorpay Test Sandbox Integration
                      </p>
                      <p className="text-[11px] text-stone-600">
                        UPI, Cards, Netbanking & Instant Mock Test Success
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-extrabold uppercase rounded-full">
                    Test Mode
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-base shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {loading ? 'Initiating Razorpay...' : `Pay ₹${totalAmount} with Razorpay`}
                </span>
              </button>
            </form>
          </div>

          {/* Right Column: Order Items Summary */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-4">
              Order Review ({cartItems.length} items)
            </h3>

            <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover border border-stone-100"
                    />
                    <div>
                      <p className="font-bold text-stone-900">{item.name}</p>
                      <p className="text-[11px] text-stone-500">
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-stone-900">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="pt-4 mt-4 border-t border-stone-200 space-y-2.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-mono font-bold text-stone-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%):</span>
                <span className="font-mono font-bold text-stone-900">₹{tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span className="font-mono font-bold text-stone-900">
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount:</span>
                  <span className="font-mono">-₹{discountAmount}</span>
                </div>
              )}
              <div className="pt-3 border-t border-stone-200 flex justify-between items-center text-base font-extrabold text-stone-900">
                <span>Total Payable:</span>
                <span className="font-mono text-xl text-orange-600">₹{totalAmount}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* RAZORPAY TEST MODE CHECKOUT MODAL (As required: Clicking "Success" confirms order) */}
      {showTestModal && pendingRazorpayOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center space-x-3 pb-4 border-b border-stone-100">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-lg">Razorpay Checkout</h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Test Simulation Mode
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="my-6 space-y-4">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">Order ID:</span>
                  <span className="font-mono font-semibold">{pendingRazorpayOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Customer:</span>
                  <span className="font-semibold">{fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Amount:</span>
                  <span className="font-mono font-bold text-base text-stone-900">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start space-x-2">
                <Shield className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Feature Requirement Check:</strong> Click <strong>"Success"</strong> below to simulate authorized payment and confirm your pizza order!
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="space-y-2.5">
              <button
                onClick={() =>
                  handlePaymentSuccess({
                    razorpayOrderId: pendingRazorpayOrder.id,
                    razorpayPaymentId: 'pay_test_' + Date.now(),
                    razorpaySignature: 'mock_signature_success',
                  })
                }
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{loading ? 'Confirming...' : 'Success (Simulate Payment)'}</span>
              </button>

              <button
                onClick={() => setShowTestModal(false)}
                className="w-full py-2.5 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
              >
                Cancel Transaction
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

