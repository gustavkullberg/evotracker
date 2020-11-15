import '../styles/globals.css';
import TagManager from 'react-gtm-module';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    TagManager.initialize({
      gtmId: process.env.GTM_ID,
    });
  }, []);

  return (
    <div>
      <head>
        <title>Evotracker</title>
      </head>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
