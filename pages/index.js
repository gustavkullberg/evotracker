import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { Header } from '../components/Header';
import { XAxis, YAxis, Tooltip, AreaChart, Area, Text, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import moment from 'moment';
import { isMobile } from 'react-device-detect';

const gameShows = ['ALL_SHOWS', 'CRAZY_TIME', 'MONOPOLY', 'LIGHTNING_ROULETTE', 'MEGA_BALL', 'DREAM_CATCHER'];

const gameShowTitles = {
  ALL_SHOWS: 'All Shows',
  CRAZY_TIME: 'Crazy Time',
  MONOPOLY: 'Monopoly',
  LIGHTNING_ROULETTE: 'Lightning Roulette',
  MEGA_BALL: 'Mega Ball',
  DREAM_CATCHER: 'Dream Catcher',
};

export default function Home() {
  const [selectedGameShow, setGameShow] = useState('ALL_SHOWS');
  const [, setFilter] = useState('1D');

  const [timeSeries, setTimeSeries] = useState([]);

  useEffect(() => {
    fetch(`api/gameShowHistory?gameShow=${selectedGameShow}`)
      .then(response => response.json())
      .then(json => {
        return selectedGameShow === 'ALL_SHOWS'
          ? json.map(j => ({ timeStamp: new Date(j.timeStamp).getTime(), ...j.value }))
          : json.map(j => ({ timeStamp: new Date(j.timeStamp).getTime(), players: j.value }));
      })
      .then(data => setTimeSeries(data));
  }, []);

  const setShowClick = gs => {
    setGameShow(gs);

    fetch(`api/gameShowHistory?gameShow=${gs}`)
      .then(response => response.json())
      .then(json => {
        return gs === 'ALL_SHOWS'
          ? json.map(j => ({ timeStamp: new Date(j.timeStamp).getTime(), ...j.value }))
          : json.map(j => ({ timeStamp: new Date(j.timeStamp).getTime(), players: j.value }));
      })
      .then(data => setTimeSeries(data));
  };

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.card}>
        <div className={styles.gameTiles}>
          {gameShows.map((gs, idx) => (
            <div key={idx}>
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
            <AreaChart data={timeSeries} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <XAxis
                dataKey="timeStamp"
                domain={['auto', 'auto']}
                name="Time"
                tickFormatter={unixTime => moment(unixTime).format('HH:mm, Do MMM')}
                type="number"
                scale="time"
              />
              <CartesianGrid stroke="#2c3e50" vertical={false} strokeDasharray="6 6" />
              <YAxis
                type="number"
                orientation="left"
                domain={[0, 'auto']}
                tickFormatter={tick => {
                  return `${tick / 1000}k`;
                }}
              />
              <defs>
                <linearGradient id="evoblack" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="25%" stopColor="150d0a" stopOpacity={0.8} />
                  <stop offset="99%" stopColor="150d0a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip labelFormatter={time => `${moment(time).format('HH:mm, Do MMM')}`} />
              {selectedGameShow === 'ALL_SHOWS' && <Legend iconType="square" height={36} />}

              <Area type="monotone" dataKey="Crazy Time" stackId="1" stroke="brown" fill="brown" name="Crazy Time" />
              <Area
                type="monotone"
                dataKey="Lightning Roulette"
                stackId="1"
                stroke="#cc9900"
                fill="#cc9900"
                name="Roulette"
              />
              <Area
                type="monotone"
                dataKey="MONOPOLY Live"
                stackId="1"
                stroke="#18bc9c"
                fill="#18bc9c"
                name="Monopoly"
              />
              <Area type="monotone" dataKey="Mega Ball" stackId="1" stroke="#3498db" fill="#3498db" name="Mega Ball" />
              <Area
                type="monotone"
                dataKey="Dream Catcher"
                stackId="1"
                stroke="black"
                fill="150d0a"
                name="Dream Catcher"
              />

              {selectedGameShow !== 'ALL_SHOWS' && (
                <Area type="monotone" dataKey="players" stroke="black" fill="url(#evoblack)" />
              )}
            </AreaChart>
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
        <a href="https://livecasino.williamhill.com/en-gb/game-shows" target="_blank" rel="noopener noreferrer">
          <h5>Data source: William Hill</h5>
        </a>
        <h5>By Gustav Kullberg</h5>
      </div>
    </div>
  );
}
