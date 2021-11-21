import styles from './GeneralStatusCard.module.css';
import React from 'react';
import { isMobile } from 'react-device-detect';
const defaultNumberOfTopShows = isMobile ? 5 : 10;

export const GeneralStatusCard = ({ stats, setGameShow }) => {
    const [nofShowsListed, setNofShowsListed] = React.useState(defaultNumberOfTopShows);
    const [nofATHShowsListed, setNofATHShowsListed] = React.useState(defaultNumberOfTopShows);
    const [nofTrendersListed, setNofTrendersListed] = React.useState(defaultNumberOfTopShows);
    const [nofWeeklyTrendersListed, setNofWeeklyTrendersListed] = React.useState(defaultNumberOfTopShows);


    const { aths, topLive, highestMonthlyRelative, highestWeeklyRelative } = stats;

    return <div className={styles.statusContiner}>
        <div style={{ display: "flex", flexDirection: "column" }} className={styles.statusCard}>

            {<div className={styles.statusProp}>
                <h4>Live</h4>
                {topLive && topLive.length > 0 && <div className={styles.gameRankingListContainer}>
                    <div className={styles.gameRankingList}>
                        {topLive.slice(0, nofShowsListed).map((show, idx) => <div key={idx} >
                            <p onClick={() => setGameShow(show.game)}>{idx + 1}. {show.game} | {show.value}</p>
                        </div>)}
                    </div>

                    {nofShowsListed > defaultNumberOfTopShows && <ion-icon
                        name={"chevron-up-outline"}
                        onClick={() => setNofShowsListed(nofShowsListed - 10)}
                    />}
                    {nofShowsListed <= topLive.length && <ion-icon
                        name={"chevron-down-outline"}
                        onClick={() => setNofShowsListed(nofShowsListed + 10)}
                    />
                    }
                </div>}
            </div>}
            <div className={styles.statusCardContent} >
                {<div className={styles.statusProp}>
                    <h4>All Time Highs</h4>
                    {aths && aths.length > 0 && <div className={styles.gameRankingListContainer}>
                        <div className={styles.gameRankingList}>
                            {aths.slice(0, nofATHShowsListed).map((show, idx) => <div key={idx} >
                                <p onClick={() => setGameShow(show.game)}>{idx + 1}. {show.game} | {show.value}</p>
                            </div>)}
                        </div>

                        {nofATHShowsListed > defaultNumberOfTopShows && <ion-icon
                            name={"chevron-up-outline"}
                            onClick={() => setNofATHShowsListed(nofATHShowsListed - 10)}
                        />}
                        {nofATHShowsListed <= topLive.length && <ion-icon
                            name={"chevron-down-outline"}
                            onClick={() => setNofATHShowsListed(nofATHShowsListed + 10)}
                        />
                        }
                    </div>}
                </div>}

                {<div className={styles.statusProp}>
                    <h4>Weekly gainers</h4>
                    {highestWeeklyRelative && highestWeeklyRelative.length > 0 && <div className={styles.gameRankingListContainer}>
                        <div className={styles.gameRankingList}>
                            {highestWeeklyRelative.slice(0, nofWeeklyTrendersListed).map((show, idx) => <div key={idx} >
                                <div style={{ display: "flex" }}>
                                    <p onClick={() => setGameShow(show.game)}>{idx + 1}. {show.game} |</p>
                                    <p style={{ color: `${show.value > 1 ? "green" : "red"}` }}>
                                        &nbsp;{Math.floor((show.value - 1) * 100)}%</p>
                                </div>
                            </div>)}
                        </div>
                        {nofWeeklyTrendersListed > defaultNumberOfTopShows && <ion-icon
                            name={"chevron-up-outline"}
                            onClick={() => setNofWeeklyTrendersListed(nofWeeklyTrendersListed - 10)}
                        />}
                        {nofWeeklyTrendersListed <= highestWeeklyRelative.length && <ion-icon
                            name={"chevron-down-outline"}
                            onClick={() => setNofWeeklyTrendersListed(nofWeeklyTrendersListed + 10)}
                        />
                        }
                    </div>}
                </div>}

                {<div className={styles.statusProp}>
                    <h4>Monthly gainers</h4>
                    {highestMonthlyRelative && highestMonthlyRelative.length > 0 && <div className={styles.gameRankingListContainer}>
                        <div className={styles.gameRankingList}>
                            {highestMonthlyRelative.slice(0, nofTrendersListed).map((show, idx) => <div key={idx} >
                                <div style={{ display: "flex" }}>
                                    <p onClick={() => setGameShow(show.game)}>{idx + 1}. {show.game} |</p>
                                    <p style={{ color: `${show.value > 1 ? "green" : "red"}` }}>
                                        &nbsp;{Math.floor((show.value - 1) * 100)}%</p>
                                </div>
                            </div>)}
                        </div>
                        {nofTrendersListed > defaultNumberOfTopShows && <ion-icon
                            name={"chevron-up-outline"}
                            onClick={() => setNofTrendersListed(nofTrendersListed - 10)}
                        />}
                        {nofTrendersListed <= highestMonthlyRelative.length && <ion-icon
                            name={"chevron-down-outline"}
                            onClick={() => setNofTrendersListed(nofTrendersListed + 10)}
                        />
                        }
                    </div>}
                </div>}
            </div>
        </div>

    </div>
}