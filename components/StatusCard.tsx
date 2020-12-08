import styles from '../styles/Home.module.css';
import React from 'react';
type GameStats = {
    livePlayers: number;
    weekAvg: number;
    timeStamp: Date;
}

type Show = {
    name: string;
    players: number;
}

type StatusCardInput = {
    selectedGameShow: string;
    gameStats?: GameStats;
    topFiveShows?: Show[];
    setGameShow?: any;
}

const defaultNumberOfTopShows = 10;

export const StatusCard = ({ selectedGameShow, gameStats, topFiveShows, setGameShow }: StatusCardInput): JSX.Element => {
    const [nofShowsListed, setNofShowsListed] = React.useState(defaultNumberOfTopShows);
    return <div className={styles.statusContiner}>
        <div className={styles.statusCard}>
            {topFiveShows && topFiveShows.length > 0 && <div className={styles.statusProp}>
                <h4>Top {defaultNumberOfTopShows} shows live</h4>
                <div className={styles.gameRankingList}>
                    {topFiveShows.slice(0, nofShowsListed).map((show, idx) => <div key={idx} >
                        <p onClick={() => setGameShow(show.name)}>{idx + 1}. {show.name} | {show.players}</p>

                    </div>)}
                </div>

                {nofShowsListed > defaultNumberOfTopShows && <ion-icon
                    name={"chevron-up-outline"}
                    onClick={() => setNofShowsListed(nofShowsListed - 10)}
                />}
                {nofShowsListed <= topFiveShows.length && <ion-icon
                    name={"chevron-down-outline"}
                    onClick={() => setNofShowsListed(nofShowsListed + 10)}
                />

                }

            </div>}

            <div className={styles.gameRankingList}>
                <div className={styles.statusProp}>
                    <h1>{selectedGameShow}</h1>
                    <p>Live Players</p>
                    <h4>{gameStats.livePlayers}</h4>
                    <p>Avg. Players, 7 Days</p>
                    <h4>{gameStats.weekAvg}</h4>
                </div>
            </div>

            <p style={{ marginTop: "5px" }}>{gameStats.timeStamp && new Date(gameStats.timeStamp).toLocaleString()}</p>
        </div>
    </div>
}