import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  FiPlus, 
  FiTrendingUp, 
  FiDollarSign, 
  FiClock, 
  FiCheckCircle
} from 'react-icons/fi';
import { useQuery } from 'react-query';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import StatCard from '../../components/dashboard/StatCard';
import RecentInvoices from '../../components/dashboard/RecentInvoices';
import QuickActions from '../../components/dashboard/QuickActions';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DashboardPage = () => {
  const { user } = useAuth();

  const { data: dashboardData, isLoading } = useQuery(
    'dashboard',
    async () => {
      const [invoicesResponse, statsResponse] = await Promise.all([
        api.get('/invoices', { params: { limit: 5 } }),
        api.get('/invoices/stats/summary')
      ]);
      
      return {
        invoices: invoicesResponse.data.invoices,
        pagination: invoicesResponse.data.pagination,
        summary: invoicesResponse.data.summary,
        stats: statsResponse.data.stats,
        monthlyTrends: statsResponse.data.monthlyTrends
      };
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 30000 // 30 seconds
    }
  );

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${dashboardData?.stats?.totalAmount?.toLocaleString() || '0'}`,
      change: '+12.5%',
      icon: <FiTrendingUp className="w-6 h-6" />,
      color: 'primary'
    },
    {
      title: 'Paid Invoices',
      value: dashboardData?.summary?.paid?.count || 0,
      change: '+8.2%',
      icon: <FiCheckCircle className="w-6 h-6" />,
      color: 'success'
    },
    {
      title: 'Pending',
      value: dashboardData?.summary?.sent?.count || 0,
      change: '-3.1%',
      icon: <FiClock className="w-6 h-6" />,
      color: 'warning'
    },
    {
      title: 'Overdue',
      value: dashboardData?.summary?.overdue?.count || 0,
      change: '+2.4%',
      icon: <FiDollarSign className="w-6 h-6" />,
      color: 'danger'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Invoice Flow Pro</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-secondary-900">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-secondary-600 mt-2">
                Here's what's happening with your business today.
              </p>
            </div>
            <Link
              to="/invoices/create"
              className="btn-primary flex items-center gap-2"
            >
              <FiPlus className="w-5 h-5" />
              New Invoice
            </Link>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Invoices */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <RecentInvoices invoices={dashboardData?.invoices || []} />
          </motion.div>

          {/* Quick Actions & Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            <QuickActions />

            {/* Invoice Status Distribution */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-6">
                Invoice Status
              </h3>
              <div className="space-y-4">
                {dashboardData?.summary && Object.entries(dashboardData.summary).map(([status, data]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        status === 'paid' ? 'bg-success-500' :
                        status === 'sent' ? 'bg-blue-500' :
                        status === 'overdue' ? 'bg-danger-500' :
                        status === 'draft' ? 'bg-secondary-400' : 'bg-warning-500'
                      }`} />
                      <span className="capitalize">{status}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">{data.count}</span>
                      <span className="text-secondary-500">
                        ${data.totalAmount?.toLocaleString() || '0'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Summary */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-6">
                Performance Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Total Invoices</span>
                  <span className="font-semibold">{dashboardData?.stats?.totalInvoices || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Avg. Invoice Value</span>
                  <span className="font-semibold">
                    ${dashboardData?.stats?.averageInvoice?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Collection Rate</span>
                  <span className="font-semibold text-success-600">
                    {dashboardData?.stats?.totalAmount ? 
                      `${((dashboardData.stats.paidAmount / dashboardData.stats.totalAmount) * 100).toFixed(1)}%` 
                      : '0%'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;