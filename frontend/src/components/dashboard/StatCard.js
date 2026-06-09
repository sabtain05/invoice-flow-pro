import React from 'react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const StatCard = ({ title, value, change, icon, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-700',
    success: 'bg-success-50 text-success-700',
    warning: 'bg-warning-50 text-warning-700',
    danger: 'bg-danger-50 text-danger-700',
    secondary: 'bg-secondary-50 text-secondary-700',
  };

  const isPositive = change && !change.startsWith('-');

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          {icon}
        </div>
        {change && (
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
            isPositive 
              ? 'bg-success-100 text-success-800' 
              : 'bg-danger-100 text-danger-800'
          }`}>
            {isPositive ? (
              <FiTrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <FiTrendingDown className="w-3 h-3 mr-1" />
            )}
            {change}
          </div>
        )}
      </div>
      
      <h3 className="text-2xl font-bold text-secondary-900 mb-1">
        {value}
      </h3>
      <p className="text-secondary-600 text-sm">
        {title}
      </p>
    </div>
  );
};

export default StatCard;