import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { StatusCard, Chart, Dropdown } from '../components';
import { gameShowTitles, gameShows } from '../constants';

const filters = ['1D', '7D', 'Daily Avg'];

export default function Home() {
  const [selectedGameShow, setGameShow] = useState('ALL_SHOWS');
  const [gameStats, setGameStats] = useState({});
  const [selectedFilter, setFilter] = useState('1D');
  const [timeSeries, setTimeSeries] = useState([]);
  const [gameSelectionIsOpen, setGameSelectionIsOpen] = useState(false);
  const [filterSelectionIsOpen, setFilterSelectionIsOpen] = useState(false);

  const fetchTimeSeries = (gameShow, filter) => {
    fetch(`api/gameShowHistory?gameShow=${gameShow}&timeFilter=${filter}`)
      .then(response => response.json())
      .then(json => {
        return gameShow === 'ALL_SHOWS'
          ? json.map(j => ({ timeStamp: new Date(j.timeStamp).getTime(), ...j.value }))
          : json.map(j => ({ timeStamp: new Date(j.timeStamp).getTime(), players: j.value }));
      })
      .then(data => setTimeSeries(data));
  };

  const fetchGameStats = gameShow => {
    fetch(`/api/gameShowStats?gameShow=${gameShow}`)
      .then(response => response.json())
      .then(data => setGameStats(data));
  };

  useEffect(() => {
    fetchTimeSeries(selectedGameShow, selectedFilter);
    fetchGameStats(selectedGameShow);
  }, []);

  const setShowClick = gameShowTitle => {
    const gameShowKey = Object.keys(gameShowTitles).find(k => gameShowTitles[k] === gameShowTitle);
    setGameShow(gameShowKey);
    setGameSelectionIsOpen(false);

    fetchTimeSeries(gameShowKey, selectedFilter);
    fetchGameStats(gameShowKey);
  };

  const setFilterClick = f => {
    setFilter(f);
    setFilterSelectionIsOpen(false);
    fetchTimeSeries(selectedGameShow, f);
  };

  return (
    <div className={styles.card}>
      <StatusCard selectedGameShow={selectedGameShow} gameStats={gameStats} />
      <div className={styles.selectionContainer}>
        <div className={styles.gameButtonContainer}>
          <Dropdown
            label={selectedFilter}
            options={filters}
            isOpen={filterSelectionIsOpen}
            setClick={setFilterClick}
            setIsOpen={setFilterSelectionIsOpen}
          ></Dropdown>
          <Dropdown
            label={gameShowTitles[selectedGameShow]}
            options={gameShows.map(gs => gameShowTitles[gs])}
            isOpen={gameSelectionIsOpen}
            setClick={setShowClick}
            setIsOpen={setGameSelectionIsOpen}
          ></Dropdown>
        </div>
      </div>
      <Chart timeSeries={timeSeries} selectedGameShow={selectedGameShow} selectedFilter={selectedFilter} />
    </div>
  );
}
