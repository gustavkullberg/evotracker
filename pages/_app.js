import styles from '../styles/Home.module.css';
import TagManager from 'react-gtm-module';
import { useEffect } from 'react';
import { Header, Footer } from '../components';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    TagManager.initialize({
      gtmId: 'GTM-KJ4L2LM',
    });
  }, []);

  return (
    <div>
      <head>
        <title>Evotracker</title>
        <meta name="description" content="Track activity on games created by Evolution Gaming Group" />
        <script src="https://unpkg.com/ionicons@5.0.0/dist/ionicons.js"></script>
      </head>
      <div className={styles.container}>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </div>
    </div>
  );
}

export default MyApp;
