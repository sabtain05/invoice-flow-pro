import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  FiSettings, 
  FiBell, 
  FiUsers, 
  FiCreditCard,
  FiShield,
  FiGlobe,
  FiSave,
  FiUpload,
  FiCheck
} from 'react-icons/fi';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'general', label: 'General', icon: <FiSettings className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <FiBell className="w-4 h-4" /> },
    { id: 'team', label: 'Team', icon: <FiUsers className="w-4 h-4" /> },
    { id: 'billing', label: 'Billing', icon: <FiCreditCard className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <FiShield className="w-4 h-4" /> },
    { id: 'integrations', label: 'Integrations', icon: <FiGlobe className="w-4 h-4" /> },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <>
      <Helmet>
        <title>Settings - Invoice Flow Pro</title>
      </Helmet>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Settings</h1>
          <p className="text-secondary-600 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-secondary-600 hover:bg-gray-50 hover:text-secondary-900'
                    }`}
                  >
                    {tab.icon}
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="card p-8">
                <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                  General Settings
                </h2>

                <div className="space-y-8">
                  {/* Company Logo */}
                  <div>
                    <label className="label">Company Logo</label>
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-gradient-primary rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                        IF
                      </div>
                      <div>
                        <button className="flex items-center space-x-2 px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors">
                          <FiUpload className="w-4 h-4" />
                          <span>Upload New Logo</span>
                        </button>
                        <p className="text-sm text-secondary-500 mt-2">
                          Recommended: 200x200px PNG or JPG
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="space-y-6">
                    <h3 className="font-semibold text-secondary-900">Company Information</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="label">Company Name</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="Your Company Name"
                        />
                      </div>
                      <div>
                        <label className="label">Business Number</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="Tax ID or Business Number"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="label">Default Currency</label>
                        <select className="select-field">
                          <option value="USD">USD - US Dollar</option>
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
                        <label className="label">Default Tax Rate (%)</label>
                        <input
                          type="number"
                          className="input-field"
                          placeholder="0"
                          step="0.01"
                          min="0"
                          max="100"
                          defaultValue="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Invoice Settings */}
                  <div className="space-y-6">
                    <h3 className="font-semibold text-secondary-900">Invoice Settings</h3>
                    <div className="grid md:grid-cols-2 gap-6">
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
                        <label className="label">Next Invoice Number</label>
                        <input
                          type="number"
                          className="input-field"
                          placeholder="1001"
                          defaultValue="1001"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label">Default Payment Terms (days)</label>
                      <select className="select-field">
                        <option value="7">7 days</option>
                        <option value="14">14 days</option>
                        <option value="30" selected>30 days</option>
                        <option value="60">60 days</option>
                        <option value="90">90 days</option>
                      </select>
                    </div>

                    <div>
                      <label className="label">Default Invoice Notes</label>
                      <textarea
                        className="input-field"
                        rows="3"
                        placeholder="Payment terms and other default notes..."
                      />
                    </div>

                    <div>
                      <label className="label">Invoice Footer Text</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Thank you for your business!"
                        defaultValue="Thank you for your business!"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-6 border-t border-gray-200">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="btn-primary flex items-center space-x-2"
                    >
                      {isSaving ? (
                        <>
                          <div className="spinner w-4 h-4 border-2 border-white border-t-transparent"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <FiSave className="w-4 h-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="card p-8">
                <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                  Notification Settings
                </h2>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-secondary-900">Email Notifications</h3>
                    
                    {[
                      { id: 'invoice_sent', label: 'Invoice Sent', description: 'When you send an invoice to a client' },
                      { id: 'invoice_paid', label: 'Invoice Paid', description: 'When a client marks an invoice as paid' },
                      { id: 'payment_received', label: 'Payment Received', description: 'When you receive a payment' },
                      { id: 'invoice_overdue', label: 'Invoice Overdue', description: 'When an invoice becomes overdue' },
                      { id: 'monthly_report', label: 'Monthly Report', description: 'Monthly business performance summary' },
                      { id: 'system_updates', label: 'System Updates', description: 'Important updates about Invoice Flow Pro' },
                    ].map((notification) => (
                      <div key={notification.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-secondary-900">
                            {notification.label}
                          </div>
                          <div className="text-sm text-secondary-500">
                            {notification.description}
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <button className="btn-primary flex items-center space-x-2">
                      <FiSave className="w-4 h-4" />
                      <span>Save Notification Preferences</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Team Settings */}
            {activeTab === 'team' && (
              <div className="card p-8">
                <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                  Team Management
                </h2>

                <div className="space-y-8">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="font-semibold text-secondary-900">Team Members</h3>
                        <p className="text-secondary-600">Invite team members to collaborate</p>
                      </div>
                      <button className="btn-primary flex items-center space-x-2">
                        <FiUsers className="w-4 h-4" />
                        <span>Invite Team Member</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {[
                        { name: 'You', email: 'admin@example.com', role: 'Owner', status: 'active' },
                        { name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Admin', status: 'active' },
                        { name: 'Michael Brown', email: 'michael@example.com', role: 'Editor', status: 'pending' },
                      ].map((member, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-secondary-900">
                                {member.name}
                              </div>
                              <div className="text-sm text-secondary-500">
                                {member.email}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              member.status === 'active'
                                ? 'bg-success-100 text-success-800'
                                : 'bg-warning-100 text-warning-800'
                            }`}>
                              {member.status === 'active' ? 'Active' : 'Pending'}
                            </span>
                            <select className="select-field text-sm w-32">
                              <option value="owner" selected={member.role === 'Owner'}>Owner</option>
                              <option value="admin" selected={member.role === 'Admin'}>Admin</option>
                              <option value="editor" selected={member.role === 'Editor'}>Editor</option>
                              <option value="viewer" selected={member.role === 'Viewer'}>Viewer</option>
                            </select>
                            <button className="text-danger-600 hover:text-danger-700 px-3 py-1 rounded-lg hover:bg-danger-50">
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Show other tabs with placeholders */}
            {['billing', 'security', 'integrations'].includes(activeTab) && (
              <div className="card p-8">
                <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                  {tabs.find(t => t.id === activeTab)?.label} Settings
                </h2>
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 text-primary-600 rounded-full mb-4">
                    <FiCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                    Coming Soon
                  </h3>
                  <p className="text-secondary-600 max-w-md mx-auto">
                    This section is under development and will be available in a future update.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;