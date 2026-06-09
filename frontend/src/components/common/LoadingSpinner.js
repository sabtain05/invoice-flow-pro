import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`spinner ${sizeClasses[size]} border-primary-100 border-t-primary-600`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export const InlineLoadingSpinner = () => (
  <div className="inline-flex items-center">
    <div className="spinner w-4 h-4 border-2 border-primary-100 border-t-primary-600 mr-2" />
    <span className="text-sm text-secondary-600">Loading...</span>
  </div>
);

export const PageLoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="xl" />
  </div>
);

export default LoadingSpinner;