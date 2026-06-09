import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { 
  FiPlus, 
  FiTrash2, 
  FiCalendar, 
  FiUser, 
  FiMail,
  FiDollarSign,
  FiPercent,
  FiTruck,
  FiSave,
  FiX
} from 'react-icons/fi';
import api from '../../../utils/api';
import { useAuth } from '../../../contexts/AuthContext';
import { invoiceSchema } from '../../../utils/Validation';
import { formatCurrency } from '../../../utils/Format';

const CreateInvoicePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, watch, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(invoiceSchema),
    defaultValues: {
      client: {
        name: '',
        email: '',
        company: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        phone: '',
        taxId: ''
      },
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [
        {
          description: '',
          quantity: 1,
          unitPrice: 0,
          taxRate: user?.taxRate || 0
        }
      ],
      discount: 0,
      discountType: 'fixed',
      shipping: 0,
      notes: '',
      terms: user?.settings?.defaultNotes || 'Payment due within 30 days',
      paymentMethod: 'bank_transfer',
      paymentInfo: {
        bankName: '',
        accountNumber: '',
        routingNumber: '',
        paypalEmail: '',
        otherDetails: ''
      }
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const items = watch('items');
  const discount = watch('discount');
  const discountType = watch('discountType');
  const shipping = watch('shipping');

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);

    const taxAmount = items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unitPrice;
      return sum + (itemTotal * (item.taxRate || 0) / 100);
    }, 0);

    let discountAmount = 0;
    if (discount > 0) {
      discountAmount = discountType === 'percentage' 
        ? subtotal * (discount / 100)
        : discount;
    }

    const total = subtotal + taxAmount + shipping - discountAmount;

    return {
      subtotal: subtotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      shipping: shipping.toFixed(2),
      total: Math.max(total, 0).toFixed(2)
    };
  };

  const totals = calculateTotals();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Format the data to ensure numbers are properly parsed
      const formattedData = {
        ...data,
        items: data.items.map(item => ({
          ...item,
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
          taxRate: parseFloat(item.taxRate) || 0
        })),
        discount: parseFloat(data.discount) || 0,
        shipping: parseFloat(data.shipping) || 0,
      };
  
      console.log('Submitting invoice data:', formattedData); // For debugging
      
      const response = await api.post('/invoices', formattedData);
      toast.success('Invoice created successfully!');
      navigate(`/invoices/${response.data.invoice._id}`);
    } catch (error) {
      console.error('Invoice creation error:', error);
      const message = error.response?.data?.message || 'Failed to create invoice';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Create New Invoice - Invoice Flow Pro</title>
      </Helmet>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Create New Invoice</h1>
          <p className="text-secondary-600">Fill in the details below to create a professional invoice</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Client & Invoice Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Client Information */}
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FiUser className="w-5 h-5 text-primary-600" />
                  <h2 className="text-xl font-semibold text-secondary-900">Client Information</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Client Name *</label>
                    <Controller
                      name="client.name"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="input-field"
                          placeholder="Enter client name"
                        />
                      )}
                    />
                    {errors.client?.name && (
                      <p className="mt-1 text-sm text-danger-600">{errors.client.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="label">Client Email *</label>
                    <Controller
                      name="client.email"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="email"
                          className="input-field"
                          placeholder="client@example.com"
                        />
                      )}
                    />
                    {errors.client?.email && (
                      <p className="mt-1 text-sm text-danger-600">{errors.client.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="label">Company</label>
                    <Controller
                      name="client.company"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="input-field"
                          placeholder="Client company (optional)"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <label className="label">Phone</label>
                    <Controller
                      name="client.phone"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="tel"
                          className="input-field"
                          placeholder="Phone number (optional)"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Invoice Items */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <FiDollarSign className="w-5 h-5 text-primary-600" />
                    <h2 className="text-xl font-semibold text-secondary-900">Invoice Items</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => append({ description: '', quantity: 1, unitPrice: 0, taxRate: user?.taxRate || 0 })}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
                  >
                    <FiPlus className="w-4 h-4" />
                    Add Item
                  </button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid md:grid-cols-12 gap-4 items-start p-4 bg-secondary-50 rounded-lg">
                      <div className="md:col-span-5">
                        <label className="label">Description *</label>
                        <Controller
                          name={`items.${index}.description`}
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="text"
                              className="input-field"
                              placeholder="Item or service description"
                            />
                          )}
                        />
                        {errors.items?.[index]?.description && (
                          <p className="mt-1 text-sm text-danger-600">{errors.items[index].description.message}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="label">Quantity *</label>
                        <Controller
                          name={`items.${index}.quantity`}
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="number"
                              step="0.01"
                              min="0.01"
                              className="input-field"
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          )}
                        />
                        {errors.items?.[index]?.quantity && (
                          <p className="mt-1 text-sm text-danger-600">{errors.items[index].quantity.message}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="label">Unit Price *</label>
                        <Controller
                          name={`items.${index}.unitPrice`}
                          control={control}
                          render={({ field }) => (
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500">
                                {user?.currency || 'USD'}
                              </span>
                              <input
                                {...field}
                                type="number"
                                step="0.01"
                                min="0"
                                className="input-field pl-12"
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </div>
                          )}
                        />
                        {errors.items?.[index]?.unitPrice && (
                          <p className="mt-1 text-sm text-danger-600">{errors.items[index].unitPrice.message}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="label">Tax Rate (%)</label>
                        <Controller
                          name={`items.${index}.taxRate`}
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="number"
                              step="0.01"
                              min="0"
                              max="100"
                              className="input-field"
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          )}
                        />
                      </div>

                      <div className="md:col-span-1 flex items-end">
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                          disabled={fields.length === 1}
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {errors.items && (
                  <p className="mt-4 text-sm text-danger-600">{errors.items.message}</p>
                )}
              </div>
            </div>

            {/* Right Column - Summary & Actions */}
            <div className="space-y-8">
              {/* Invoice Details */}
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FiCalendar className="w-5 h-5 text-primary-600" />
                  <h2 className="text-xl font-semibold text-secondary-900">Invoice Details</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="label">Issue Date</label>
                    <Controller
                      name="issueDate"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="date"
                          className="input-field"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <label className="label">Due Date *</label>
                    <Controller
                      name="dueDate"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="date"
                          className="input-field"
                        />
                      )}
                    />
                    {errors.dueDate && (
                      <p className="mt-1 text-sm text-danger-600">{errors.dueDate.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Totals */}
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-secondary-900 mb-6">Invoice Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Subtotal</span>
                    <span className="font-semibold">
                      {formatCurrency(totals.subtotal, user?.currency || 'USD')}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-secondary-600">Discount</span>
                      <div className="flex items-center gap-2">
                        <Controller
                          name="discount"
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="number"
                              step="0.01"
                              min="0"
                              className="w-24 input-field text-right"
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          )}
                        />
                        <Controller
                          name="discountType"
                          control={control}
                          render={({ field }) => (
                            <select
                              {...field}
                              className="input-field w-32"
                            >
                              <option value="fixed">Fixed Amount</option>
                              <option value="percentage">Percentage</option>
                            </select>
                          )}
                        />
                      </div>
                    </div>
                    <div className="text-right text-sm text-secondary-500">
                      -{formatCurrency(totals.discountAmount, user?.currency || 'USD')}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-secondary-600">Tax</span>
                      <span className="font-semibold">
                        {formatCurrency(totals.taxAmount, user?.currency || 'USD')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-secondary-600">Shipping</span>
                    <div className="flex items-center gap-2">
                      <FiTruck className="w-4 h-4 text-secondary-400" />
                      <Controller
                        name="shipping"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="number"
                            step="0.01"
                            min="0"
                            className="w-32 input-field text-right"
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold text-primary-600">
                        {formatCurrency(totals.total, user?.currency || 'USD')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="card p-6">
                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <FiSave className="w-4 h-4" />
                    {isSubmitting ? 'Creating Invoice...' : 'Create Invoice'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => navigate('/invoices')}
                    className="btn-outline w-full flex items-center justify-center gap-2"
                  >
                    <FiX className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateInvoicePage;