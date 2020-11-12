import '../styles/globals.css';
import TagManager from 'react-gtm-module';
import { useEffect } from 'react';

const tagManagerArgs = {
  gtmId: 'GTM-KJ4L2LM',
};

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    TagManager.initialize(tagManagerArgs);
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
