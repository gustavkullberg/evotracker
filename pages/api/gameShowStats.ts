import axios from 'axios';
import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { cors } from '../../middleware/cors';
import { checkReferer } from '../../middleware/referer';
import { runMiddleware } from '../../middleware/runMiddleware';
import { getStartDateFromTimeFilter } from '../../utils/getStartDateFromTimeFilter';
import { NextApiRequestWithDb } from '../../utils/NextRequestWithDbType';
import { getTimeSeries } from './gameShowHistory';


const handler = nextConnect();

type GameShowStatsResponse = {
  livePlayers: number;
  weekAvg: number;
  timeStamp: Date;
  ath: number
  aths?: number[]
}


const getTimeSeriesForGame = async (game: string, startDate) => {
  const { data } = await axios.get(`${process.env.DO_BASE_URL}games/${game}/timeseries/minutes?startDate=${startDate}`);
  return data;
};

const getGameInfos = async () => {
  const { data } = await axios.get(`${process.env.DO_BASE_URL}gameinfos`);
  return data;
}

const getStatsByProp = async (prop: string) => {
  const startDate = getStartDateFromTimeFilter("7D");
  const timeFilteredResult = (await getTimeSeriesForGame(prop, startDate))
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
  const startDate = getStartDateFromTimeFilter("7D");
  const timeFilteredResult = (await getTimeSeries(startDate))
    .map(ts => {
      return {
        timeStamp: ts.timeStamp,
        value: ts.entry,
      };
    });

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

  await runMiddleware(req, res, cors)
  checkReferer(req);

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
