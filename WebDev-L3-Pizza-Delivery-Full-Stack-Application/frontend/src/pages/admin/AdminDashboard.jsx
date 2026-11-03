import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import {
  Package,
  ShoppingBag,
  AlertTriangle,
  TrendingUp,
  Clock,
  ArrowRight,
  LogOut,
  ChefHat,
  Bell,
  RefreshCw,
} from 'lucide-react';

export default function AdminDashboard() {
  const { admin, adminLogout } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      const [ordersRes, invRes] = await Promise.all([
        apiFetch('/orders'),
        apiFetch('/inventory'),
      ]);

      if (ordersRes.orders) setOrders(ordersRes.orders);
      if (invRes.items) setInventory(invRes.items);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
      if (err.status === 401 || err.status === 403) {
        adminLogout();
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  // Compute Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'Delivered' && o.status !== 'Cancelled'
  ).length;
  const lowStockItems = inventory.filter((i) => i.stockQuantity <= (i.threshold || 20));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-900 text-white">
        <span className="text-4xl animate-spin">👨‍🍳</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pb-20">
      
      {/* Top Admin Header */}
      <header className="bg-stone-900 border-b border-stone-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">👨‍🍳</span>
              <div>
                <span className="font-serif text-xl font-bold text-white">
                  PizzaCraft <span className="text-purple-400">Admin</span>
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] bg-purple-900/60 text-purple-300 border border-purple-700 font-bold px-2 py-0.5 rounded-full uppercase">
                  Supervisor Panel
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={loadDashboardData}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs flex items-center space-x-1"
                title="Refresh stats"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl bg-rose-950/60 text-rose-300 hover:bg-rose-900 border border-rose-800 text-xs font-bold flex items-center space-x-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit Portal</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Low Stock Warning Banner if items below threshold */}
        {lowStockItems.length > 0 && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-950/40 border border-amber-600/60 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-white">
                  Low Stock Inventory Alert ({lowStockItems.length} items below safety limit)
                </h4>
                <p className="text-xs text-amber-300/80">
                  {lowStockItems.map((i) => `${i.name} (${i.stockQuantity})`).join(', ')}
                </p>
              </div>
            </div>
            <Link
              to="/admin/inventory"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs flex-shrink-0 transition-colors shadow-sm"
            >
              Restock Now ➔
            </Link>
          </div>
        )}

        {/* Top Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          {/* Active Orders */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Active Kitchen Queue
              </span>
              <div className="w-10 h-10 rounded-2xl bg-orange-950/60 text-orange-400 flex items-center justify-center border border-orange-800">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-extrabold text-white font-mono mt-3">
              {activeOrdersCount}
            </h3>
            <p className="text-xs text-stone-400 mt-1">In kitchen or sent to delivery</p>
          </div>

          {/* Total Orders */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Total Orders Placed
              </span>
              <div className="w-10 h-10 rounded-2xl bg-purple-950/60 text-purple-400 flex items-center justify-center border border-purple-800">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-extrabold text-white font-mono mt-3">
              {orders.length}
            </h3>
            <p className="text-xs text-stone-400 mt-1">Cumulative platform orders</p>
          </div>

          {/* Low Stock Items */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Low Stock Items
              </span>
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                  lowStockItems.length > 0
                    ? 'bg-rose-950/60 text-rose-400 border-rose-800 animate-pulse'
                    : 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-extrabold text-white font-mono mt-3">
              {lowStockItems.length}
            </h3>
            <p className="text-xs text-stone-400 mt-1">Items at or below safety threshold</p>
          </div>

          {/* Total Sales */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Gross Sales Volume
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-950/60 text-emerald-400 flex items-center justify-center border border-emerald-800">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-extrabold text-white font-mono mt-3">
              ₹{totalRevenue}
            </h3>
            <p className="text-xs text-stone-400 mt-1">Settled via Razorpay test gateway</p>
          </div>

        </div>

        {/* Quick Operational Navigation Hub */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          
          <Link
            to="/admin/orders"
            className="group bg-gradient-to-br from-stone-900 to-stone-900 hover:to-orange-950/40 border border-stone-800 hover:border-orange-600/50 rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-orange-600/20 text-orange-400 flex items-center justify-center mb-4">
                <ChefHat className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white group-hover:text-orange-400 transition-colors">
                Order Management Panel
              </h3>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                View all incoming pizza orders, inspect customizations, and update order statuses in real time (Order Received ➔ In Kitchen ➔ Sent to Delivery).
              </p>
            </div>
            <div className="mt-6 flex items-center space-x-2 text-xs font-bold text-orange-400">
              <span>Open Orders Console</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/admin/inventory"
            className="group bg-gradient-to-br from-stone-900 to-stone-900 hover:to-purple-950/40 border border-stone-800 hover:border-purple-600/50 rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-4">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
                Inventory & Stock Dashboard
              </h3>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                Monitor live ingredient stocks (bases, sauces, cheeses, veggies). Manually restock items and trigger automated low-stock email alerts via node-cron.
              </p>
            </div>
            <div className="mt-6 flex items-center space-x-2 text-xs font-bold text-purple-400">
              <span>Manage Kitchen Inventory</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>

        {/* Recent Orders Table Preview */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-white">Recent Kitchen Orders</h3>
              <p className="text-xs text-stone-400">Real-time incoming customer transactions</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-purple-400 hover:underline flex items-center space-x-1"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-800 text-stone-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order._id} className="hover:bg-stone-800/50">
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      #{order.orderNumber}
                    </td>
                    <td className="py-3 px-4 text-stone-300">
                      {order.deliveryAddress?.fullName || order.user?.name}
                    </td>
                    <td className="py-3 px-4 text-stone-400">
                      {order.items?.length} item(s)
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      ₹{order.totalAmount}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : order.status === 'Sent to Delivery'
                            ? 'bg-blue-950 text-blue-400 border border-blue-800'
                            : order.status === 'In Kitchen'
                            ? 'bg-orange-950 text-orange-400 border border-orange-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-500">
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}

