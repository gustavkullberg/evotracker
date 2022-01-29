import styles from './GeneralStatusCard.module.css';
import React from 'react';
import { GameList } from '../GameList/GameList';

export const GeneralStatusCard = ({ stats, setGameShow, athEvents }) => {
    const { aths, topLive, highestMonthlyRelative, highestWeeklyRelative } = stats;

    return <div className={styles.statusContainer}>
        <div className={styles.statusCard}>
            <GameList title="Live" setGameShow={setGameShow} gameList={topLive} maxNbr={topLive.length} isPercentageValue={false} isAthEventList={false} />
            <GameList title="Recent ATH" setGameShow={setGameShow} gameList={athEvents} maxNbr={topLive.length} isPercentageValue={false} isAthEventList={true} />
            <GameList title="All Time Highs" setGameShow={setGameShow} gameList={aths} maxNbr={topLive.length} isPercentageValue={false} isAthEventList={false} />
            <GameList title="Trending Weekly" setGameShow={setGameShow} gameList={highestWeeklyRelative} maxNbr={topLive.length} isPercentageValue={true} isAthEventList={false} />
            <GameList title="Trending Monthly" setGameShow={setGameShow} gameList={highestMonthlyRelative} maxNbr={topLive.length} isPercentageValue={true} isAthEventList={false} />
        </div>
    </div>
}