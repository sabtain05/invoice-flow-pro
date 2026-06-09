import React from 'react';
import { Helmet } from 'react-helmet-async';

const EditInvoicePage = () => {
  return (
    <>
      <Helmet>
        <title>Edit Invoice - Invoice Flow Pro</title>
      </Helmet>
      
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-secondary-900 mb-4">
          Edit Invoice Page
        </h1>
        <p className="text-secondary-600">
          This page is similar to CreateInvoicePage but loads existing invoice data.
          For now, use the Create Invoice page.
        </p>
      </div>
    </>
  );
};

export default EditInvoicePage;