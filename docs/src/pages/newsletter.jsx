import React from 'react';
import Layout from '@theme/Layout';

export default function Newsletter() {
  return (
    <Layout
      description='Subscribe to FoalTS newsletter'>
      <iframe data-w-type="embedded" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" src="https://x7u6p.mjt.lu/wgt/x7u6p/8um/form?c=3d124ddc" width="100%" style={{ height: 0 }}></iframe>
      <script type="text/javascript" src="https://app.mailjet.com/pas-nc-embedded-v1.js"></script>
    </Layout>
  );
}
