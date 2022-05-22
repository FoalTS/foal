import React from 'react';
import Layout from '@theme/Layout';

export default function Newsletter() {
  return (
    <Layout
      description='Subscribe to FoalTS newsletter'>
        <iframe style={{ height: '300px', backgroundColor: '#1b7cf2' }} className="mj-w-res-iframe" frameBorder={0} scrolling="no" marginHeight="0" marginWidth="0" src="https://app.mailjet.com/widget/iframe/6owE/Hce" width="100%"></iframe>
    </Layout>
  );
}
