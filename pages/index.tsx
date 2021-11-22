import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { StatusCard, Dropdown, LineChart } from "../components";
import TimeFilter from "../utils/timeFIlter";
import { Bars } from "../components/BarChart";
import { GeneralStatusCard } from "../components/GeneralStatusCard/GeneralStatusCard";
import { WeekChart } from "../components/WeekChart/WeekChart";

const filters = ["1D", "10D", "Daily Avg", "Daily Max"];

export default function Home(): JSX.Element {
  const [selectedGameShow, setGameShow] = useState("Crazy Time");
  const [gameStats, setGameStats] = useState({ ath: 1, livePlayers: 1, ma30: 1, dotWStats: [], isLoaded: false });
  const [stats, setStats] = useState({ highestMonthlyRelative: [], topLive: [], aths: [] });
  const [selectedFilter, setFilter] = useState("1D");
  const [timeSeries, setTimeSeries] = useState([]);
  const [gameSelectionIsOpen, setGameSelectionIsOpen] = useState(false);
  const [filterSelectionIsOpen, setFilterSelectionIsOpen] = useState(false);
  const [isFetchingTimeSeries, setIsFetchingTimeSeries] = useState(false);

  const fetchTimeSeries = (gameShow, filter) => {
    setIsFetchingTimeSeries(true);
    fetch(`api/gameShowHistory?gameShow=ALL_SHOWS&timeFilter=${filter}`)
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

  useEffect(() => {
    fetchTimeSeries(selectedGameShow, selectedFilter);
    fetchGameStats(selectedGameShow);
    fetchStats();
  }, []);

  const setShowClick = (gameShowTitle) => {
    setGameShow(gameShowTitle);
    setGameSelectionIsOpen(false);
    fetchGameStats(gameShowTitle);
  };

  const setFilterClick = (f: TimeFilter) => {

    setFilter(f);
    setFilterSelectionIsOpen(false);
    fetchTimeSeries(selectedGameShow, f);
  };

  const extractGameShowList = () => {
    const games = timeSeries && timeSeries.length > 0 && Object.keys(timeSeries[timeSeries.length - 1].value);
    return games;
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
            selectedFilter === TimeFilter.DAILY_AVG || selectedFilter === TimeFilter.DAILY_MAX ? <Bars timeSeries={timeSeries.map((j) => {
              return {
                timeStamp: new Date(j.timeStamp).getTime(),
                players: Math.round(j.value[selectedGameShow]),
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
                    Object.values(j.value).reduce((res2: number, obj2: number) => res2 + obj2, 0) : j.value[selectedGameShow],
                }
              }).filter(f => f.players)}
                selectedFilter={selectedFilter}
                isFetchingTimeSeries={isFetchingTimeSeries}
              />
          }
        </div>
        <WeekChart data={gameStats.dotWStats} />
      </div>
      <GeneralStatusCard setGameShow={setShowClick} stats={stats} />
    </div>
  );
}
