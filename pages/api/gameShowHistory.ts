import nextConnect from 'next-connect';
import type { NextApiResponse } from 'next'
import type { NextApiRequestWithDb } from "../../utils/NextRequestWithDbType"
import TimeFilter from '../../utils/timeFIlter';
import axios from "axios";
import { getStartDateFromTimeFilter } from '../../utils/getStartDateFromTimeFilter';
import { runMiddleware } from '../../middleware/runMiddleware';
import { cors } from '../../middleware/cors';
import { checkReferer } from '../../middleware/referer';

type TimeSeriesEntry = {
  timeStamp: Date
  entry: {
    'Crazy Time': number,
    'Lightning Roulette': number,
    'MONOPOLY Live': number,
    'Mega Ball': number,
    'Dream Catcher': number
  }
}
const handler = nextConnect();

export const timeSeriesCache = {
  expiryTimestamp: null as Date,
  value: null as TimeSeriesEntry[]
};

export const dailyTimeSeriesCache = {
  expiryTimestamp: null as Date,
  value: null
}

const getDailyTimeSeries = async (timeFilter: TimeFilter): Promise<any[]> => {
  let arr;
  if (dailyTimeSeriesCache.expiryTimestamp && dailyTimeSeriesCache.expiryTimestamp.valueOf() > Date.now()) {
    arr = dailyTimeSeriesCache.value;
  } else {
    const { data } = await axios.get(`${process.env.DO_BASE_URL}timeseries/daily`);
    arr = data;
    const now = new Date();
    const expiryTimestamp = new Date(now.getTime() + 1000 * 60 * 5);
    dailyTimeSeriesCache.expiryTimestamp = expiryTimestamp;
    dailyTimeSeriesCache.value = arr;
  }

  if (timeFilter === TimeFilter.DAILY_AVG) {
    return arr.map(m => ({
      timeStamp: m.date,
      value: m.dailyAverages
    }))
  } else if (timeFilter === TimeFilter.DAILY_MAX) {
    return arr.map(m => ({
      timeStamp: m.date,
      value: m.dailyMaxes
    }))
  }
  return arr
}

export const getTimeSeries = async (startDate: Date): Promise<TimeSeriesEntry[]> => {
  const { data } = await axios.get(`${process.env.DO_BASE_URL}timeseries/minutes?startDate=${startDate}`);
  return data;
};

const getAllTimeSeries = async (timeFilter) => {
  const startDate = getStartDateFromTimeFilter(timeFilter);
  const timeFilteredResult = (await getTimeSeries(startDate))
    .map(ts => {
      return {
        timeStamp: ts.timeStamp,
        value: ts.entry,
      };
    })
  return timeFilteredResult;
};

handler.get(async (req: NextApiRequestWithDb, res: NextApiResponse<any[]>) => {
  const timeFilter: TimeFilter = req.query.timeFilter as TimeFilter
  await runMiddleware(req, res, cors)
  checkReferer(req);

  if (req.query.gameShow) {
    res.setHeader('Cache-Control', 's-maxage=180')
    if (timeFilter === TimeFilter.DAILY_AVG || timeFilter === TimeFilter.DAILY_MAX) {
      return res.json(await getDailyTimeSeries(timeFilter))
    }
    return res.json(await getAllTimeSeries(timeFilter));

  } else {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: 'Bad Request' }));
  }
});

export default handler;
