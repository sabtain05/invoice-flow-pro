import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Helmet } from 'react-helmet-async';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { loginSchema } from '../../utils/Validation';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      // Error is handled by AuthContext
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Invoice Flow Pro</title>
      </Helmet>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-secondary-900">
          Welcome Back
        </h2>
        <p className="text-secondary-600 mt-2">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="label">Email Address</label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
            <input
              type="email"
              {...register('email')}
              className="input-field pl-10"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-danger-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="label">Password</label>
            <Link
              to="/forgot-password"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className="input-field pl-10 pr-10"
              placeholder="Your password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
            >
              {showPassword ? (
                <FiEyeOff className="w-5 h-5" />
              ) : (
                <FiEye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-danger-600">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="text-center">
          <p className="text-secondary-600">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign up now
            </Link>
          </p>
        </div>
      </form>

      {/* Demo Account Info */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="bg-primary-50 rounded-xl p-4">
          <h4 className="font-medium text-primary-900 mb-2">
            Demo Account
          </h4>
          <p className="text-sm text-primary-700">
            Email: demo@invoiceflowpro.com<br />
            Password: Demo@123
          </p>
          <p className="text-xs text-primary-600 mt-2">
            Use this account to test all features
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;