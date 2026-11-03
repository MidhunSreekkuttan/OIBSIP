import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User as UserIcon, LogOut, Menu, X, Sparkles, ChefHat, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, admin, logout, adminLogout } = useAuth();
  const { totalItemsCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <span className="text-3xl transform group-hover:rotate-12 transition-transform duration-300">
              🍕
            </span>
            <div>
              <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 group-hover:text-orange-600 transition-colors">
                Pizza<span className="text-orange-600">Craft</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-bold tracking-widest text-stone-400">
                Artisanal Wood-Fired
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/') 
                  ? 'bg-orange-50 text-orange-600' 
                  : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
              }`}
            >
              Menu
            </Link>

            <Link
              to="/custom-builder"
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center space-x-1.5 transition-all ${
                isActive('/custom-builder')
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-stone-700 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Custom Pizza Builder</span>
            </Link>

            {user && (
              <Link
                to="/my-orders"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/my-orders')
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
                }`}
              >
                Track Orders
              </Link>
            )}

            {/* Admin Portal Shortcut */}
            {admin ? (
              <Link
                to="/admin/dashboard"
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 flex items-center space-x-1"
              >
                <ChefHat className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="text-stone-400 hover:text-stone-600 px-2 py-1 text-xs font-medium"
                title="Staff & Kitchen Portal"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Right Action Icons: Cart & Profile */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Cart Link */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl bg-stone-100 hover:bg-orange-100 text-stone-800 hover:text-orange-600 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow">
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {/* User Profile / Auth Actions */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/my-orders"
                  className="hidden sm:flex items-center space-x-2 text-stone-800 text-sm font-medium hover:text-orange-600"
                >
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-xs border border-orange-200">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-stone-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-sm font-semibold text-stone-700 hover:text-stone-950 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-sm transition-all hover:shadow-orange-200"
                >
                  Join Us
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg font-semibold text-stone-800 hover:bg-stone-100"
          >
            Explore Menu
          </Link>
          <Link
            to="/custom-builder"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg font-semibold text-orange-600 bg-orange-50"
          >
            ✨ Custom Pizza Builder
          </Link>
          {user && (
            <Link
              to="/my-orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg font-semibold text-stone-800 hover:bg-stone-100"
            >
              Track Orders
            </Link>
          )}
          <Link
            to="/admin/login"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg font-semibold text-purple-700 bg-purple-50"
          >
            👨‍🍳 Admin Portal
          </Link>
          {!user ? (
            <div className="pt-3 border-t border-stone-200 flex space-x-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-1/2 text-center py-2 text-sm font-semibold text-stone-700 bg-stone-100 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-1/2 text-center py-2 text-sm font-bold text-white bg-orange-600 rounded-lg"
              >
                Register
              </Link>
            </div>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-rose-600 font-semibold"
            >
              Log Out ({user.name})
            </button>
          )}
        </div>
      )}
    </header>
  );
}

