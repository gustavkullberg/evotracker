import moment from "moment";
import { useState } from "react";
import styles from "./GameList.module.css";

const defaultNumberOfTopShows = 10;

export const GameList = ({ gameList, setGameShow, maxNbr, title, isPercentageValue, isAthEventList }) => {
    const [numberListed, setNumberListed] = useState(defaultNumberOfTopShows);

    const getValue = (value) => {
        return isPercentageValue ?
            <p style={{ color: `${value > 1 ? "green" : "red"}` }}>
                &nbsp;{Math.floor((value - 1) * 100)}%</p> :
            <p>&nbsp;{value}</p>;
    };

    const formatDate = (timeStamp: Date) => {
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);
        const date = moment(timeStamp);
        if (date.isAfter(moment(twentyFourHoursAgo))) {
            return moment(timeStamp).fromNow();
        }
        return moment(timeStamp).fromNow()
    }

    const formatGameName = (game: string) => {
        return game.length > 20 ? game.slice(0, 16) + ".." : game
    }

    const getPrefix = (timeStamp, rank, value, game) => {
        return isAthEventList ? `${formatDate(timeStamp)}. ${formatGameName(game)} | ` : `${rank}. ${formatGameName(game)} | `;
    }

    return <div className={styles.statusProp}>
        <h4>{title}</h4>
        {gameList && gameList.length > 0 && <div className={styles.gameRankingListContainer}>
            <div className={styles.gameRankingList}>
                {gameList.slice(0, numberListed).map((show, idx) => <div key={idx} >
                    <div style={{ display: "flex" }}>
                        <p onClick={() => setGameShow(show.game)}>{getPrefix(show.timeStamp, idx + 1, show.value, show.game)}</p>
                        {getValue(show.value)}
                    </div>
                </div>)}
            </div>

            {numberListed > defaultNumberOfTopShows && <ion-icon
                name={"chevron-up-outline"}
                onClick={() => setNumberListed(numberListed - 10)}
            />}
            {numberListed <= maxNbr && <ion-icon
                name={"chevron-down-outline"}
                onClick={() => setNumberListed(numberListed + 10)}
            />
            }
        </div>}
    </div>
}