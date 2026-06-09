import React from 'react';
import { Helmet } from 'react-helmet-async';

const TermsPage = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - Invoice Flow Pro</title>
        <meta name="description" content="Invoice Flow Pro Terms of Service and User Agreement" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-secondary-600">
            Last updated: January 01, 2026
          </p>
        </div>

        <div className="card p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-secondary-600 mb-4">
              By accessing or using Invoice Flow Pro ("Service"), you agree to be bound by these Terms of Service. 
              If you disagree with any part of the terms, you may not access the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">2. Description of Service</h2>
            <p className="text-secondary-600 mb-4">
              Invoice Flow Pro provides cloud-based invoice management software that allows businesses to create, 
              send, and track invoices. The Service includes features for client management, payment processing, 
              and financial reporting.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">3. User Accounts</h2>
            <div className="text-secondary-600 space-y-3">
              <p>3.1. You must be at least 18 years old to use this Service.</p>
              <p>3.2. You are responsible for maintaining the security of your account and password.</p>
              <p>3.3. You are responsible for all activities that occur under your account.</p>
              <p>3.4. You must notify us immediately of any unauthorized use of your account.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">4. Subscription and Payments</h2>
            <div className="text-secondary-600 space-y-3">
              <p>4.1. The Service is offered on a subscription basis with different plans available.</p>
              <p>4.2. Subscription fees are billed in advance on a monthly or annual basis.</p>
              <p>4.3. We may change subscription fees with 30 days notice.</p>
              <p>4.4. All fees are exclusive of taxes, which you are responsible for paying.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">5. Cancellation and Termination</h2>
            <div className="text-secondary-600 space-y-3">
              <p>5.1. You may cancel your subscription at any time through your account settings.</p>
              <p>5.2. Upon cancellation, you will have access to the Service until the end of your billing period.</p>
              <p>5.3. We reserve the right to suspend or terminate accounts for violation of these terms.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">6. Data and Privacy</h2>
            <p className="text-secondary-600 mb-4">
              Your use of the Service is subject to our Privacy Policy. We take data protection seriously 
              and implement industry-standard security measures to protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">7. Intellectual Property</h2>
            <div className="text-secondary-600 space-y-3">
              <p>7.1. The Service and its original content are owned by Invoice Flow Pro.</p>
              <p>7.2. You retain all rights to the data you upload to the Service.</p>
              <p>7.3. We may use aggregated, anonymized data to improve our services.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-secondary-600 mb-4">
              To the maximum extent permitted by law, Invoice Flow Pro shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages resulting from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">9. Changes to Terms</h2>
            <p className="text-secondary-600 mb-4">
              We reserve the right to modify these terms at any time. We will provide notice of significant 
              changes. Continued use of the Service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">10. Contact Information</h2>
            <p className="text-secondary-600">
              For questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-secondary-600 mt-2">
              Email: sabtainalipk144@gmail.com<br />
              Address: Blue Area, Islamabad, Pakistan 
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default TermsPage;