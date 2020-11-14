import '../styles/globals.css';
import TagManager from 'react-gtm-module';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    TagManager.initialize({
      gtmId: 'GTM-KJ4L2LM',
    });
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
