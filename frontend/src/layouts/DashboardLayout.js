import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiFileText, 
  FiUsers, 
  FiBarChart2, 
  FiSettings, 
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronDown,
  FiPlus,
  FiBell,
  FiSearch
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { getInitials, getRandomColor } from '../utils/Format';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FiHome className="w-5 h-5" /> },
    { path: '/invoices', label: 'Invoices', icon: <FiFileText className="w-5 h-5" /> },
    { path: '/profile', label: 'Profile', icon: <FiUser className="w-5 h-5" /> },
    { path: '/settings', label: 'Settings', icon: <FiSettings className="w-5 h-5" /> },
  ];

  const handleLogout = async () => {
    await logout();
  };

  const userInitials = getInitials(user?.name);
  const userColor = getRandomColor();

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-auto lg:z-auto
      `}>
        {/* Logo */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-center">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">IF</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-secondary-900">
                Invoice<span className="gradient-text">Flow</span>
              </h1>
              <p className="text-xs text-secondary-500">Dashboard</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors
                ${location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-secondary-600 hover:bg-gray-50 hover:text-secondary-900'
                }
              `}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              navigate('/invoices/create');
              setSidebarOpen(false);
            }}
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            <FiPlus className="w-5 h-5" />
            <span>New Invoice</span>
          </button>
        </div>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: userColor }}
            >
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-secondary-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-secondary-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left: Mobile Menu Button */}
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg text-secondary-600 hover:bg-gray-100"
                >
                  <FiMenu className="w-6 h-6" />
                </button>

                {/* Search */}
                <div className="hidden md:block ml-4">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                    <input
                      type="search"
                      placeholder="Search invoices, clients..."
                      className="pl-10 pr-4 py-2 w-64 lg:w-80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Right: User Menu */}
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="p-2 rounded-lg text-secondary-600 hover:bg-gray-100 relative">
                  <FiBell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
                </button>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: userColor }}
                    >
                      {userInitials}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-secondary-900">
                        {user?.name}
                      </p>
                      <p className="text-xs text-secondary-500">
                        {user?.subscription?.plan?.charAt(0).toUpperCase() + user?.subscription?.plan?.slice(1)} Plan
                      </p>
                    </div>
                    <FiChevronDown className="w-4 h-4 text-secondary-500" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-30"
                        onClick={() => setUserDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-dropdown border border-gray-200 z-40">
                        <div className="p-4 border-b border-gray-200">
                          <p className="text-sm font-medium text-secondary-900">
                            {user?.name}
                          </p>
                          <p className="text-xs text-secondary-500 truncate">
                            {user?.email}
                          </p>
                        </div>
                        <div className="p-2">
                          <Link
                            to="/profile"
                            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-secondary-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <FiUser className="w-4 h-4" />
                            <span>Profile</span>
                          </Link>
                          <Link
                            to="/settings"
                            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-secondary-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <FiSettings className="w-4 h-4" />
                            <span>Settings</span>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-danger-600 hover:bg-danger-50 transition-colors"
                          >
                            <FiLogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;