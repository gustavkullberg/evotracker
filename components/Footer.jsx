import styles from '../styles/Home.module.css';

export const Footer = () => {
    return <div className={styles.footer}>
        <a href="https://livecasino.williamhill.com/en-gb/game-shows" target="_blank" rel="noopener noreferrer">
            <h5>Data source: William Hill</h5>
        </a>

        <a href="https://twitter.com/GustavKullberg" target="_blank" rel="noopener noreferrer">
            <img width="30px" src="twitter.png" />
            <p>@GustavKullberg</p>
        </a>

        <a href="https://github.com/gustavkullberg/evotracker" target="_blank" rel="noopener noreferrer">
            <img width="30px" src="github.png" />
            <p>View on GitHub</p>
        </a>
    </div>
}