import React from 'react';
import Layout from '@theme/Layout';

export default function Newsletter() {
  return (
    <Layout
      description='Suscribe to FoalTS newsletter'>
        <iframe className="mj-w-res-iframe" frameBorder={0} scrolling="no" marginHeight="0" marginWidth="0" src="https://app.mailjet.com/widget/iframe/6owE/Hce" width="100%"></iframe>
    </Layout>
  );
}
