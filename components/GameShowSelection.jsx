import styles from '../styles/Home.module.css';
import { gameShows, gameShowTitles } from "../constants";
export const GameShowSelection = ({ selectedGameShow, setShowClick }) => {
    return <div className={styles.gameTiles}>
        {gameShows.map((gs, idx) => (
            <div key={idx}>
                <h5
                    style={{
                        backgroundColor: selectedGameShow === gs ? '#1b2631' : 'white',
                        color: selectedGameShow === gs ? 'white' : '#1b2631',
                    }}
                    onClick={() => setShowClick(gs)}
                >
                    {gameShowTitles[gs]}
                </h5>
            </div>
        ))}
    </div>
}