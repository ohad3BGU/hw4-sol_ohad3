import React from 'react';
import Layout from '../components/Layout';

const Unauthorized = () => {
  return (
    <Layout>
        <div>
          <h1> Oops, something went wrong</h1>
        <h3>You're unauthorized to view this page, you can try to log in or sign up first</h3>
        </div>
    </Layout>
  );
};

export default Unauthorized;
