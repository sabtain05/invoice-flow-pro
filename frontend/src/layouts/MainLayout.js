import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { FiHome, FiInfo, FiMail, FiFileText, FiShield, FiLogIn, FiUserPlus } from 'react-icons/fi';
import { FaCcVisa, FaCcMastercard, FaPaypal, FaStripe, FaCreditCard } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const MainLayout = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: <FiHome className="w-4 h-4" /> },
    { path: '/about', label: 'About', icon: <FiInfo className="w-4 h-4" /> },
    { path: '/contact', label: 'Contact', icon: <FiMail className="w-4 h-4" /> },
  ];

  const footerLinks = [
    { path: '/terms', label: 'Terms of Service', icon: <FiFileText className="w-4 h-4" /> },
    { path: '/privacy', label: 'Privacy Policy', icon: <FiShield className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">IF</span>
                </div>
                <span className="text-xl font-bold text-secondary-900">
                  Invoice<span className="gradient-text">Flow</span> Pro
                </span>
              </Link>
            </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-secondary-600 hover:text-primary-700 hover:bg-primary-50'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

           {/* Auth Buttons */}
<div className="flex items-center space-x-4">
  {isAuthenticated ? (
    <>
      <Link
        to="/dashboard"
        className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium hover:bg-primary-100 transition-colors"
      >
        Dashboard
      </Link>
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <span className="text-sm text-secondary-700 hidden md:block">
          {user?.name?.split(' ')[0] || 'User'}
        </span>
      </div>
    </>
  ) : (
    <>
      <Link
        to="/login"
        className="flex items-center space-x-2 px-4 py-2 text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
      >
        <FiLogIn className="w-4 h-4" />
        <span className="font-medium">Login</span>
      </Link>
      <Link
        to="/signup"
        className="btn-primary flex items-center space-x-2"
      >
        <FiUserPlus className="w-4 h-4" />
        <span>Sign Up</span>
      </Link>
    </>
  )}
</div>

          {/* Mobile Navigation */}
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex justify-around">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-secondary-600 hover:text-primary-700'
                  }`}
                >
                  {item.icon}
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">IF</span>
                </div>
                <span className="text-2xl font-bold">
                  Invoice<span className="text-primary-400">Flow</span> Pro
                </span>
              </div>
              <p className="text-secondary-300 mb-6 max-w-md">
                Streamline your invoicing process with our professional invoice management software. 
                Create, send, and track invoices effortlessly.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-secondary-300 hover:text-white transition-colors flex items-center space-x-2"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-3">
                {footerLinks.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-secondary-300 hover:text-white transition-colors flex items-center space-x-2"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">We Accept</h4>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center space-x-2">
                <FaCcVisa className="text-blue-600 text-xl" />
              </div>
              <div className="flex items-center space-x-2">
                <FaCcMastercard className="text-red-500 text-xl" />
              </div>
              <div className="flex items-center space-x-2">
                <FaPaypal className="text-blue-400 text-xl" />
              </div>
              <div className="flex items-center space-x-2">
                <FaStripe className="text-purple-600 text-xl" />
              </div>
              <div className="flex items-center space-x-2">
                <FaCreditCard className="text-blue-700 text-xl" />
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-secondary-800 mt-8 pt-8 text-center text-secondary-400">
            <p>&copy; {new Date().getFullYear()} Invoice Flow Pro. All rights reserved. | A Sabtain Ali production.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;