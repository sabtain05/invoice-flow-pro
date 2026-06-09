import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiClock,
  FiSend,
  FiCheckCircle
} from 'react-icons/fi';
import api from '../utils/api';
import { contactSchema } from '../utils/Validation';

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await api.post('/contact', data);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setIsSubmitted(true);
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <FiMail className="w-6 h-6" />,
      title: 'Email',
      details: ['sabtainalipk144@gmail.com'],
      description: 'We respond within 24 hours'
    },
    {
      icon: <FiPhone className="w-6 h-6" />,
      title: 'Phone',
      details: ['+92 319 4157700'],
      description: 'Mon-Fri, 9am-6pm PST'
    },
    {
      icon: <FiMapPin className="w-6 h-6" />,
      title: 'Office',
      details: ['Blue Area, Islamabad, Pakistan'],
      description: 'Visit our headquarters'
    },
    {
      icon: <FiClock className="w-6 h-6" />,
      title: 'Support Hours',
      details: ['Monday - Friday: 9am - 6pm PST', 'Saturday: 10am - 2pm PST'],
      description: '24/7 emergency support available'
    },
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us - Invoice Flow Pro</title>
        <meta name="description" content="Get in touch with the Invoice Flow Pro team. We're here to help with any questions or support needs." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-secondary-900 mb-6">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Have questions? We're here to help. Contact our team for support, sales, or partnership inquiries.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div>
            <div className="card p-8 mb-8">
              <h2 className="text-2xl font-bold text-secondary-900 mb-8">
                Contact Information
              </h2>
              
              <div className="space-y-8">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="p-3 bg-primary-50 text-primary-700 rounded-xl">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-900 mb-1">
                        {info.title}
                      </h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-secondary-600">
                          {detail}
                        </p>
                      ))}
                      <p className="text-sm text-secondary-500 mt-2">
                        {info.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Preview */}
            <div className="card p-8">
              <h3 className="text-xl font-semibold text-secondary-900 mb-6">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-secondary-900 mb-1">
                    How quickly do you respond?
                  </h4>
                  <p className="text-sm text-secondary-600">
                    We typically respond within 24 hours during business days.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-secondary-900 mb-1">
                    Do you offer phone support?
                  </h4>
                  <p className="text-sm text-secondary-600">
                    Yes, phone support is available during business hours.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-secondary-900 mb-1">
                    Can I schedule a demo?
                  </h4>
                  <p className="text-sm text-secondary-600">
                    Absolutely! Contact our sales team to schedule a personalized demo.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-success-50 text-success-600 rounded-full mb-6">
                    <FiCheckCircle className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-bold text-secondary-900 mb-4">
                    Message Sent Successfully!
                  </h2>
                  <p className="text-secondary-600 mb-8 max-w-md mx-auto">
                    Thank you for contacting us. We've received your message and will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="btn-primary"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-secondary-900 mb-8">
                    Send us a Message
                  </h2>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="label">Full Name *</label>
                        <input
                          type="text"
                          {...register('name')}
                          className="input-field"
                          placeholder="Your name"
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-danger-600">{errors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="label">Email Address *</label>
                        <input
                          type="email"
                          {...register('email')}
                          className="input-field"
                          placeholder="you@example.com"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-danger-600">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="label">Company (Optional)</label>
                        <input
                          type="text"
                          {...register('company')}
                          className="input-field"
                          placeholder="Your company"
                        />
                      </div>

                      <div>
                        <label className="label">Phone (Optional)</label>
                        <input
                          type="tel"
                          {...register('phone')}
                          className="input-field"
                          placeholder="Your phone number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label">Subject *</label>
                      <input
                        type="text"
                        {...register('subject')}
                        className="input-field"
                        placeholder="What is this regarding?"
                      />
                      {errors.subject && (
                        <p className="mt-1 text-sm text-danger-600">{errors.subject.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="label">Message *</label>
                      <textarea
                        {...register('message')}
                        rows={6}
                        className="input-field resize-none"
                        placeholder="How can we help you?"
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-danger-600">{errors.message.message}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <p className="text-sm text-secondary-500">
                        Fields marked with * are required
                      </p>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary flex items-center space-x-2"
                      >
                        <FiSend className="w-4 h-4" />
                        <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;