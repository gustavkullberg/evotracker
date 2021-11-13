import axios from 'axios';
import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { NextApiRequestWithDb } from '../../utils/NextRequestWithDbType';
import TimeFilter from '../../utils/timeFIlter';
import { timeSeriesCache, filterByTime } from './gameShowHistory';


const handler = nextConnect();

type GameShowStatsResponse = {
  livePlayers: number;
  weekAvg: number;
  timeStamp: Date;
  ath: number
  aths?: number[]
}

const getTimeSeries = async () => {
  if (timeSeriesCache.expiryTimestamp && timeSeriesCache.expiryTimestamp.valueOf() > Date.now()) {
    return timeSeriesCache.value;
  }

  const now = new Date();
  const { data } = await axios.get(`${process.env.DO_BASE_URL}timeseries/minutes`);
  const arr = data;
  const expiryTimestamp = new Date(now.getTime() + 1000 * 60 * 5);
  timeSeriesCache.expiryTimestamp = expiryTimestamp;

  timeSeriesCache.value = arr;
  return timeSeriesCache.value;
};


const getTimeSeriesForGame = async (game: string) => {
  const { data } = await axios.get(`${process.env.DO_BASE_URL}games/${game}/timeseries/minutes`);
  return data;
};


const getGameInfos = async () => {
  const { data } = await axios.get(`${process.env.DO_BASE_URL}gameinfos`);
  return data;
}

const getStatsByProp = async (prop: string) => {
  const timeFilteredResult = (await getTimeSeriesForGame(prop))
    .filter(arr => filterByTime(arr, TimeFilter["7D"]))
    .filter(a => a.value);

  const weekAvg = Math.round(
    timeFilteredResult.reduce((total, obj) => total + obj.value, 0) / timeFilteredResult.length
  );
  const infos = await getGameInfos();
  const currentGame = infos.find(i => i.game === prop);

  return {
    livePlayers: timeFilteredResult[timeFilteredResult.length - 1].value,
    timeStamp: timeFilteredResult[timeFilteredResult.length - 1].timeStamp,
    weekAvg,
    ath: currentGame.ath,
    aths: infos.map(i => ({ ...i.ath, game: i.game })).sort((a, b) => b.value - a.value).filter(i => i.game !== "All Shows")
  };
};

const getStatsAllGames = async (): Promise<GameShowStatsResponse> => {
  const timeFilteredResult = (await getTimeSeries())
    .map(ts => {
      return {
        timeStamp: ts.timeStamp,
        value: ts.entry,
      };
    })
    .filter(arr => filterByTime(arr, TimeFilter["7D"]));

  const weekAvg = Math.round(
    timeFilteredResult.reduce((total, obj) => {
      const summedPLayers = Object.values(obj.value).reduce((res2, obj2) => res2 + obj2, 0);
      if (!summedPLayers) {
        return total;
      }
      return total + summedPLayers;
    }, 0) / timeFilteredResult.length
  );

  const livePlayers = Object.values(timeFilteredResult[timeFilteredResult.length - 1].value).reduce(
    (res, obj) => res + obj,
    0
  );
  const infos = await getGameInfos();
  const currentGame = infos.find(i => i.game === "All Shows");
  return {
    livePlayers,
    weekAvg,
    timeStamp: timeFilteredResult[timeFilteredResult.length - 1].timeStamp,
    ath: currentGame.ath,
    aths: infos.map(i => ({ ...i.ath, game: i.game })).sort((a, b) => b.value - a.value).filter(i => i.game !== "All Shows")
  };
};

handler.get(async (req: NextApiRequestWithDb, res: NextApiResponse<GameShowStatsResponse>) => {
  const gameShow = req.query.gameShow as string;
  if (gameShow) {
    res.setHeader('Cache-Control', 's-maxage=180')
    switch (gameShow) {
      case 'All Shows':
        return res.json(await getStatsAllGames());
      default:
        return res.json(await getStatsByProp(gameShow))
    }
  } else {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ status: 'Bad Request' }));
  }
});

export default handler;
