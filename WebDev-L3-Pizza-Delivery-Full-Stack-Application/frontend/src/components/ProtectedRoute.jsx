import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center space-y-3">
          <span className="text-4xl animate-bounce">🍕</span>
          <p className="text-sm font-semibold text-stone-500">Checking credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-900 text-white">
        <div className="flex flex-col items-center space-y-3">
          <span className="text-4xl animate-spin">👨‍🍳</span>
          <p className="text-sm font-semibold text-stone-400">Verifying administrative access...</p>
        </div>
      </div>
    );
  }

  if (!admin || admin.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

