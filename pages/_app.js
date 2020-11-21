import styles from "../styles/Home.module.css";
import "../styles/globals.css";
import TagManager from "react-gtm-module";
import { useEffect } from "react";
import { Header, Footer } from "../components";

const App = ({ Component, pageProps }) => {
  useEffect(() => {
    TagManager.initialize({
      gtmId: "GTM-KJ4L2LM",
    });
  }, []);

  return (
    <>
      <head>
        <title>Evotracker</title>
        <meta
          name="description"
          content="Track activity on games created by Evolution Gaming Group"
        />
        <script src="https://unpkg.com/ionicons@5.0.0/dist/ionicons.js"></script>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <section role="main" className={styles.container}>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </section>
    </>
  );
};

export default App;
