import { useState } from "react";
import styles from "./GameList.module.css";

const defaultNumberOfTopShows = 10;

export const GameList = ({ gameList, setGameShow, maxNbr, title, isPercentageValue }) => {
    const [numberListed, setNumberListed] = useState(defaultNumberOfTopShows);

    const getValue = (value) => {
        return isPercentageValue ?
            <p style={{ color: `${value > 1 ? "green" : "red"}` }}>
                &nbsp;{Math.floor((value - 1) * 100)}%</p> :
            <p>&nbsp;{value}</p>;
    };

    return <div className={styles.statusProp}>
        <h4>{title}</h4>
        {gameList && gameList.length > 0 && <div className={styles.gameRankingListContainer}>
            <div className={styles.gameRankingList}>
                {gameList.slice(0, numberListed).map((show, idx) => <div key={idx} >
                    <div style={{ display: "flex" }}>
                        <p onClick={() => setGameShow(show.game)}>{idx + 1}. {show.game} |</p>
                        {getValue(show.value)}
                    </div>
                </div>)}
            </div>

            {numberListed > defaultNumberOfTopShows && <ion-icon
                name={"chevron-up-outline"}
                onClick={() => setNumberListed(numberListed - 10)}
            />}
            {numberListed <= maxNbr.length && <ion-icon
                name={"chevron-down-outline"}
                onClick={() => setNumberListed(numberListed + 10)}
            />
            }
        </div>}
    </div>

}