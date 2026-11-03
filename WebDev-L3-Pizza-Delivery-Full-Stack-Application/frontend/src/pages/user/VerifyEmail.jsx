import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { updateUserState } = useAuth();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setMessage('No verification token provided in the URL link.');
      return;
    }

    const verify = async () => {
      try {
        const res = await apiFetch(`/auth/verify-email?token=${token}`);
        if (res.success) {
          setSuccess(true);
          setMessage(res.message || 'Email successfully verified!');
          if (res.token && res.user) {
            localStorage.setItem('token', res.token);
            updateUserState(res.user);
          }
        }
      } catch (err) {
        setSuccess(false);
        setMessage(err.message || 'Verification token is invalid or has expired.');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-stone-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-xl text-center">
        
        {loading ? (
          <div className="space-y-4">
            <span className="text-4xl animate-spin block">🔄</span>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Verifying Your Email...
            </h2>
            <p className="text-xs text-stone-500">
              Please wait while our server activates your PizzaCraft account.
            </p>
          </div>
        ) : success ? (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">
              Email Verified
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900">
              Account Activated!
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
              {message} You can now start crafting custom pizzas, placing orders, and enjoying real-time delivery tracking.
            </p>

            <div className="pt-6">
              <Link
                to="/"
                className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>Start Ordering Pizzas</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertCircle className="w-9 h-9" />
            </div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-rose-600">
              Verification Issue
            </span>
            <h2 className="font-serif text-2xl font-extrabold text-stone-900">
              Verification Failed
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
              {message}
            </p>

            <div className="pt-4 flex flex-col gap-2">
              <Link
                to="/login"
                className="py-3 px-4 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 transition-colors"
              >
                Go to Sign In
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

