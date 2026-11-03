import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../../api/client';
import { useSocket } from '../../context/SocketContext';
import OrderTimeline from '../../components/OrderTimeline';
import { Clock, MapPin, Phone, ShieldCheck, ArrowLeft, RefreshCw, ChefHat, Bike, AlertCircle } from 'lucide-react';

export default function OrderTracking() {
  const { id } = useParams();
  const { socket, connected } = useSocket();

  const [order, setOrder] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  // Fetch specific order or all user orders
  const loadOrderData = async () => {
    try {
      if (id) {
        const res = await apiFetch(`/orders/${id}`);
        if (res.order) {
          setOrder(res.order);
        }
      } else {
        const res = await apiFetch('/orders/my-orders');
        if (res.orders && res.orders.length > 0) {
          setAllOrders(res.orders);
          setOrder(res.orders[0]); // Select latest order
        }
      }
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Failed to load order for tracking:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [id]);

  // Real-time WebSocket connection to order room
  useEffect(() => {
    if (!socket || !order?._id) return;

    const orderId = order._id;
    socket.emit('join_order_room', orderId);

    const handleStatusUpdate = (updatedOrder) => {
      console.log('⚡ [Socket Live Update] Order received new status:', updatedOrder.status);
      if (updatedOrder._id === orderId) {
        setOrder(updatedOrder);
      }
    };

    socket.on('order_status_updated', handleStatusUpdate);

    // Fallback polling every 5 seconds (as required by specification: "use polling or WebSockets")
    const interval = setInterval(() => {
      loadOrderData();
    }, 5000);

    return () => {
      socket.emit('leave_order_room', orderId);
      socket.off('order_status_updated', handleStatusUpdate);
      clearInterval(interval);
    };
  }, [socket, order?._id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center space-y-3">
          <span className="text-4xl animate-bounce">🍕</span>
          <p className="text-sm font-semibold text-stone-500">Connecting to live kitchen tracker...</p>
        </div>
      </div>
    );
  }

  if (!order && allOrders.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-stone-50 px-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl border border-stone-200">
          <span className="text-5xl">📦</span>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mt-4">No Orders Yet</h2>
          <p className="text-xs text-stone-500 mt-1">
            You haven't placed any pizza orders yet. Check out our menu!
          </p>
          <Link
            to="/"
            className="inline-block mt-6 px-6 py-3 rounded-xl bg-orange-600 text-white font-bold text-sm"
          >
            Order a Pizza
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-stone-200 gap-4">
          <div>
            <Link
              to="/"
              className="text-xs font-bold text-stone-500 hover:text-orange-600 flex items-center space-x-1 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <h1 className="font-serif text-3xl font-extrabold text-stone-900">
              Live Order Tracker: <span className="text-orange-600 font-mono">#{order.orderNumber}</span>
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleString()} • Estimated delivery in 35 mins
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={loadOrderData}
              className="p-2 bg-white rounded-xl border border-stone-200 text-stone-600 hover:text-orange-600 shadow-sm flex items-center space-x-1.5 text-xs font-semibold"
              title="Refresh status"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Synced ({lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })})</span>
            </button>
          </div>
        </div>

        {/* Real-time Order Timeline Component */}
        <div className="mb-8">
          <OrderTimeline
            currentStatus={order.status}
            statusHistory={order.statusHistory}
          />
        </div>

        {/* Order Details & Delivery Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Items Breakdown */}
          <div className="md:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-4">
              Pizza Details ({order.items.length} items)
            </h3>

            <div className="divide-y divide-stone-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-start justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">{item.name}</h4>
                    {item.customization && (
                      <div className="mt-1 space-y-0.5 text-stone-500">
                        {item.customization.base && (
                          <p>• Base: <span className="font-semibold text-stone-700">{item.customization.base}</span></p>
                        )}
                        {item.customization.sauce && (
                          <p>• Sauce: <span className="font-semibold text-stone-700">{item.customization.sauce}</span></p>
                        )}
                        {item.customization.cheese && (
                          <p>• Cheese: <span className="font-semibold text-stone-700">{item.customization.cheese}</span></p>
                        )}
                        {item.customization.vegetables?.length > 0 && (
                          <p>• Veggies: <span className="font-semibold text-stone-700">{item.customization.vegetables.join(', ')}</span></p>
                        )}
                      </div>
                    )}
                    <span className="text-stone-400 mt-1 block">Quantity: {item.quantity}</span>
                  </div>
                  <span className="font-mono font-bold text-stone-900 text-sm">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 mt-4 border-t border-stone-200 space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono font-bold">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span className="font-mono font-bold">₹{order.deliveryFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (GST):</span>
                <span className="font-mono font-bold">₹{order.tax}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount:</span>
                  <span className="font-mono">-₹{order.discount}</span>
                </div>
              )}
              <div className="pt-2 border-t border-stone-200 flex justify-between text-base font-extrabold text-stone-900">
                <span>Total Paid:</span>
                <span className="font-mono text-orange-600">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Destination & Kitchen Info */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm">
              <h3 className="font-serif text-base font-bold text-stone-900 mb-4 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-orange-600" />
                <span>Delivery Destination</span>
              </h3>

              <div className="text-xs space-y-2 text-stone-600">
                <p className="font-bold text-stone-900 text-sm">
                  {order.deliveryAddress?.fullName}
                </p>
                <p className="leading-relaxed">
                  {order.deliveryAddress?.address}, {order.deliveryAddress?.city} - {order.deliveryAddress?.postalCode}
                </p>
                <p className="flex items-center space-x-1 text-stone-500 pt-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{order.deliveryAddress?.phone}</span>
                </p>
                {order.deliveryAddress?.notes && (
                  <p className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 mt-2 text-stone-700 italic">
                    "{order.deliveryAddress.notes}"
                  </p>
                )}
              </div>
            </div>

            {/* Live Kitchen Status Card */}
            <div className="bg-stone-900 text-white rounded-3xl p-6 shadow-md border border-stone-800">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center">
                  <ChefHat className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Wood-Fired Kitchen Hub</h4>
                  <p className="text-[11px] text-stone-400">Indiranagar Artisanal Branch</p>
                </div>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Your pizza is hand-stretched and fired in our 480°C refractory brick oven. As soon as the chef updates the status to <em>In Kitchen</em> or <em>Sent to Delivery</em>, this screen will update in real time!
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

