import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight, ChefHat, Sparkles } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminLogin(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Admin login error:', err);
      setError(err.message || 'Invalid administrative credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@pizzacraft.com');
    setPassword('Admin@123456');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-950 py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-md w-full bg-stone-900 p-8 sm:p-10 rounded-3xl border border-stone-800 shadow-2xl relative overflow-hidden">
        
        {/* Top badge */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-950 text-purple-400 border border-purple-800 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <ChefHat className="w-8 h-8" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-400 bg-purple-950/70 px-3 py-1 rounded-full border border-purple-800">
            Operations & Kitchen Portal
          </span>
          <h2 className="font-serif text-3xl font-extrabold text-white mt-2">
            Admin Console
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Restricted access: Inventory management & order orchestration
          </p>
        </div>

        {/* Demo Admin Auto-fill Pill */}
        <div className="mb-6 bg-purple-900/30 border border-purple-800/60 p-3 rounded-2xl flex items-center justify-between text-xs text-purple-200">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span>Tester Admin Account Ready</span>
          </div>
          <button
            type="button"
            onClick={fillDemoAdmin}
            className="font-extrabold text-purple-300 bg-purple-950 px-2.5 py-1 rounded-lg border border-purple-700 hover:bg-purple-900 transition-colors"
          >
            Auto-fill
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-start space-x-3">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pizzacraft.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-950 border border-stone-800 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1">
              Secret Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-950 border border-stone-800 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-4"
          >
            <span>{loading ? 'Authenticating...' : 'Enter Admin Console'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-stone-800 text-center text-xs text-stone-500">
          Not a staff member?{' '}
          <Link to="/" className="text-orange-400 hover:underline">
            Return to Customer Storefront
          </Link>
        </div>

      </div>
    </div>
  );
}

