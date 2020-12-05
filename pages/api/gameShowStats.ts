import { Db } from 'mongodb';
import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import middleware from '../../middleware/db';
import { NextApiRequestWithDb } from '../../utils/NextRequestWithDbType';
import TimeFilter from '../../utils/timeFIlter';
import { timeSeriesCache, filterByTime } from './gameShowHistory';

const collectionName = 'evostats';

const handler = nextConnect();
handler.use(middleware);

type GameShowStatsResponse = {
  livePlayers: number;
  weekAvg: number;
  timeStamp: Date;
}

const getTimeSeries = async (db: Db) => {
  if (timeSeriesCache.expiryTimestamp && timeSeriesCache.expiryTimestamp.valueOf() > Date.now()) {
    return timeSeriesCache.value;
  }
  const arr = await db.collection(collectionName).find().toArray();
  const now = new Date();
  const expiryTimestamp = new Date(now.getTime() + 1000 * 60 * 5);
  timeSeriesCache.expiryTimestamp = expiryTimestamp;

  timeSeriesCache.value = arr;
  return timeSeriesCache.value;
};

const getStatsByProp = async (prop: string, db: Db) => {
  const timeFilteredResult = (await getTimeSeries(db))
    .map(a => ({ timeStamp: a.timeStamp, value: a.entry[prop] }))
    .filter(arr => filterByTime(arr, TimeFilter["7D"]))
    .filter(a => a.value);

  const weekAvg = Math.round(
    timeFilteredResult.reduce((total, obj) => total + obj.value, 0) / timeFilteredResult.length
  );

  return {
    livePlayers: timeFilteredResult[timeFilteredResult.length - 1].value,
    timeStamp: timeFilteredResult[timeFilteredResult.length - 1].timeStamp,
    weekAvg,
  };
};

const getStatsAllGames = async (db: Db): Promise<GameShowStatsResponse> => {
  const timeFilteredResult = (await getTimeSeries(db))
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

  return {
    livePlayers,
    weekAvg,
    timeStamp: timeFilteredResult[timeFilteredResult.length - 1].timeStamp,
  };
};

handler.get(async (req: NextApiRequestWithDb, res: NextApiResponse<GameShowStatsResponse>) => {
  const gameShow = req.query.gameShow;
  if (gameShow) {
    switch (gameShow) {
      case 'CRAZY_TIME':
        return res.json(await getStatsByProp('Crazy Time', req.db));
      case 'MONOPOLY':
        return res.json(await getStatsByProp('MONOPOLY Live', req.db));
      case 'LIGHTNING_ROULETTE':
        return res.json(await getStatsByProp('Lightning Roulette', req.db));
      case 'MEGA_BALL':
        return res.json(await getStatsByProp('Mega Ball', req.db));
      case 'DREAM_CATCHER':
        return res.json(await getStatsByProp('Dream Catcher', req.db));
      case 'SPEED_BACCARAT_A':
        return res.json(await getStatsByProp('Speed Baccarat A', req.db));
      case 'SPEED_BACCARAT_B':
        return res.json(await getStatsByProp('Speed Baccarat B', req.db));
      case 'SUPER_SIC_BO':
        return res.json(await getStatsByProp('Super Sic Bo', req.db));
      case 'LIGHTNING_BACCARAT':
        return res.json(await getStatsByProp('Lightning Baccarat', req.db));
      case 'ALL_SHOWS':
        return res.json(await getStatsAllGames(req.db));
      default: {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: 'Bad Request' }));
      }
    }
  } else {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: 'Bad Request' }));
  }
});

export default handler;
