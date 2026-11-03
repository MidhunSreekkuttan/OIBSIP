import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../api/client';
import { useSocket } from '../../context/SocketContext';
import {
  Package,
  AlertTriangle,
  ArrowLeft,
  Plus,
  Minus,
  Edit,
  Mail,
  RefreshCw,
  CheckCircle2,
  Sliders,
  Filter,
} from 'lucide-react';

export default function AdminInventory() {
  const { socket } = useSocket();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [onlyLowStock, setOnlyLowStock] = useState(false);

  // Edit Modal State
  const [editingItem, setEditingItem] = useState(null);
  const [editStock, setEditStock] = useState('');
  const [editThreshold, setEditThreshold] = useState('');
  const [saving, setSaving] = useState(false);

  // Alert Trigger State
  const [triggeringAlert, setTriggeringAlert] = useState(false);
  const [alertResult, setAlertResult] = useState(null);

  const loadInventory = async () => {
    try {
      const res = await apiFetch('/inventory');
      if (res.items) {
        setItems(res.items);
      }
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  // Real-time WebSocket connection to admin inventory channel
  useEffect(() => {
    if (!socket) return;

    socket.emit('join_admin_channel');

    const handleInventoryUpdate = (updatedItem) => {
      console.log('⚡ [Socket] Real-time inventory update:', updatedItem.name, updatedItem.stockQuantity);
      setItems((prev) =>
        prev.map((item) => (item._id === updatedItem._id ? updatedItem : item))
      );
    };

    socket.on('inventory_item_updated', handleInventoryUpdate);

    return () => {
      socket.off('inventory_item_updated', handleInventoryUpdate);
    };
  }, [socket]);

  // Quick Adjust (+10, -5, etc)
  const handleQuickAdjust = async (id, delta) => {
    try {
      const res = await apiFetch(`/inventory/${id}/adjust`, {
        method: 'PATCH',
        body: JSON.stringify({ delta }),
      });

      if (res.item) {
        setItems((prev) =>
          prev.map((i) => (i._id === id ? res.item : i))
        );
      }
    } catch (err) {
      alert(`Adjustment error: ${err.message}`);
    }
  };

  // Open Edit Modal
  const openEditModal = (item) => {
    setEditingItem(item);
    setEditStock(item.stockQuantity.toString());
    setEditThreshold((item.threshold || 20).toString());
  };

  // Save Modal Changes
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    setSaving(true);
    try {
      const res = await apiFetch(`/inventory/${editingItem._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          stockQuantity: Number(editStock),
          threshold: Number(editThreshold),
        }),
      });

      if (res.item) {
        setItems((prev) =>
          prev.map((i) => (i._id === editingItem._id ? res.item : i))
        );
        setEditingItem(null);
      }
    } catch (err) {
      alert(`Save error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Trigger Low-Stock Scheduled Alert Immediately
  const handleTriggerLowStockAlert = async () => {
    setTriggeringAlert(true);
    setAlertResult(null);

    try {
      const res = await apiFetch('/inventory/trigger-alert', {
        method: 'POST',
      });
      setAlertResult(res);
    } catch (err) {
      alert(`Error running stock check: ${err.message}`);
    } finally {
      setTriggeringAlert(false);
    }
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    if (onlyLowStock && item.stockQuantity > (item.threshold || 20)) {
      return false;
    }
    return true;
  });

  const lowStockCount = items.filter((i) => i.stockQuantity <= (i.threshold || 20)).length;

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
                  <span>Inventory Management Dashboard</span>
                </h1>
                <p className="text-[11px] text-stone-400">
                  Live ingredient stock tracking & automated cron notifications
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={loadInventory}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs flex items-center space-x-1"
                title="Refresh inventory"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Scheduled Cron Job Alert Action Card */}
        <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-stone-900 via-purple-950/40 to-stone-900 border border-purple-800/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-extrabold uppercase tracking-widest text-purple-400">
                Scheduled Cron Monitor (node-cron)
              </span>
            </div>
            <h3 className="font-serif text-xl font-bold text-white">
              Automated Low-Stock Email Notifications
            </h3>
            <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
              Active schedule: runs automatically every 5 minutes. Scans inventory for items where stock quantity is below safety threshold (&lt;20). Click below to trigger and test an alert email immediately.
            </p>
          </div>

          <button
            onClick={handleTriggerLowStockAlert}
            disabled={triggeringAlert}
            className="flex-shrink-0 px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center space-x-2 shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
          >
            <Mail className="w-4 h-4" />
            <span>{triggeringAlert ? 'Checking Stock & Sending...' : 'Trigger Stock Check & Email Now'}</span>
          </button>
        </div>

        {/* Alert Trigger Result Banner */}
        {alertResult && (
          <div className="mb-8 p-5 rounded-2xl bg-stone-900 border border-emerald-600 text-stone-200 text-xs space-y-2 animate-in fade-in">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-5 h-5" />
              <span>Cron Job Stock Check Triggered Successfully</span>
            </div>
            <p className="text-stone-300">
              Low-stock items detected: <strong>{alertResult.result?.count ?? 0}</strong>.
              {alertResult.result?.alertSent
                ? ' Email notification successfully generated and dispatched to admin!'
                : ' Notification was debounced to prevent spam.'}
            </p>
            {alertResult.result?.previewUrl && (
              <p className="pt-1">
                🔗 <strong>Email Preview Link:</strong>{' '}
                <a
                  href={alertResult.result.previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple-400 underline font-mono break-all"
                >
                  {alertResult.result.previewUrl} ↗
                </a>
              </p>
            )}
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-800">
          
          {/* Category Tabs */}
          <div className="flex items-center flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'base', label: 'Pizza Bases (5)' },
              { id: 'sauce', label: 'Sauces (5)' },
              { id: 'cheese', label: 'Cheeses' },
              { id: 'vegetable', label: 'Vegetables' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800 border border-stone-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Low stock toggle */}
          <button
            onClick={() => setOnlyLowStock(!onlyLowStock)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
              onlyLowStock
                ? 'bg-amber-500 text-stone-950 font-extrabold shadow-sm'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Show Low Stock Only ({lowStockCount})</span>
          </button>
        </div>

        {/* Inventory Items Table */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-800 bg-stone-900/80 text-stone-400 uppercase text-[10px] tracking-wider">
                  <th className="py-4 px-6">Item Name</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Current Stock</th>
                  <th className="py-4 px-6">Safety Threshold</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Quick Restock / Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-stone-500">
                      Loading pantry stock...
                    </td>
                  </tr>
                ) : filteredItems.length > 0 ? (
                  filteredItems.map((item) => {
                    const threshold = item.threshold || 20;
                    const isOutOfStock = item.stockQuantity <= 0;
                    const isLow = item.stockQuantity <= threshold;

                    return (
                      <tr
                        key={item._id}
                        className={`hover:bg-stone-800/40 transition-colors ${
                          isLow ? 'bg-amber-950/20' : ''
                        }`}
                      >
                        {/* Name & Icon */}
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-9 h-9 rounded-xl object-cover border border-stone-800"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-xl bg-stone-800 flex items-center justify-center text-sm">
                                🍕
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-white text-sm">{item.name}</p>
                              <p className="text-[11px] text-stone-400 line-clamp-1 max-w-xs">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-6">
                          <span className="capitalize font-medium text-stone-300 bg-stone-800 px-2.5 py-1 rounded-md text-[11px]">
                            {item.category}
                          </span>
                        </td>

                        {/* Stock Quantity */}
                        <td className="py-4 px-6">
                          <span
                            className={`font-mono font-extrabold text-base ${
                              isOutOfStock
                                ? 'text-rose-400'
                                : isLow
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            {item.stockQuantity}
                          </span>
                          <span className="text-stone-500 text-[11px] ml-1">
                            {item.unit || 'units'}
                          </span>
                        </td>

                        {/* Threshold */}
                        <td className="py-4 px-6 font-mono text-stone-400">
                          {threshold} {item.unit || 'units'}
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-6">
                          {isOutOfStock ? (
                            <span className="px-2.5 py-1 bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-extrabold uppercase rounded-full">
                              Out of Stock
                            </span>
                          ) : isLow ? (
                            <span className="px-2.5 py-1 bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-extrabold uppercase rounded-full flex items-center space-x-1 w-max">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Low Stock</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-extrabold uppercase rounded-full">
                              In Stock
                            </span>
                          )}
                        </td>

                        {/* Manual Quick Restock & Edit Buttons */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleQuickAdjust(item._id, -5)}
                              className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg font-mono text-xs font-bold"
                              title="Decrease 5"
                            >
                              -5
                            </button>
                            <button
                              onClick={() => handleQuickAdjust(item._id, 10)}
                              className="px-2 py-1 bg-stone-800 hover:bg-purple-900 text-purple-300 rounded-lg font-mono text-xs font-bold"
                              title="Restock 10"
                            >
                              +10
                            </button>
                            <button
                              onClick={() => handleQuickAdjust(item._id, 50)}
                              className="px-2 py-1 bg-stone-800 hover:bg-purple-900 text-purple-300 rounded-lg font-mono text-xs font-bold"
                              title="Restock 50"
                            >
                              +50
                            </button>
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition-colors ml-1"
                              title="Edit item threshold"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-stone-500">
                      No inventory items found matching this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Manual Stock Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-stone-900 rounded-3xl max-w-md w-full p-6 sm:p-8 border border-stone-800 shadow-2xl">
            <h3 className="font-serif text-xl font-bold text-white mb-1">
              Update Stock: {editingItem.name}
            </h3>
            <p className="text-xs text-stone-400 mb-6">
              Category: <span className="capitalize">{editingItem.category}</span>
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Current Stock Quantity
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={editStock}
                  onChange={(e) => setEditStock(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-950 border border-stone-800 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Low Stock Safety Threshold
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={editThreshold}
                  onChange={(e) => setEditThreshold(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-950 border border-stone-800 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  An alert email is automatically triggered when stock drops to or below this count.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Stock Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

