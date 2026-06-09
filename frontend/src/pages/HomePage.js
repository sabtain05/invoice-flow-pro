import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  FiArrowRight, 
  FiCheckCircle, 
  FiBarChart2, 
  FiFileText, 
  FiDollarSign,
  FiUsers,
  FiClock,
  FiShield
} from 'react-icons/fi';

const HomePage = () => {
  const features = [
    {
      icon: <FiFileText className="w-8 h-8" />,
      title: 'Professional Invoices',
      description: 'Create beautiful, professional invoices in minutes with our customizable templates.'
    },
    {
      icon: <FiBarChart2 className="w-8 h-8" />,
      title: 'Real-time Analytics',
      description: 'Track your business performance with detailed insights and financial reports.'
    },
    {
      icon: <FiDollarSign className="w-8 h-8" />,
      title: 'Online Payments',
      description: 'Get paid faster with integrated online payment processing.'
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: 'Client Management',
      description: 'Manage all your clients in one place with detailed profiles and history.'
    },
    {
      icon: <FiClock className="w-8 h-8" />,
      title: 'Time Tracking',
      description: 'Track billable hours and automatically add them to invoices.'
    },
    {
      icon: <FiShield className="w-8 h-8" />,
      title: 'Bank-level Security',
      description: 'Your data is protected with enterprise-grade security and encryption.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Invoice Flow Pro - Professional Invoice Management Software</title>
        <meta name="description" content="Streamline your invoicing process with Invoice Flow Pro. Create, send, and track professional invoices in minutes." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="gradient-text">Streamline Your</span>
              <br />
              <span className="text-secondary-900">Invoicing Process</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-secondary-600 max-w-3xl mx-auto mb-10"
            >
              Invoice Flow Pro helps businesses create, send, and track professional invoices effortlessly. 
              Get paid faster and focus on growing your business.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/signup"
                className="btn-primary inline-flex items-center justify-center group"
              >
                Start Free Trial
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="btn-outline inline-flex items-center justify-center"
              >
                Schedule Demo
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              Everything You Need for
              <span className="gradient-text"> Efficient Invoicing</span>
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Powerful features designed to simplify your billing process and improve cash flow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-8 hover:border-primary-200"
              >
                <div className="text-primary-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-secondary-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Invoicing?
          </h2>
          <p className="text-xl text-primary-100 mb-10">
            Join thousands of businesses using Invoice Flow Pro to streamline their billing process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Get Started Free
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;