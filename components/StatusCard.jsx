import styles from '../styles/Home.module.css';
import React from 'react';
/* 
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
} */

const defaultNumberOfTopShows = 10;

export const StatusCard = ({ selectedGameShow, gameStats, topFiveShows, setGameShow }) => {
    const [nofShowsListed, setNofShowsListed] = React.useState(defaultNumberOfTopShows);
    return <div className={styles.statusContiner}>
        <div style={{ display: "flex", flexDirection: "column" }} className={styles.statusCard}>

            <div className={styles.statusCardContent} >

                {<div className={styles.statusProp}>
                    <h4>Top {defaultNumberOfTopShows} shows live</h4>
                    {topFiveShows && topFiveShows.length > 0 && <div className={styles.gameRankingListContainer}>
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
                </div>}

                <div className={styles.gameRankingList} style={{ display: "flex" }}>
                    <div className={styles.statusProp}>
                        <h1>{selectedGameShow}</h1>

                        <div style={{ display: "flex" }}>
                            <div style={{ marginRight: "10px" }} >
                                <p>Live Players</p>
                                <h4>{gameStats.livePlayers}</h4>
                                <p>Avg. Players, 24 Hours</p>
                                <h4>{gameStats.weekAvg}</h4>

                            </div>
                            <div style={{ marginLeft: "10px" }}>
                                <p>Rank</p>
                                <h4>{selectedGameShow === "All Shows" ? "-" : `#${topFiveShows.findIndex(s => s.name === selectedGameShow) + 1}`}</h4>

                                <p>All Time High @{gameStats?.ath ? new Date(gameStats?.ath?.timeStamp).toLocaleDateString() : undefined}</p>
                                <h4>{gameStats?.ath?.value}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {gameStats.timeStamp && <p style={{ marginTop: "5px", fontSize: "0.8rem" }}>{gameStats.timeStamp && new Date(gameStats.timeStamp).toLocaleString()}</p>}
        </div>

    </div>
}