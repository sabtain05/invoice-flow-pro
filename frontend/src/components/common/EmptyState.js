import React from 'react';
import { FiFileText, FiUsers, FiSearch, FiFolder } from 'react-icons/fi';

const EmptyState = ({ 
  type = 'default',
  title,
  message,
  action,
  icon: Icon
}) => {
  const defaultConfigs = {
    invoices: {
      icon: <FiFileText className="w-12 h-12 text-primary-400" />,
      title: 'No invoices yet',
      message: 'Create your first invoice to get started.',
    },
    clients: {
      icon: <FiUsers className="w-12 h-12 text-primary-400" />,
      title: 'No clients yet',
      message: 'Add your first client to start creating invoices.',
    },
    search: {
      icon: <FiSearch className="w-12 h-12 text-secondary-400" />,
      title: 'No results found',
      message: 'Try adjusting your search or filters.',
    },
    default: {
      icon: <FiFolder className="w-12 h-12 text-secondary-400" />,
      title: 'Nothing here yet',
      message: 'Get started by creating your first item.',
    },
  };

  const config = defaultConfigs[type] || defaultConfigs.default;
  const finalIcon = Icon ? <Icon className="w-12 h-12 text-primary-400" /> : config.icon;
  const finalTitle = title || config.title;
  const finalMessage = message || config.message;

  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary-50 mb-6">
        {finalIcon}
      </div>
      <h3 className="text-lg font-semibold text-secondary-900 mb-2">
        {finalTitle}
      </h3>
      <p className="text-secondary-600 max-w-md mx-auto mb-6">
        {finalMessage}
      </p>
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;