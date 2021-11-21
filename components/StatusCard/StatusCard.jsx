import styles from '../../styles/Home.module.css';
import mStyles from "./StatusCard.module.css";
import React from 'react';

export const StatusCard = ({ selectedGameShow, gameStats }) => {
    return <div className={styles.statusContiner}>
        <div style={{ display: "flex", flexDirection: "column", width: "97%" }} className={styles.statusCard}>
            <div className={styles.statusCardContent} >
                <div className={mStyles.gameRankingList}>
                    <div className={styles.statusProp}>
                        <h1>{selectedGameShow}</h1>
                        <div className={mStyles.gameStatusRow}  >
                            <div className={mStyles.gameStatusRowElement} >
                                <p>Live Players</p>
                                <h4>{gameStats?.livePlayers}</h4>

                            </div>
                            <div className={mStyles.gameStatusRowElement}>
                                <p>Rank</p>
                                <h4>{gameStats.rank}#</h4>
                            </div>
                            <div className={mStyles.gameStatusRowElement}>
                                <p>All Time High @{gameStats?.athDate ? new Date(gameStats?.athDate).toLocaleDateString() : undefined}</p>
                                <h4>{gameStats?.ath}</h4>
                            </div>

                        </div>
                        <div className={mStyles.gameStatusRow}  >

                            <div className={mStyles.gameStatusRowElement} >
                                <p>Avg. Players, Week</p>
                                <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                                    <h4>{gameStats.ma7}</h4>
                                    <p style={{ color: `${gameStats.ma7Delta > 1 ? "green" : "red"}` }}>{Math.floor((gameStats.ma7Delta - 1) * 100)}%</p>
                                </div>
                            </div>
                            <div className={mStyles.gameStatusRowElement} >
                                <p>Avg. Players, 30 Days</p>

                                <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                                    <h4>{gameStats.ma30}</h4>
                                    <p style={{ color: `${gameStats.ma30Delta > 1 ? "green" : "red"}` }}>{Math.floor((gameStats.ma30Delta - 1) * 100)}%</p>
                                </div>
                            </div>
                            <div className={mStyles.gameStatusRowElement} >
                                <p>Avg. Players, 90 Days</p>

                                <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                                    <h4>{gameStats.ma90}</h4>
                                    <p style={{ color: `${gameStats.ma90Delta > 1 ? "green" : "red"}` }}>{Math.floor((gameStats.ma90Delta - 1) * 100)}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {gameStats?.liveTimeStamp && <p style={{ marginTop: "5px", fontSize: "0.8rem" }}>{gameStats?.liveTimeStamp && new Date(gameStats?.liveTimeStamp).toLocaleString()}</p>}
        </div>
    </div>
}