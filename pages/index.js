import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { Header, Footer, StatusCard, TimeFilters, GameShowSelection, Chart } from '../components';
import { gameShowTitles, gameShows } from '../constants';

const filters = ['1D', '7D'];

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

  const setShowClick = gs => {
    setGameShow(gs);
    setGameSelectionIsOpen(false);

    fetchTimeSeries(gs, selectedFilter);
    fetchGameStats(gs);
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
          <div>
            <button
              className={styles.gameButton}
              style={{ marginBottom: '3px', boxShadow: 'rgba(0, 0, 0, 0.5) 7px 7px 10px 0px' }}
              onClick={() => setFilterSelectionIsOpen(!filterSelectionIsOpen)}
            >
              {selectedFilter}
              <span style={{ marginLeft: '0.5rem' }}>
                <ion-icon name={filterSelectionIsOpen ? 'chevron-up-outline' : 'chevron-down-outline'} />
              </span>
            </button>

            <div className={styles.buttonDropdown}>
              {filterSelectionIsOpen &&
                filters.map(f =>
                  f !== selectedFilter ? (
                    <button className={styles.gameButton} onClick={() => setFilterClick(f)}>
                      {f}
                    </button>
                  ) : undefined
                )}
            </div>
          </div>

          <div>
            <button
              className={styles.gameButton}
              style={{ marginBottom: '3px', boxShadow: 'rgba(0, 0, 0, 0.5) 7px 7px 10px 0px' }}
              onClick={() => setGameSelectionIsOpen(!gameSelectionIsOpen)}
            >
              {gameShowTitles[selectedGameShow]}
              <span style={{ marginLeft: '0.5rem' }}>
                <ion-icon name={gameSelectionIsOpen ? 'chevron-up-outline' : 'chevron-down-outline'} />
              </span>
            </button>

            <div className={styles.buttonDropdown}>
              {gameSelectionIsOpen &&
                gameShows.map(gs =>
                  gs !== selectedGameShow ? (
                    <button className={styles.gameButton} onClick={() => setShowClick(gs)}>
                      {gameShowTitles[gs]}
                    </button>
                  ) : undefined
                )}
            </div>
          </div>
        </div>
      </div>
      <Chart timeSeries={timeSeries} selectedGameShow={selectedGameShow} selectedFilter={selectedFilter} />
    </div>
  );
}
