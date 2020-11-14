import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { Header } from '../components/Header';
import { XAxis, YAxis, Tooltip, AreaChart, Area, Text, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import moment from 'moment';
import { isMobile } from 'react-device-detect';

const gameShows = [
  'ALL_SHOWS',
  'CRAZY_TIME',
  'MONOPOLY',
  'LIGHTNING_ROULETTE',
  'MEGA_BALL',
  'DREAM_CATCHER',
  'SPEED_BACCARAT_A',
  'SPEED_BACCARAT_B',
  'SUPER_SIC_BO',
  'LIGHTNING_BACCARAT',
];

const baccrats = [];
const filters = ['1D', '7D'];

const gameShowTitles = {
  ALL_SHOWS: 'All Shows',
  CRAZY_TIME: 'Crazy Time',
  MONOPOLY: 'Monopoly',
  LIGHTNING_ROULETTE: 'Lightning Roulette',
  MEGA_BALL: 'Mega Ball',
  DREAM_CATCHER: 'Dream Catcher',
  SPEED_BACCARAT_A: 'Speed Baccarat A',
  SPEED_BACCARAT_B: 'Speed Baccarat B',
  SUPER_SIC_BO: 'Super Sic Bo',
  LIGHTNING_BACCARAT: 'Lightning Baccarat',
};

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
        <div className={styles.statusContiner}>
          <div className={styles.statusCard}>
            <h1>{gameShowTitles[selectedGameShow]}</h1>
            <div className={styles.statusProp}>
              <p>Live Players</p>
              <h4>{gameStats.livePlayers}</h4>
            </div>

            <div className={styles.statusProp}>
              <p>Avg. Players, 7 Days</p>
              <h4>{gameStats.weekAvg}</h4>
            </div>

            <p>{gameStats.timeStamp && new Date(gameStats.timeStamp).toLocaleString()}</p>
          </div>
        </div>
        <div className={styles.gameTiles}>
          {gameShows.map((gs, idx) => (
            <div key={idx}>
              <h5
                style={{
                  backgroundColor: selectedGameShow === gs ? '#1b2631' : 'white',
                  color: selectedGameShow === gs ? 'white' : '#1b2631',
                }}
                onClick={() => setShowClick(gs)}
              >
                {gameShowTitles[gs]}
              </h5>
            </div>
          ))}
        </div>

        {timeSeries.length > 0 ? (
          <ResponsiveContainer width="96%" height={isMobile ? 400 : 700}>
            <AreaChart data={timeSeries} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <XAxis
                dataKey="timeStamp"
                domain={['auto', 'auto']}
                name="Time"
                tickFormatter={unixTime => {
                  if (selectedFilter === '1D') return moment(unixTime).format('HH:mm');
                  else if (selectedFilter === '7D') return moment(unixTime).format('Do MMM');
                  else if (selectedFilter === 'Daily') return moment(unixTime).format("MMM'YY");
                }}
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
                  <stop offset="25%" stopColor="#1b2631" stopOpacity={0.8} />
                  <stop offset="99%" stopColor="#1b2631" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip labelFormatter={time => `${moment(time).format('HH:mm, Do MMM')}`} />
              {selectedGameShow === 'ALL_SHOWS' && <Legend iconType="square" height={36} />}
              {selectedGameShow === 'ALL_SHOWS' && (
                <Area type="monotone" dataKey="Crazy Time" stackId="1" stroke="brown" fill="brown" name="Crazy Time" />
              )}{' '}
              {selectedGameShow === 'ALL_SHOWS' && (
                <Area
                  type="monotone"
                  dataKey="Lightning Roulette"
                  stackId="1"
                  stroke="#cc9900"
                  fill="#cc9900"
                  name="Roulette"
                />
              )}
              {selectedGameShow === 'ALL_SHOWS' && (
                <Area
                  type="monotone"
                  dataKey="MONOPOLY Live"
                  stackId="1"
                  stroke="#18bc9c"
                  fill="#18bc9c"
                  name="Monopoly"
                />
              )}
              {selectedGameShow === 'ALL_SHOWS' && (
                <Area
                  type="monotone"
                  dataKey="Mega Ball"
                  stackId="1"
                  stroke="#a991d4"
                  fill="#a991d4"
                  name="Mega Ball"
                />
              )}
              {selectedGameShow === 'ALL_SHOWS' && (
                <Area
                  type="monotone"
                  dataKey="Dream Catcher"
                  stackId="1"
                  stroke="#3498db"
                  fill="#3498db"
                  name="Dream Catcher"
                />
              )}
              {selectedGameShow === 'ALL_SHOWS' && (
                <Area
                  type="monotone"
                  dataKey="Speed Baccarat A"
                  stackId="1"
                  stroke="#000000"
                  fill="#000000"
                  name="Speed Baccarat A"
                />
              )}
              {selectedGameShow === 'ALL_SHOWS' && (
                <Area
                  type="monotone"
                  dataKey="Speed Baccarat B"
                  stackId="1"
                  stroke="#1a1a1a"
                  fill="#1a1a1a"
                  name="Speed Baccarat B"
                />
              )}
              {selectedGameShow === 'ALL_SHOWS' && (
                <Area
                  type="monotone"
                  dataKey="Lightning Baccarat"
                  stackId="1"
                  stroke="#333333"
                  fill="#333333"
                  name="Lightning Baccarat"
                />
              )}
              {selectedGameShow === 'ALL_SHOWS' && (
                <Area
                  type="monotone"
                  dataKey="Super Sic Bo"
                  stackId="1"
                  stroke="#4d4d4d"
                  fill="#4d4d4d"
                  name="Super Sic Bo"
                />
              )}
              {selectedGameShow !== 'ALL_SHOWS' && (
                <Area type="monotone" dataKey="players" stroke="black" fill="url(#evoblack)" />
              )}
            </AreaChart>
          </ResponsiveContainer>
        ) : undefined}

        <div className={styles.filterTilesContainer}>
          <div className={styles.filterTiles}>
            {filters.map((f, idx) => (
              <div key={idx}>
                <h4
                  style={{
                    backgroundColor: selectedFilter === f ? '#1b2631' : 'white',
                    color: selectedFilter === f ? 'white' : '#1b2631',
                  }}
                  onClick={() => setFilterClick(f)}
                >
                  {f}
                </h4>
              </div>
            ))}
          </div>
        </div>
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
