import React from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiDownload, FiExternalLink } from 'react-icons/fi';
import { formatCurrency, formatDate } from '../../utils/Format';
import { InvoiceStatusBadge } from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';
import api from '../../utils/api';

const RecentInvoices = ({ invoices = [], limit = 5 }) => {
  const displayedInvoices = invoices.slice(0, limit);

  const handleDownload = async (invoiceId, invoiceNumber) => {
    try {
      const response = await api.get(`/invoices/${invoiceId}/download`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (displayedInvoices.length === 0) {
    return (
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-secondary-900 mb-6">
          Recent Invoices
        </h2>
        <EmptyState type="invoices" />
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-secondary-900">
          Recent Invoices
        </h2>
        <Link
          to="/invoices"
          className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
        >
          <span>View All</span>
          <FiExternalLink className="w-4 h-4" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Client</th>
              <th>Date</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedInvoices.map((invoice) => (
              <tr key={invoice._id} className="invoice-item-row">
                <td className="font-medium text-secondary-900">
                  {invoice.invoiceNumber}
                </td>
                <td>
                  <div>
                    <div className="font-medium text-secondary-900">
                      {invoice.client.name}
                    </div>
                    <div className="text-sm text-secondary-500">
                      {invoice.client.email}
                    </div>
                  </div>
                </td>
                <td className="text-secondary-600">
                  {formatDate(invoice.issueDate)}
                </td>
                <td className="text-secondary-600">
                  {formatDate(invoice.dueDate)}
                </td>
                <td className="font-semibold">
                  {formatCurrency(invoice.totalAmount, invoice.currency)}
                </td>
                <td>
                  <InvoiceStatusBadge 
                    status={invoice.status} 
                    dueDate={invoice.dueDate} 
                  />
                </td>
                <td>
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/invoices/${invoice._id}`}
                      className="p-2 text-secondary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                      title="View Invoice"
                    >
                      <FiEye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDownload(invoice._id, invoice.invoiceNumber)}
                      className="p-2 text-secondary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Download PDF"
                    >
                      <FiDownload className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentInvoices;