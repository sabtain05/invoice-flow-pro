import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { 
  FiUser, 
  FiMail, 
  FiBriefcase, 
  FiPhone, 
  FiMapPin,
  FiSave,
  FiLock,
  FiUpload
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { profileSchema, passwordSchema } from '../../utils/Validation';

const ProfilePage = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const profileForm = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      companyName: user?.companyName || '',
      phone: user?.phone || '',
      businessNumber: user?.businessNumber || '',
      taxRate: user?.taxRate || 0,
    }
  });

  const passwordForm = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const onProfileSubmit = async (data) => {
    setProfileLoading(true);
    try {
      await updateProfile(data);
    } finally {
      setProfileLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setPasswordLoading(true);
    try {
      await updatePassword(data);
      passwordForm.reset();
    } finally {
      setPasswordLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FiUser className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <FiLock className="w-4 h-4" /> },
    { id: 'preferences', label: 'Preferences', icon: <FiBriefcase className="w-4 h-4" /> },
  ];

  return (
    <>
      <Helmet>
        <title>Profile - Invoice Flow Pro</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Profile Settings</h1>
          <p className="text-secondary-600 mt-2">
            Manage your account information and preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 border-b-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-700'
                  : 'border-transparent text-secondary-600 hover:text-secondary-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="card p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-semibold text-secondary-900">Personal Information</h2>
                <p className="text-secondary-600">Update your personal details</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <button className="flex items-center space-x-2 px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors">
                    <FiUpload className="w-4 h-4" />
                    <span>Upload Photo</span>
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Full Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                    <input
                      type="text"
                      {...profileForm.register('name')}
                      className="input-field pl-10"
                      placeholder="Your full name"
                    />
                  </div>
                  {profileForm.formState.errors.name && (
                    <p className="mt-1 text-sm text-danger-600">
                      {profileForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                    <input
                      type="email"
                      {...profileForm.register('email')}
                      className="input-field pl-10"
                      placeholder="you@example.com"
                    />
                  </div>
                  {profileForm.formState.errors.email && (
                    <p className="mt-1 text-sm text-danger-600">
                      {profileForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Company Name</label>
                  <div className="relative">
                    <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                    <input
                      type="text"
                      {...profileForm.register('companyName')}
                      className="input-field pl-10"
                      placeholder="Your company"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Phone Number</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                    <input
                      type="tel"
                      {...profileForm.register('phone')}
                      className="input-field pl-10"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Business Number</label>
                  <input
                    type="text"
                    {...profileForm.register('businessNumber')}
                    className="input-field"
                    placeholder="Tax ID or business number"
                  />
                </div>

                <div>
                  <label className="label">Default Tax Rate (%)</label>
                  <input
                    type="number"
                    {...profileForm.register('taxRate')}
                    className="input-field"
                    placeholder="0"
                    step="0.01"
                    min="0"
                    max="100"
                  />
                  {profileForm.formState.errors.taxRate && (
                    <p className="mt-1 text-sm text-danger-600">
                      {profileForm.formState.errors.taxRate.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="btn-primary flex items-center space-x-2"
                >
                  <FiSave className="w-4 h-4" />
                  <span>{profileLoading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="card p-8">
            <h2 className="text-xl font-semibold text-secondary-900 mb-2">Security Settings</h2>
            <p className="text-secondary-600 mb-8">Update your password and security preferences</p>

            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
              <div>
                <label className="label">Current Password</label>
                <input
                  type="password"
                  {...passwordForm.register('currentPassword')}
                  className="input-field"
                  placeholder="Enter current password"
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="mt-1 text-sm text-danger-600">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="label">New Password</label>
                  <input
                    type="password"
                    {...passwordForm.register('newPassword')}
                    className="input-field"
                    placeholder="Enter new password"
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="mt-1 text-sm text-danger-600">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Confirm New Password</label>
                  <input
                    type="password"
                    {...passwordForm.register('confirmPassword')}
                    className="input-field"
                    placeholder="Confirm new password"
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="mt-1 text-sm text-danger-600">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="btn-primary flex items-center space-x-2"
                >
                  <FiSave className="w-4 h-4" />
                  <span>{passwordLoading ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="card p-8">
            <h2 className="text-xl font-semibold text-secondary-900 mb-2">Preferences</h2>
            <p className="text-secondary-600 mb-8">Customize your Invoice Flow Pro experience</p>

            <div className="space-y-6">
              <div>
                <label className="label">Default Currency</label>
                <select className="select-field">
                  <option value="USD" selected>USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="PKR">PKR - Pakistani Rupee</option>
                </select>
              </div>

              <div>
                <label className="label">Default Payment Terms (days)</label>
                <select className="select-field">
                  <option value="7" selected>7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                </select>
              </div>

              <div>
                <label className="label">Invoice Number Prefix</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="INV-"
                  defaultValue="INV-"
                />
              </div>

              <div>
                <label className="label">Default Invoice Notes</label>
                <textarea
                  className="input-field"
                  rows="3"
                  placeholder="Payment terms and other default notes..."
                />
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button className="btn-primary flex items-center space-x-2">
                  <FiSave className="w-4 h-4" />
                  <span>Save Preferences</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePage;