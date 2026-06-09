import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from 'react-query';
import { 
  FiArrowLeft, 
  FiEdit, 
  FiDownload, 
  FiSend,
  FiCheckCircle,
  FiPrinter,
  FiCopy,
  FiMail,
  FiShare2
} from 'react-icons/fi';
import { formatCurrency, formatDate } from '../../../utils/Format';
import { InvoiceStatusBadge } from '../../../components/common/StatusBadge';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import api from '../../../utils/api';
import toast from 'react-hot-toast';

const ViewInvoicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery(
    ['invoice', id],
    () => api.get(`/invoices/${id}`),
    {
      enabled: !!id,
    }
  );

  const invoice = data?.data?.invoice;

  const handleDownload = async () => {
    try {
      const response = await api.get(`/invoices/${id}/download`, {
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

  const handleSend = async () => {
    try {
      await api.post(`/invoices/${id}/send`);
      toast.success('Invoice marked as sent');
      // Refresh data
      window.location.reload();
    } catch (error) {
      toast.error('Failed to send invoice');
    }
  };

  const handleMarkPaid = async () => {
    try {
      await api.post(`/invoices/${id}/mark-paid`);
      toast.success('Invoice marked as paid');
      // Refresh data
      window.location.reload();
    } catch (error) {
      toast.error('Failed to mark invoice as paid');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-secondary-900 mb-4">
          Invoice Not Found
        </h2>
        <p className="text-secondary-600 mb-6">
          The invoice you're looking for doesn't exist or you don't have access to it.
        </p>
        <Link to="/invoices" className="btn-primary">
          Back to Invoices
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Invoice {invoice.invoiceNumber} - Invoice Flow Pro</title>
      </Helmet>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/invoices')}
                className="p-2 text-secondary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <FiArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-secondary-900">
                  Invoice #{invoice.invoiceNumber}
                </h1>
                <div className="flex items-center space-x-4 mt-2">
                  <InvoiceStatusBadge status={invoice.status} dueDate={invoice.dueDate} />
                  <span className="text-secondary-600">
                    Created {formatDate(invoice.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
              >
                <FiPrinter className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
              >
                <FiDownload className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
              <Link
                to={`/invoices/${id}/edit`}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FiEdit className="w-4 h-4" />
                <span>Edit</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="card p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            {invoice.status === 'draft' && (
              <button
                onClick={handleSend}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiSend className="w-4 h-4" />
                <span>Mark as Sent</span>
              </button>
            )}
            
            {(invoice.status === 'sent' || invoice.status === 'overdue') && (
              <button
                onClick={handleMarkPaid}
                className="flex items-center space-x-2 px-6 py-3 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors"
              >
                <FiCheckCircle className="w-4 h-4" />
                <span>Mark as Paid</span>
              </button>
            )}

            <button className="flex items-center space-x-2 px-6 py-3 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors">
              <FiCopy className="w-4 h-4" />
              <span>Duplicate</span>
            </button>

            <button className="flex items-center space-x-2 px-6 py-3 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors">
              <FiMail className="w-4 h-4" />
              <span>Email to Client</span>
            </button>

            <button className="flex items-center space-x-2 px-6 py-3 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors">
              <FiShare2 className="w-4 h-4" />
              <span>Share Link</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Invoice Details */}
          <div className="lg:col-span-2">
            <div className="card p-8 mb-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h2 className="text-2xl font-bold text-secondary-900 mb-2">
                    INVOICE
                  </h2>
                  <div className="text-secondary-600">
                    <div>#{invoice.invoiceNumber}</div>
                    <div>Issued: {formatDate(invoice.issueDate)}</div>
                    <div>Due: {formatDate(invoice.dueDate)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <InvoiceStatusBadge status={invoice.status} dueDate={invoice.dueDate} />
                </div>
              </div>

              {/* From/To */}
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="font-semibold text-secondary-900 mb-4">Bill From</h3>
                  <div className="text-secondary-600">
                    <div className="font-medium">{invoice.user?.companyName || invoice.user?.name}</div>
                    <div>{invoice.user?.email}</div>
                    {invoice.user?.phone && <div>{invoice.user.phone}</div>}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900 mb-4">Bill To</h3>
                  <div className="text-secondary-600">
                    <div className="font-medium">{invoice.client.name}</div>
                    <div>{invoice.client.email}</div>
                    {invoice.client.company && <div>{invoice.client.company}</div>}
                    {invoice.client.phone && <div>{invoice.client.phone}</div>}
                    {invoice.client.taxId && <div>Tax ID: {invoice.client.taxId}</div>}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-12">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-secondary-900">Description</th>
                      <th className="text-right py-3 px-4 font-semibold text-secondary-900">Quantity</th>
                      <th className="text-right py-3 px-4 font-semibold text-secondary-900">Unit Price</th>
                      <th className="text-right py-3 px-4 font-semibold text-secondary-900">Tax</th>
                      <th className="text-right py-3 px-4 font-semibold text-secondary-900">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-4 px-4">
                          <div className="font-medium text-secondary-900">{item.description}</div>
                          {item.taxRate > 0 && (
                            <div className="text-sm text-secondary-500">
                              Tax: {item.taxRate}%
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right text-secondary-600">
                          {item.quantity}
                        </td>
                        <td className="py-4 px-4 text-right text-secondary-600">
                          {formatCurrency(item.unitPrice, invoice.currency)}
                        </td>
                        <td className="py-4 px-4 text-right text-secondary-600">
                          {item.taxRate > 0 ? `${item.taxRate}%` : '-'}
                        </td>
                        <td className="py-4 px-4 text-right font-semibold text-secondary-900">
                          {formatCurrency(item.quantity * item.unitPrice, invoice.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="ml-auto max-w-xs">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Subtotal</span>
                    <span className="font-medium">
                      {formatCurrency(invoice.subtotal, invoice.currency)}
                    </span>
                  </div>
                  
                  {invoice.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-secondary-600">
                        Discount {invoice.discountType === 'percentage' ? `(${invoice.discount}%)` : ''}
                      </span>
                      <span className="font-medium text-danger-600">
                        -{formatCurrency(
                          invoice.discountType === 'percentage'
                            ? invoice.subtotal * (invoice.discount / 100)
                            : invoice.discount,
                          invoice.currency
                        )}
                      </span>
                    </div>
                  )}
                  
                  {invoice.taxAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Tax</span>
                      <span className="font-medium">
                        {formatCurrency(invoice.taxAmount, invoice.currency)}
                      </span>
                    </div>
                  )}
                  
                  {invoice.shipping > 0 && (
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Shipping</span>
                      <span className="font-medium">
                        {formatCurrency(invoice.shipping, invoice.currency)}
                      </span>
                    </div>
                  )}
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-secondary-900">Total</span>
                      <span className="text-2xl font-bold text-primary-600">
                        {formatCurrency(invoice.totalAmount, invoice.currency)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes & Terms */}
              {(invoice.notes || invoice.terms) && (
                <div className="mt-12 pt-12 border-t border-gray-200">
                  <div className="grid md:grid-cols-2 gap-8">
                    {invoice.notes && (
                      <div>
                        <h4 className="font-semibold text-secondary-900 mb-3">Notes</h4>
                        <p className="text-secondary-600 whitespace-pre-line">
                          {invoice.notes}
                        </p>
                      </div>
                    )}
                    {invoice.terms && (
                      <div>
                        <h4 className="font-semibold text-secondary-900 mb-3">Terms</h4>
                        <p className="text-secondary-600 whitespace-pre-line">
                          {invoice.terms}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Payment Info */}
            <div className="card p-6">
              <h3 className="font-semibold text-secondary-900 mb-4">Payment Information</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-secondary-600">Payment Method</div>
                  <div className="font-medium capitalize">
                    {invoice.paymentMethod?.replace('_', ' ') || 'Bank Transfer'}
                  </div>
                </div>
                {invoice.paymentInfo && Object.entries(invoice.paymentInfo).map(([key, value]) => (
                  value && (
                    <div key={key}>
                      <div className="text-sm text-secondary-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </div>
                      <div className="font-medium">{value}</div>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="card p-6">
              <h3 className="font-semibold text-secondary-900 mb-6">Invoice Timeline</h3>
              <div className="space-y-6">
                {invoice.history?.map((event, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3"></div>
                    <div className="flex-1">
                      <div className="font-medium text-secondary-900 capitalize">
                        {event.action.replace('_', ' ')}
                      </div>
                      <div className="text-sm text-secondary-600">
                        {formatDate(event.timestamp, { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {event.changes && (
                        <div className="mt-2 text-sm text-secondary-500">
                          Details updated
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Details */}
            <div className="card p-6">
              <h3 className="font-semibold text-secondary-900 mb-4">Client Details</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-secondary-600">Email</div>
                  <div className="font-medium">{invoice.client.email}</div>
                </div>
                {invoice.client.phone && (
                  <div>
                    <div className="text-sm text-secondary-600">Phone</div>
                    <div className="font-medium">{invoice.client.phone}</div>
                  </div>
                )}
                {invoice.client.taxId && (
                  <div>
                    <div className="text-sm text-secondary-600">Tax ID</div>
                    <div className="font-medium">{invoice.client.taxId}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewInvoicePage;