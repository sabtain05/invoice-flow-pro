import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiPlus, 
  FiSend, 
  FiDollarSign, 
  FiUserPlus,
  FiFileText,
  FiShare2,
  FiPrinter
} from 'react-icons/fi';

const QuickActions = () => {
  const actions = [
    {
      icon: <FiPlus className="w-5 h-5" />,
      label: 'New Invoice',
      description: 'Create a professional invoice',
      path: '/invoices/create',
      color: 'bg-primary-50 text-primary-700',
    },
    {
      icon: <FiSend className="w-5 h-5" />,
      label: 'Send Invoice',
      description: 'Send invoice to client',
      path: '/invoices?status=sent',
      color: 'bg-blue-50 text-blue-700',
    },
    {
      icon: <FiDollarSign className="w-5 h-5" />,
      label: 'Record Payment',
      description: 'Mark invoice as paid',
      path: '/invoices?status=paid',
      color: 'bg-success-50 text-success-700',
    },
    {
      icon: <FiUserPlus className="w-5 h-5" />,
      label: 'Add Client',
      description: 'Add new client',
      path: '/profile?tab=clients',
      color: 'bg-purple-50 text-purple-700',
    },
    {
      icon: <FiFileText className="w-5 h-5" />,
      label: 'View Reports',
      description: 'Financial reports',
      path: '/dashboard',
      color: 'bg-orange-50 text-orange-700',
    },
    {
      icon: <FiShare2 className="w-5 h-5" />,
      label: 'Share Templates',
      description: 'Share invoice templates',
      path: '/settings?tab=templates',
      color: 'bg-pink-50 text-pink-700',
    },
  ];

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold text-secondary-900 mb-6">
        Quick Actions
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.path}
            className="flex items-center p-4 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-card-hover transition-all duration-300 group"
          >
            <div className={`p-3 rounded-lg ${action.color} mr-4 group-hover:scale-110 transition-transform`}>
              {action.icon}
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 group-hover:text-primary-700">
                {action.label}
              </h3>
              <p className="text-sm text-secondary-500">
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Additional Actions Row */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <button className="flex items-center space-x-2 text-secondary-600 hover:text-primary-700 px-3 py-2 rounded-lg hover:bg-primary-50 transition-colors">
            <FiPrinter className="w-4 h-4" />
            <span className="text-sm font-medium">Print All</span>
          </button>
          <button className="flex items-center space-x-2 text-secondary-600 hover:text-primary-700 px-3 py-2 rounded-lg hover:bg-primary-50 transition-colors">
            <FiShare2 className="w-4 h-4" />
            <span className="text-sm font-medium">Export Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;