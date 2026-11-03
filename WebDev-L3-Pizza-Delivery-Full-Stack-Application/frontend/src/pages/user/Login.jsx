import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../api/client';
import { Lock, Mail, AlertCircle, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [resendSuccess, setResendSuccess] = useState('');

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResendSuccess('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      if (err.data?.isVerified === false) {
        setUnverifiedEmail(email);
      }
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // Resend verification email
  const handleResendVerification = async () => {
    try {
      const res = await apiFetch('/auth/resend-verification', {
        method: 'POST',
        body: JSON.stringify({ email: unverifiedEmail || email }),
      });
      setResendSuccess(
        `Verification email resent! ${
          res.previewUrl ? `Preview URL available: ${res.previewUrl}` : ''
        }`
      );
    } catch (err) {
      setError(err.message || 'Failed to resend verification.');
    }
  };

  // Quick fill demo customer credentials
  const fillDemoCustomer = () => {
    setEmail('customer@pizzacraft.com');
    setPassword('User@123456');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block text-4xl mb-2 hover:scale-110 transition-transform">
            🍕
          </Link>
          <h2 className="font-serif text-3xl font-extrabold text-stone-900">
            Welcome Back
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Sign in to order artisanal pizzas and track delivery in real time
          </p>
        </div>

        {/* Demo Quick Fill Pill */}
        <div className="mb-6 bg-orange-50 border border-orange-200 p-3 rounded-2xl flex items-center justify-between text-xs text-orange-800">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-orange-600 flex-shrink-0" />
            <span>Tester Demo Account Ready</span>
          </div>
          <button
            type="button"
            onClick={fillDemoCustomer}
            className="font-extrabold text-orange-700 bg-white px-2.5 py-1 rounded-lg shadow-xs hover:bg-orange-100 transition-colors"
          >
            Auto-fill Demo
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-3">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{error}</p>
              {unverifiedEmail && (
                <button
                  type="button"
                  onClick={handleResendVerification}
                  className="mt-2 text-rose-700 underline font-bold block"
                >
                  Click here to resend verification link
                </button>
              )}
            </div>
          </div>
        )}

        {resendSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="break-all">{resendSuccess}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-orange-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-stone-100 text-center text-xs text-stone-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-orange-600 hover:underline">
            Register here
          </Link>
        </div>

      </div>
    </div>
  );
}

