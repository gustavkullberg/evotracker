import styles from "../styles/privacy-policy.module.css"
export default function PrivacyPolicy() {
    return <div className={styles.container}>
        <h2>Evotracker itself does not store any user information.</h2>
        <h2> It does however use the following third party services which stores cookies on users devices: </h2>
        <ul>
            <li>Google Analyitcs</li>
            <li>Google AdSense</li>
        </ul>
    </div>
}