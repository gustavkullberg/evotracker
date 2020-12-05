import styles from "./header.module.css";
import Link from "next/link";

export const Header = () => (
  <header className={styles.header}>
    <h1 className={styles.title}>
      <Link href="/">
        <a className={styles.link}>Evotracker</a>
      </Link>
    </h1>
  </header>
);
