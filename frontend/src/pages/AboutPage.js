import React from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  FiTarget, 
  FiUsers, 
  FiAward, 
  FiGlobe,
  FiHeart,
  FiTrendingUp
} from 'react-icons/fi';

const AboutPage = () => {
  const team = [
    {
      name: 'Sabtain Ali',
      role: 'Founder & CEO',
      bio: 'Software Engineer with 3+ years in fintech and SaaS product development and full stack developer.',
      image: 'SA'
    },
  ];

  const values = [
    {
      icon: <FiTarget className="w-8 h-8" />,
      title: 'Customer Focus',
      description: 'We prioritize our customers needs and work tirelessly to deliver exceptional value.'
    },
    {
      icon: <FiAward className="w-8 h-8" />,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from product development to customer support.'
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: 'Collaboration',
      description: 'We believe in the power of teamwork and open communication.'
    },
    {
      icon: <FiGlobe className="w-8 h-8" />,
      title: 'Innovation',
      description: 'We continuously innovate to stay ahead of industry trends and customer expectations.'
    },
    {
      icon: <FiHeart className="w-8 h-8" />,
      title: 'Integrity',
      description: 'We conduct our business with honesty, transparency, and ethical practices.'
    },
    {
      icon: <FiTrendingUp className="w-8 h-8" />,
      title: 'Growth',
      description: 'We foster a culture of continuous learning and professional development.'
    },
  ];

  return (
    <>
      <Helmet>
        <title>About Us - Invoice Flow Pro</title>
        <meta name="description" content="Learn about Invoice Flow Pro - our mission, team, and values." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-secondary-900 mb-6">
              About <span className="gradient-text">Invoice Flow Pro</span>
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              We're on a mission to simplify invoicing for businesses of all sizes, 
              helping them get paid faster and grow their operations.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-secondary-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-secondary-600 mb-6">
                At Invoice Flow Pro, we believe that managing invoices shouldn't be a 
                complicated or time-consuming task. Our mission is to provide businesses 
                with intuitive, powerful tools that streamline their billing processes.
              </p>
              <p className="text-lg text-secondary-600">
                Founded in 2025, we've helped thousands of businesses across 5+ countries 
                improve their cash flow and reduce administrative overhead. We're committed 
                to continuous innovation and exceptional customer support.
              </p>
            </div>
            <div className="bg-gradient-primary rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">What We Achieve</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  <span>Reduce invoicing time by 70% on average</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  <span>Help businesses get paid 2x faster</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  <span>Process over $5M in invoices annually</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  <span>Serve 10,000+ businesses worldwide</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              Our <span className="gradient-text">Core Values</span>
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              The principles that guide everything we do at Invoice Flow Pro.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card p-8">
                <div className="text-primary-600 mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-secondary-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              Meet Our <span className="gradient-text">Leadership Team</span>
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              The passionate individuals driving innovation at Invoice Flow Pro.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gradient-primary rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                  {member.image}
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-secondary-600 text-sm">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Join Thousands of Satisfied Businesses
          </h2>
          <p className="text-xl text-primary-100 mb-10">
            Experience the difference with Invoice Flow Pro. Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Start Free Trial
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300"
            >
              Contact Our Team
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;