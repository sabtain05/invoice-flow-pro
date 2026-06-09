import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FiPlus, 
  FiSearch, 
  FiFilter,
  FiDownload,
  FiEye,
  FiEdit,
  FiTrash2,
  FiSend,
  FiCheckCircle,
  FiRefreshCw
} from 'react-icons/fi';
import { useQuery } from 'react-query';
import { formatCurrency, formatDate } from '../../../utils/Format';
import { InvoiceStatusBadge } from '../../../components/common/StatusBadge';
import EmptyState from '../../../components/common/EmptyState';
import Modal, { ConfirmModal } from '../../../components/common/Modal';
import api from '../../../utils/api';
import toast from 'react-hot-toast';

const InvoicesPage = () => {
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1,
    limit: 20,
  });
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false);

  const { data, isLoading, refetch } = useQuery(
    ['invoices', filters],
    () => api.get('/invoices', { params: filters }),
    {
      keepPreviousData: true,
    }
  );

  const invoices = data?.data?.invoices || [];
  const pagination = data?.data?.pagination || {};
  const summary = data?.data?.summary || {};

  const handleDelete = async () => {
    try {
      await api.delete(`/invoices/${selectedInvoice._id}`);
      toast.success('Invoice deleted successfully');
      refetch();
      setShowDeleteModal(false);
      setSelectedInvoice(null);
    } catch (error) {
      toast.error('Failed to delete invoice');
    }
  };

  const handleSend = async () => {
    try {
      await api.post(`/invoices/${selectedInvoice._id}/send`);
      toast.success('Invoice marked as sent');
      refetch();
      setShowSendModal(false);
      setSelectedInvoice(null);
    } catch (error) {
      toast.error('Failed to send invoice');
    }
  };

  const handleMarkPaid = async () => {
    try {
      await api.post(`/invoices/${selectedInvoice._id}/mark-paid`);
      toast.success('Invoice marked as paid');
      refetch();
      setShowMarkPaidModal(false);
      setSelectedInvoice(null);
    } catch (error) {
      toast.error('Failed to mark invoice as paid');
    }
  };

  const handleDownload = async (invoice) => {
    try {
      const response = await api.get(`/invoices/${invoice._id}/download`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoice.invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      toast.error('Failed to download invoice');
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Invoices' },
    { value: 'draft', label: 'Drafts' },
    { value: 'sent', label: 'Sent' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
  ];

  const actionButtons = [
    {
      label: 'Send',
      icon: <FiSend className="w-4 h-4" />,
      onClick: (invoice) => {
        setSelectedInvoice(invoice);
        setShowSendModal(true);
      },
      show: (invoice) => invoice.status === 'draft',
      variant: 'primary'
    },
    {
      label: 'Mark Paid',
      icon: <FiCheckCircle className="w-4 h-4" />,
      onClick: (invoice) => {
        setSelectedInvoice(invoice);
        setShowMarkPaidModal(true);
      },
      show: (invoice) => invoice.status === 'sent' || invoice.status === 'overdue',
      variant: 'success'
    },
    {
      label: 'Download',
      icon: <FiDownload className="w-4 h-4" />,
      onClick: handleDownload,
      show: () => true,
      variant: 'secondary'
    },
  ];

  return (
    <>
      <Helmet>
        <title>Invoices - Invoice Flow Pro</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900">Invoices</h1>
              <p className="text-secondary-600 mt-2">
                Manage and track all your invoices in one place
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/invoices/create"
                className="btn-primary flex items-center space-x-2"
              >
                <FiPlus className="w-4 h-4" />
                <span>New Invoice</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(summary).map(([status, data]) => (
            <div key={status} className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600 capitalize">{status}</p>
                  <p className="text-2xl font-bold text-secondary-900">{data.count}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-secondary-900">
                    {formatCurrency(data.totalAmount || 0)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 md:flex-none md:w-64">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                <input
                  type="search"
                  placeholder="Search invoices..."
                  className="input-field pl-10"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                />
              </div>

              <select
                className="select-field"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => refetch()}
                className="p-2 text-secondary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                title="Refresh"
              >
                <FiRefreshCw className="w-5 h-5" />
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors">
                <FiFilter className="w-4 h-4" />
                <span>More Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="card overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="inline-block spinner w-8 h-8 border-4 border-primary-100 border-t-primary-600"></div>
              <p className="mt-4 text-secondary-600">Loading invoices...</p>
            </div>
          ) : invoices.length === 0 ? (
            <EmptyState 
              type={filters.search ? 'search' : 'invoices'}
              action={
                <Link to="/invoices/create" className="btn-primary">
                  Create Your First Invoice
                </Link>
              }
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Invoice #</th>
                      <th>Client</th>
                      <th>Issue Date</th>
                      <th>Due Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
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
                            {/* View */}
                            <Link
                              to={`/invoices/${invoice._id}`}
                              className="p-2 text-secondary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                              title="View"
                            >
                              <FiEye className="w-4 h-4" />
                            </Link>

                            {/* Edit */}
                            <Link
                              to={`/invoices/${invoice._id}/edit`}
                              className="p-2 text-secondary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <FiEdit className="w-4 h-4" />
                            </Link>

                            {/* Action Buttons */}
                            {actionButtons.map((action, idx) => 
                              action.show(invoice) && (
                                <button
                                  key={idx}
                                  onClick={() => action.onClick(invoice)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    action.variant === 'primary'
                                      ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                                      : action.variant === 'success'
                                      ? 'text-success-600 hover:text-success-700 hover:bg-success-50'
                                      : 'text-secondary-600 hover:text-primary-700 hover:bg-primary-50'
                                  }`}
                                  title={action.label}
                                >
                                  {action.icon}
                                </button>
                              )
                            )}

                            {/* Delete */}
                            <button
                              onClick={() => {
                                setSelectedInvoice(invoice);
                                setShowDeleteModal(true);
                              }}
                              className="p-2 text-danger-600 hover:text-danger-700 hover:bg-danger-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-secondary-600">
                      Showing <span className="font-medium">{((filters.page - 1) * filters.limit) + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(filters.page * filters.limit, pagination.total)}
                      </span>{' '}
                      of <span className="font-medium">{pagination.total}</span> invoices
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                        disabled={filters.page === 1}
                        className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                        disabled={filters.page === pagination.pages}
                        className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedInvoice(null);
        }}
        onConfirm={handleDelete}
        title="Delete Invoice"
        message={`Are you sure you want to delete invoice ${selectedInvoice?.invoiceNumber}? This action cannot be undone.`}
        confirmText="Delete Invoice"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Send Invoice Modal */}
      <ConfirmModal
        isOpen={showSendModal}
        onClose={() => {
          setShowSendModal(false);
          setSelectedInvoice(null);
        }}
        onConfirm={handleSend}
        title="Send Invoice"
        message={`Mark invoice ${selectedInvoice?.invoiceNumber} as sent to ${selectedInvoice?.client.email}?`}
        confirmText="Mark as Sent"
        cancelText="Cancel"
        variant="primary"
      />

      {/* Mark Paid Modal */}
      <ConfirmModal
        isOpen={showMarkPaidModal}
        onClose={() => {
          setShowMarkPaidModal(false);
          setSelectedInvoice(null);
        }}
        onConfirm={handleMarkPaid}
        title="Mark as Paid"
        message={`Mark invoice ${selectedInvoice?.invoiceNumber} as paid? This will update the invoice status to paid.`}
        confirmText="Mark as Paid"
        cancelText="Cancel"
        variant="success"
      />
    </>
  );
};

export default InvoicesPage;