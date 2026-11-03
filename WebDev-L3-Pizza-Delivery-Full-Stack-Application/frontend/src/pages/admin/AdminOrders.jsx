import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../api/client';
import { useSocket } from '../../context/SocketContext';
import {
  ChefHat,
  Bike,
  CheckCircle2,
  Clock,
  ArrowLeft,
  RefreshCw,
  Phone,
  MapPin,
  Flame,
  AlertCircle,
  Eye,
  Filter,
} from 'lucide-react';

export default function AdminOrders() {
  const { socket } = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  const loadOrders = async () => {
    try {
      const res = await apiFetch(`/orders${statusFilter !== 'all' ? `?status=${statusFilter}` : ''}`);
      if (res.orders) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  // Real-time WebSocket connection to admin channel
  useEffect(() => {
    if (!socket) return;

    socket.emit('join_admin_channel');

    // New order received in real-time
    const handleNewOrder = (newOrder) => {
      console.log('⚡ [Socket] New order arrived in admin panel:', newOrder.orderNumber);
      setOrders((prev) => [newOrder, ...prev]);
    };

    // Existing order updated
    const handleOrderUpdated = (updatedOrder) => {
      console.log('⚡ [Socket] Order updated in admin panel:', updatedOrder.orderNumber);
      setOrders((prev) =>
        prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
      );
    };

    socket.on('new_order_received', handleNewOrder);
    socket.on('order_updated', handleOrderUpdated);

    return () => {
      socket.off('new_order_received', handleNewOrder);
      socket.off('order_updated', handleOrderUpdated);
    };
  }, [socket]);

  // Update Status handler
  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await apiFetch(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: newStatus,
          note: `Kitchen status updated to "${newStatus}" by head supervisor.`,
        }),
      });

      if (res.order) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? res.order : o))
        );
        if (selectedOrderDetails?._id === orderId) {
          setSelectedOrderDetails(res.order);
        }
      }
    } catch (err) {
      alert(`Status update error: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pb-20">
      
      {/* Top Header */}
      <header className="bg-stone-900 border-b border-stone-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Link
                to="/admin/dashboard"
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="font-serif text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                  <span>Order Management & Kitchen Dispatch</span>
                </h1>
                <p className="text-[11px] text-stone-400">
                  Live order tracking & WebSocket state broadcast
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={loadOrders}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs flex items-center space-x-1"
                title="Refresh orders"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sync</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Status Filter Bar */}
        <div className="flex items-center flex-wrap gap-2 mb-8 pb-4 border-b border-stone-800">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'Order Received', label: 'Order Received' },
            { id: 'In Kitchen', label: 'In Kitchen' },
            { id: 'Sent to Delivery', label: 'Sent to Delivery' },
            { id: 'Delivered', label: 'Delivered' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                statusFilter === tab.id
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800 border border-stone-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="py-20 text-center text-stone-500">
            <span className="text-4xl animate-bounce">🍕</span>
            <p className="text-xs mt-3">Loading kitchen orders...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => {
              const isUpdating = updatingId === order._id;

              return (
                <div
                  key={order._id}
                  className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:border-stone-700 transition-colors"
                >
                  {/* Order Identity & Customer */}
                  <div className="space-y-1.5 min-w-[200px]">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xl font-extrabold text-white">
                        #{order.orderNumber}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : order.status === 'Sent to Delivery'
                            ? 'bg-blue-950 text-blue-400 border border-blue-800'
                            : order.status === 'In Kitchen'
                            ? 'bg-orange-950 text-orange-400 border border-orange-800 animate-pulse'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <p className="text-xs text-stone-300 font-semibold">
                      {order.deliveryAddress?.fullName} ({order.deliveryAddress?.phone})
                    </p>
                    <p className="text-[11px] text-stone-500 line-clamp-1">
                      {order.deliveryAddress?.address}, {order.deliveryAddress?.city}
                    </p>
                    <p className="text-[10px] text-stone-500 font-mono">
                      Placed: {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {/* Items Preview */}
                  <div className="flex-1 bg-stone-950 p-3.5 rounded-2xl border border-stone-800/80 max-w-lg w-full">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                      Order Items ({order.items?.length})
                    </p>
                    <div className="space-y-1">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="text-xs flex justify-between text-stone-300">
                          <div>
                            <span className="font-bold">{item.quantity}× {item.name}</span>
                            {item.customization?.base && (
                              <span className="text-[11px] text-stone-500 block">
                                [{item.customization.base} • {item.customization.sauce} • {item.customization.cheese}
                                {item.customization.vegetables?.length > 0 ? ` • ${item.customization.vegetables.join(', ')}` : ''}]
                              </span>
                            )}
                          </div>
                          <span className="font-mono font-semibold ml-2">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 mt-2 border-t border-stone-800 flex justify-between text-xs font-bold text-white">
                      <span>Total:</span>
                      <span className="font-mono text-orange-400">₹{order.totalAmount}</span>
                    </div>
                  </div>

                  {/* Action Buttons to Advance Status */}
                  <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
                    
                    {/* Advance to In Kitchen */}
                    {order.status === 'Order Received' && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'In Kitchen')}
                        disabled={isUpdating}
                        className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md transition-all disabled:opacity-50"
                      >
                        <Flame className="w-3.5 h-3.5" />
                        <span>Move to "In Kitchen"</span>
                      </button>
                    )}

                    {/* Advance to Sent to Delivery */}
                    {order.status === 'In Kitchen' && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'Sent to Delivery')}
                        disabled={isUpdating}
                        className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md transition-all disabled:opacity-50"
                      >
                        <Bike className="w-3.5 h-3.5" />
                        <span>Dispatch to "Sent to Delivery"</span>
                      </button>
                    )}

                    {/* Mark as Delivered */}
                    {order.status === 'Sent to Delivery' && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'Delivered')}
                        disabled={isUpdating}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md transition-all disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark as "Delivered"</span>
                      </button>
                    )}

                    {order.status === 'Delivered' && (
                      <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Order Completed</span>
                      </span>
                    )}

                    {/* View Details modal toggle */}
                    <button
                      onClick={() => setSelectedOrderDetails(order)}
                      className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl transition-colors"
                      title="Inspect full details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-12 text-center text-stone-500">
            <span className="text-4xl">📭</span>
            <h3 className="font-bold text-white text-base mt-3">No orders found</h3>
            <p className="text-xs text-stone-400 mt-1">
              There are currently no orders under the selected filter.
            </p>
          </div>
        )}

      </main>

      {/* Inspect Order Details Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-stone-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-stone-800 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div>
                <h3 className="font-serif text-xl font-bold text-white">
                  Order #{selectedOrderDetails.orderNumber}
                </h3>
                <span className="text-xs text-stone-400 font-mono">
                  ID: {selectedOrderDetails._id}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="text-stone-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="my-6 space-y-4 text-xs">
              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-2">
                <p className="font-bold text-stone-300">Customer & Destination</p>
                <p className="text-stone-400">
                  Name: <span className="text-white">{selectedOrderDetails.deliveryAddress?.fullName}</span>
                </p>
                <p className="text-stone-400">
                  Phone: <span className="text-white">{selectedOrderDetails.deliveryAddress?.phone}</span>
                </p>
                <p className="text-stone-400">
                  Address: <span className="text-white">{selectedOrderDetails.deliveryAddress?.address}, {selectedOrderDetails.deliveryAddress?.city}</span>
                </p>
              </div>

              {/* Status Timeline History */}
              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-2">
                <p className="font-bold text-stone-300">Audit Status History</p>
                <div className="space-y-1.5">
                  {selectedOrderDetails.statusHistory?.map((h, i) => (
                    <div key={i} className="flex justify-between text-stone-400">
                      <span>• {h.status} ({h.note || 'Updated'})</span>
                      <span className="font-mono">{new Date(h.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

