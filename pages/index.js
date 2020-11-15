import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { Header, Footer, StatusCard, Chart, TimeFilters, GameShowSelection } from '../components';

export default function Home() {
  const [selectedGameShow, setGameShow] = useState('ALL_SHOWS');
  const [gameStats, setGameStats] = useState({});
  const [selectedFilter, setFilter] = useState('7D');
  const [timeSeries, setTimeSeries] = useState([]);

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
    fetchTimeSeries(gs, selectedFilter);
    fetchGameStats(gs);
  };

  const setFilterClick = f => {
    setFilter(f);
    fetchTimeSeries(selectedGameShow, f);
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.card}>
        <StatusCard selectedGameShow={selectedGameShow} gameStats={gameStats} />
        <GameShowSelection selectedGameShow={selectedGameShow} setShowClick={setShowClick} />
        <Chart timeSeries={timeSeries} selectedGameShow={selectedGameShow} selectedFilter={selectedFilter} />
        <TimeFilters setFilterClick={setFilterClick} selectedFilter={selectedFilter} />
      </div>
      <Footer />
    </div>
  );
}
