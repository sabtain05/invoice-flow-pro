import React from 'react';

const StatusBadge = ({ status, showIcon = false }) => {
  const statusConfig = {
    draft: {
      label: 'Draft',
      className: 'bg-secondary-100 text-secondary-800',
      icon: '📝',
    },
    sent: {
      label: 'Sent',
      className: 'bg-blue-100 text-blue-800',
      icon: '📤',
    },
    paid: {
      label: 'Paid',
      className: 'bg-success-100 text-success-800',
      icon: '✅',
    },
    overdue: {
      label: 'Overdue',
      className: 'bg-danger-100 text-danger-800',
      icon: '⏰',
    },
    canceled: {
      label: 'Canceled',
      className: 'bg-secondary-100 text-secondary-800',
      icon: '❌',
    },
  };

  const config = statusConfig[status] || {
    label: status || 'Unknown',
    className: 'bg-gray-100 text-gray-800',
    icon: '❓',
  };

  return (
    <span className={`status-badge ${config.className} inline-flex items-center gap-1`}>
      {showIcon && <span>{config.icon}</span>}
      {config.label}
    </span>
  );
};

export const InvoiceStatusBadge = ({ status, dueDate }) => {
  const now = new Date();
  const due = new Date(dueDate);
  let actualStatus = status;

  // Auto-calculate overdue status
  if (status !== 'paid' && status !== 'canceled' && due < now) {
    actualStatus = 'overdue';
  }

  return <StatusBadge status={actualStatus} showIcon />;
};

export default StatusBadge;