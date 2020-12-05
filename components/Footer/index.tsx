import styles from "./footer.module.css";
import { twitterURL, dataSourceURL, gitHubURL } from "../../config";

export const Footer = () => (
  <footer className={styles.footer}>
    <a
      className={styles.link}
      href={dataSourceURL}
      target="_blank"
      rel="noopener noreferrer"
    >
      <p style={{ fontSize: "0.85rem" }}>Data source: William Hill</p>
    </a>

    <a
      className={styles.link}
      href={twitterURL}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img width="30px" src="twitter.png" />
      <p>@GustavKullberg</p>
    </a>

    <a
      className={styles.link}
      href={gitHubURL}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img width="30px" src="github.png" />
      <p>View on GitHub</p>
    </a>
  </footer>
);
