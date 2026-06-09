import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/password/forgot', { email });
      setIsSubmitted(true);
      toast.success('Password reset link sent! Check your email.');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset link. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password - Invoice Flow Pro</title>
      </Helmet>

      <div className="text-center mb-8">
        <Link to="/login" className="inline-flex items-center text-secondary-600 hover:text-primary-700 mb-6">
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Link>
        
        <h2 className="text-3xl font-bold text-secondary-900">
          Forgot Password?
        </h2>
        <p className="text-secondary-600 mt-2">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      {isSubmitted ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-success-50 text-success-600 rounded-full mb-6">
            <FiCheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-secondary-900 mb-3">
            Check Your Email
          </h3>
          <p className="text-secondary-600 mb-6">
            We've sent a password reset link to <strong className="text-secondary-900">{email}</strong>
          </p>
          <div className="space-y-4">
            <p className="text-sm text-secondary-500">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail('');
                }}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                try again
              </button>
            </p>
            <Link
              to="/login"
              className="inline-block text-primary-600 hover:text-primary-700 font-medium"
            >
              Return to login
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder="you@example.com"
                disabled={isSubmitting}
                required
              />
            </div>
            <p className="mt-2 text-sm text-secondary-500">
              We'll send a password reset link to this email address.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full"
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </button>

          <div className="text-center">
            <p className="text-secondary-600">
              Remember your password?{' '}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      )}
    </>
  );
};

export default ForgotPasswordPage;