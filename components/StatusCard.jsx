import styles from '../styles/Home.module.css';
import { gameShowTitles } from '../constants';


export const StatusCard = ({ selectedGameShow, gameStats }) => {
    return <div className={styles.statusContiner}>
        <div className={styles.statusCard}>
            <h1>{gameShowTitles[selectedGameShow]}</h1>
            <div className={styles.statusProp}>
                <p>Live Players</p>
                <h4>{gameStats.livePlayers}</h4>
            </div>

            <div className={styles.statusProp}>
                <p>Avg. Players, 7 Days</p>
                <h4>{gameStats.weekAvg}</h4>
            </div>

            <p>{gameStats.timeStamp && new Date(gameStats.timeStamp).toLocaleString()}</p>
        </div>
    </div>
}