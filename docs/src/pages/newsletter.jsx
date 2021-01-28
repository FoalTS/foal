import React from 'react';
import Layout from '@theme/Layout';

export default function Newsletter() {
  return (
    <Layout
      description='Suscribe to FoalTS newsletter'>
        <div style={{ textAlign: 'center' }}>
          <iframe className="mj-w-res-iframe" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" src="https://app.mailjet.com/widget/iframe/6owE/Hce" width="633" height="436"></iframe>
        </div>
    </Layout>
  );
}
