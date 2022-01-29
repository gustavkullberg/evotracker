import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { StatusCard, Dropdown, LineChart } from "../components";
import TimeFilter from "../utils/timeFIlter";
import { Bars } from "../components/BarChart";
import { GeneralStatusCard } from "../components/GeneralStatusCard/GeneralStatusCard";
import { WeekChart } from "../components/WeekChart/WeekChart";
import { useRouter } from 'next/router'
import { replaceAll } from "../utils/replaceAll";


const filters = ["1D", "10D", "Daily Avg", "Daily Max", "Monthly Avg"];

export default function Home(): JSX.Element {
    const [selectedGameShow, setGameShow] = useState("");
    const [gameStats, setGameStats] = useState({ ath: 1, livePlayers: 1, ma30: 1, dotWStats: [], dotMStats: [], isLoaded: false, game: "" });
    const [stats, setStats] = useState({ highestMonthlyRelative: [], topLive: [], aths: [] });
    const [selectedFilter, setFilter] = useState("1D");
    const [timeSeries, setTimeSeries] = useState([]);
    const [events, setEvents] = useState([]);
    const [gameSelectionIsOpen, setGameSelectionIsOpen] = useState(false);
    const [filterSelectionIsOpen, setFilterSelectionIsOpen] = useState(false);
    const [isFetchingTimeSeries, setIsFetchingTimeSeries] = useState(false);
    const router = useRouter();

    const game = replaceAll(router.query.game?.toString(), "_", " ");
    const format = replaceAll(router.query.format?.toString(), "_", " ");


    const fetchTimeSeries = (gameShow, filter) => {
        setIsFetchingTimeSeries(true);
        fetch(`api/gameShowHistory?gameShow=${gameShow}&timeFilter=${filter}`)
            .then((response) => response.json())
            .then((data) => {
                setTimeSeries(data)
                setIsFetchingTimeSeries(false);
            }).catch(() => setIsFetchingTimeSeries(false))
    };

    const fetchStats = () => {
        fetch(`/api/gameShowStats`)
            .then((response) => response.json())
            .then((data) => setStats(data)
            );
    }

    const fetchGameStats = (gameShow) => {
        fetch(`/api/games/${gameShow}/stats`)
            .then((response) => response.json())
            .then((data) => {
                setGameStats(data)
            });
    };

    const fetchEvents = () => {
        fetch(`/api/events`)
            .then((response) => response.json())
            .then((data) => {
                setEvents(data)
            });
    }

    useEffect(() => {
        if (game == undefined) { return; }
        const validatedFilter = filters.includes(format) ? format : selectedFilter;
        setFilter(validatedFilter);
        setGameShow(game);
        fetchTimeSeries(game, validatedFilter);
        fetchGameStats(game);
        fetchStats();
        fetchEvents();
    }, [router.query]);

    const setShowClick = (gameShowTitle) => {
        router.query.game = replaceAll(gameShowTitle, " ", "_")
        router.push(router);
        setGameSelectionIsOpen(false);
    };

    const setFilterClick = (f: TimeFilter) => {
        router.query.format = replaceAll(f, " ", "_");
        router.push(router);
        setFilterSelectionIsOpen(false);
    };

    const extractGameShowList = () => {
        return stats.topLive?.map(s => s.game) || [""];
    }

    return (
        <div className={styles.card}>
            <div style={{ width: "100%" }}>
                <StatusCard selectedGameShow={selectedGameShow} gameStats={gameStats} />

                <div className={styles.selectionContainer}>
                    <div className={styles.gameButtonContainer}>
                        <Dropdown
                            label={selectedFilter}
                            options={filters}
                            isOpen={filterSelectionIsOpen}
                            setClick={setFilterClick}
                            setIsOpen={setFilterSelectionIsOpen}
                            hasFilter={false}
                        />
                        <Dropdown
                            label={selectedGameShow}
                            options={extractGameShowList()}
                            isOpen={gameSelectionIsOpen}
                            setClick={setShowClick}
                            setIsOpen={setGameSelectionIsOpen}
                            hasFilter={true}
                        />
                    </div>
                </div>
                <div >
                    {
                        selectedFilter === TimeFilter.DAILY_AVG || selectedFilter === TimeFilter.DAILY_MAX || selectedFilter === TimeFilter.MONTHLY_AVG ? <Bars timeSeries={timeSeries.map((j) => {
                            return {
                                timeStamp: new Date(j.timeStamp).getTime(),
                                players: j.value ? Math.round(j.value) : 0,
                            }
                        }).filter(f => f.players)}
                            selectedFilter={selectedFilter}
                            isFetchingTimeSeries={isFetchingTimeSeries}
                            selectedGameShow={selectedGameShow} />
                            :
                            <LineChart timeSeries={timeSeries.map((j) => {
                                return {
                                    timeStamp: new Date(j.timeStamp).getTime(),
                                    players: selectedGameShow === "All Shows" ?
                                        Object.values(j.value).reduce((res2: number, obj2: number) => res2 + obj2, 0) : j.value,
                                }
                            }).filter(f => f.players)}
                                selectedFilter={selectedFilter}
                                isFetchingTimeSeries={isFetchingTimeSeries}
                            />
                    }
                </div>
                <WeekChart data={gameStats.dotWStats} game={gameStats.game} />
            </div>
            <GeneralStatusCard setGameShow={setShowClick} stats={stats} athEvents={events} />
        </div>
    );
}
