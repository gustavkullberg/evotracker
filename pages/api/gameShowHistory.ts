import nextConnect from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next'
import TimeFilter from '../../utils/timeFIlter';
import axios from "axios";
import { getStartDateFromTimeFilter } from '../../utils/getStartDateFromTimeFilter';
import { runMiddleware } from '../../middleware/runMiddleware';
import { cors } from '../../middleware/cors';

type DataPoint = {
  timeStamp: Date
  value: number
}
const handler = nextConnect();

const getDailyTimeSeries = async (game, timeFilter: TimeFilter): Promise<any[]> => {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const { data } = await axios.get(`${process.env.DO_BASE_URL}games/${game}/timeseries/daily`);
  if (timeFilter === TimeFilter.DAILY_AVG) {
    return data.map(m => ({
      timeStamp: m.timeStamp,
      value: m.average
    })).filter(x => !!x.value)
  } else if (timeFilter === TimeFilter.DAILY_MAX) {
    return data.map(m => ({
      timeStamp: m.timeStamp,
      value: m.max
    })).filter(x => !!x.value)
  }

  return data
}

export const getMonthlyTimeSeries = async (game) => {
  const { data } = await axios.get(`${process.env.DO_BASE_URL}games/${game}/timeseries/monthly`);
  return data;
}

export const getTimeSeries = async (game: string, startDate: Date): Promise<DataPoint[]> => {
  const { data } = await axios.get(`${process.env.DO_BASE_URL}games/${game}/timeseries/minutes?startDate=${startDate}`);
  return data;
};

const getAllTimeSeries = async (game, timeFilter) => {
  const startDate = getStartDateFromTimeFilter(timeFilter);
  const timeFilteredResult = (await getTimeSeries(game, startDate))
    .map(ts => {
      return {
        timeStamp: ts.timeStamp,
        value: ts.value,
      };
    }).filter(x => !!x.value)
  return timeFilteredResult;
};

handler.get(async (req: NextApiRequest, res: NextApiResponse<any[]>) => {
  const timeFilter: TimeFilter = req.query.timeFilter as TimeFilter
  await runMiddleware(req, res, cors)

  if (req.query.gameShow) {
    res.setHeader('Cache-Control', 's-maxage=180')
    if (timeFilter === TimeFilter.DAILY_AVG || timeFilter === TimeFilter.DAILY_MAX) {
      return res.json(await getDailyTimeSeries(req.query.gameShow, timeFilter))
    } else if (timeFilter === TimeFilter.MONTHLY_AVG) {
      return res.json(await getMonthlyTimeSeries(req.query.gameShow))
    }
    return res.json(await getAllTimeSeries(req.query.gameShow, timeFilter));

  } else {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: 'Bad Request' }));
  }
});

export default handler;
