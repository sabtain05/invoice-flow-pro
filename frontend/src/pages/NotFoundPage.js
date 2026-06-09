import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>404 Page Not Found - Invoice Flow Pro</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          {/* Error Code */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold gradient-text">404</h1>
            <div className="w-48 h-1 bg-gradient-primary mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Message */}
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-secondary-600 mb-8">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="btn-primary inline-flex items-center justify-center space-x-2"
            >
              <FiHome className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn-outline inline-flex items-center justify-center space-x-2"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-secondary-500">
              Need help?{' '}
              <Link to="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;