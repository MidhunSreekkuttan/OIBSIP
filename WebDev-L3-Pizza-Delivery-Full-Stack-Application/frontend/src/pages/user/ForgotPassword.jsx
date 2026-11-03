import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../api/client';
import { Mail, ArrowRight, CheckCircle2, AlertCircle, KeyRound, Sparkles } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiFetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setResult(res);
    } catch (err) {
      setError(err.message || 'Failed to submit reset request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-stone-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-xl">
        
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-3xl font-extrabold text-stone-900">
            Forgot Password?
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Enter your registered email address and we'll dispatch a secure reset link.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {result ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-emerald-900">
              Reset Link Generated
            </h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              If an account matches <strong>{email}</strong>, a password reset link has been dispatched.
            </p>

            {/* Test Simulation Instant Link */}
            {result.resetToken && (
              <div className="pt-3 border-t border-emerald-200 text-left">
                <p className="text-[11px] font-bold text-emerald-900 mb-1">
                  🧪 Test Mode Instant Reset Link:
                </p>
                <Link
                  to={`/reset-password/${result.resetToken}`}
                  className="block text-center py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Click Here to Set New Password
                </Link>
              </div>
            )}

            {result.previewUrl && (
              <a
                href={result.previewUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-orange-600 font-semibold underline block"
              >
                View Ethereal Email Preview ↗
              </a>
            )}

            <div className="pt-2">
              <Link to="/login" className="text-xs text-stone-600 hover:text-stone-900 underline">
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                Your Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@pizzacraft.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Sending link...' : 'Send Reset Link'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-stone-100 text-center text-xs text-stone-500">
          Remembered your password?{' '}
          <Link to="/login" className="font-bold text-orange-600 hover:underline">
            Back to Sign in
          </Link>
        </div>

      </div>
    </div>
  );
}

