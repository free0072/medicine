import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, Package } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* 404 Icon */}
        <div className="mx-auto h-32 w-32 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-8">
          <Package className="h-16 w-16 text-white" />
        </div>

        {/* Error Message */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <Home className="h-5 w-5" />
            <span>Go Home</span>
          </Link>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium border border-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Search className="h-5 w-5" />
              <span>Browse Products</span>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Go Back</span>
            </button>
          </div>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Popular Pages</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/products"
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              All Products
            </Link>
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              Create Account
            </Link>
            <Link
              to="/cart"
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              Shopping Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 