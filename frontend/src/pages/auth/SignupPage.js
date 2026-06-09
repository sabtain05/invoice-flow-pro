import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Helmet } from 'react-helmet-async';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiBriefcase } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { signupSchema } from '../../utils/Validation';

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    setSubmitError('');
    
    try {
      const result = await signup(data);
      
      if (result.success) {
        // Navigation is handled in AuthContext
        console.log('Signup successful, redirecting...');
      } else {
        setSubmitError(result.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setSubmitError('An unexpected error occurred. Please try again.');
    }
  };

  // If already authenticated, redirect to dashboard
  if (useAuth().isAuthenticated) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Sign Up - Invoice Flow Pro</title>
      </Helmet>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-secondary-900">
          Create Your Account
        </h2>
        <p className="text-secondary-600 mt-2">
          Start streamlining your invoicing process today
        </p>
      </div>

      {submitError && (
        <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg">
          <p className="text-danger-700 text-sm">{submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="label">Full Name *</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
              <input
                type="text"
                {...register('name')}
                className={`input-field pl-10 ${errors.name ? 'border-danger-500' : ''}`}
                placeholder="John Doe"
                disabled={loading}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-danger-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="label">Company Name (Optional)</label>
            <div className="relative">
              <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
              <input
                type="text"
                {...register('companyName')}
                className="input-field pl-10"
                placeholder="Your Company"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="label">Email Address *</label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
            <input
              type="email"
              {...register('email')}
              className={`input-field pl-10 ${errors.email ? 'border-danger-500' : ''}`}
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-danger-600">{errors.email.message}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="label">Password *</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className={`input-field pl-10 pr-10 ${errors.password ? 'border-danger-500' : ''}`}
                placeholder="Create a password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
              >
                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-danger-600">{errors.password.message}</p>
            )}
            <p className="mt-1 text-xs text-secondary-500">
              Minimum 8 characters with uppercase, lowercase, and number
            </p>
          </div>

          <div>
            <label className="label">Confirm Password *</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                className={`input-field pl-10 pr-10 ${errors.confirmPassword ? 'border-danger-500' : ''}`}
                placeholder="Confirm your password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
              >
                {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-danger-600">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="terms"
            required
            className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="terms" className="text-sm text-secondary-600">
            I agree to the{' '}
            <Link to="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
              Privacy Policy
            </Link>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full relative"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </span>
          ) : (
            'Create Account'
          )}
        </button>

        <div className="text-center">
          <p className="text-secondary-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </form>

      {/* Benefits */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h4 className="font-medium text-secondary-900 mb-4 text-center">
          Start your 07-day free trial. No credit card required.
        </h4>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary-600">07</div>
            <div className="text-xs text-secondary-600">Days Free</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary-600">✓</div>
            <div className="text-xs text-secondary-600">All Features</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary-600">∞</div>
            <div className="text-xs text-secondary-600">Unlimited Invoices</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary-600">24/7</div>
            <div className="text-xs text-secondary-600">Support</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;