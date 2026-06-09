import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex flex-col">
      {/* Back to Home */}
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="flex items-center space-x-2 text-secondary-600 hover:text-primary-700 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">IF</span>
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold text-secondary-900">
                  Invoice<span className="gradient-text">Flow</span> Pro
                </h1>
                <p className="text-secondary-600">Professional Invoice Management</p>
              </div>
            </Link>
          </div>

          {/* Auth Form Container */}
          <div className="card p-8">
            <Outlet />
          </div>

          {/* Footer Text */}
          <div className="text-center mt-6 text-secondary-600">
            <p className="text-sm">
              By continuing, you agree to our{' '}
              <Link to="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;