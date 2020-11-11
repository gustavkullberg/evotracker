import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { Header } from '../components/Header';
import { XAxis, YAxis, Tooltip, LineChart, Line, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import { isMobile } from 'react-device-detect';

const gameShows = ['CRAZY_TIME', 'MONOPOLY', 'LIGHTNING_ROULETTE', 'MEGA_BALL', 'DREAM_CATCHER'];

const filters = ['1D', '1W', '1M'];

const gameShowTitles = {
  CRAZY_TIME: 'Crazy Time',
  MONOPOLY: 'Monopoly',
  LIGHTNING_ROULETTE: 'Lightning Roulette',
  MEGA_BALL: 'Mega Ball',
  DREAM_CATCHER: 'Dream Catcher',
};

export default function Home() {
  const [selectedGameShow, setGameShow] = useState('CRAZY_TIME');
  const [selectedFilter, setFilter] = useState('1D');

  const [timeSeries, setTimeSeries] = useState([]);

  useEffect(() => {
    fetch(`api/gameShowHistory?gameShow=${selectedGameShow}`)
      .then(response => response.json())
      .then(json => json.map(j => ({ timeStamp: new Date(j.timeStamp).getTime(), players: j.value })))
      .then(data => setTimeSeries(data));
  }, []);

  const setShowClick = gs => {
    setGameShow(gs);

    fetch(`api/gameShowHistory?gameShow=${gs}`)
      .then(response => response.json())
      .then(json => json.map(j => ({ timeStamp: new Date(j.timeStamp).getTime(), players: j.value })))
      .then(data => setTimeSeries(data));
  };

  const setFilterClick = f => {
    setFilter(f);
  };

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.card}>
        <div className={styles.gameTiles}>
          {gameShows.map(gs => (
            <div>
              {gs === selectedGameShow ? (
                <h4 onClick={() => setShowClick(gs)}>{gameShowTitles[gs]}</h4>
              ) : (
                <h5 onClick={() => setShowClick(gs)}>{gameShowTitles[gs]}</h5>
              )}
            </div>
          ))}
        </div>

        {timeSeries.length > 0 ? (
          <ResponsiveContainer width="95%" height={isMobile ? 300 : 700}>
            <LineChart data={timeSeries} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <XAxis
                dataKey="timeStamp"
                domain={['auto', 'auto']}
                name="Time"
                tickFormatter={unixTime => moment(unixTime).format('HH:mm Do')}
                type="number"
                scale="time"
              />
              <YAxis
                type="number"
                domain={[0, 'auto']}
                tickFormatter={tick => {
                  return `${tick / 1000}k`;
                }}
              />
              <Tooltip
                position={{ x: 'auto', y: 0 }}
                formatter={(value, name, props) => `${value}  ${name}`}
                labelFormatter={time => `${moment(time).format('HH:mm Do')}`}
              />
              <Line type="monotone" dataKey="players" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        ) : undefined}

        {/* <div className={styles.gameTiles}>
          {filters.map(f => (
            <div>
              {f === selectedFilter ? (
                <h4 onClick={() => setFilterClick(f)}>{f}</h4>
              ) : (
                <h5 onClick={() => setFilterClick(f)}>{f}</h5>
              )}
            </div>
          ))}
        </div> */}
      </div>

      <div className={styles.footer}>
        <h5>By Gustav Kullberg</h5>
        <a href="https://livecasino.williamhill.com/en-gb/game-shows" target="_blank" rel="noopener noreferrer">
          <h5>Data source: William Hill</h5>
        </a>
      </div>
    </div>
  );
}
