import nextConnect from 'next-connect';
import middleware from '../../middleware/db';
import type { NextApiResponse } from 'next'
import type { NextApiRequestWithDb } from "../../utils/NextRequestWithDbType"
import { Db } from 'mongodb';
import TimeFilter from '../../utils/timeFIlter';
import { isNDaysAgo } from '../../utils/isNDaysAgo';
import axios from "axios";

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
handler.use(middleware);

export const filterByTime = (a: any, timeFilter: TimeFilter): boolean => {
  if (timeFilter === '1D') {
    return isNDaysAgo(a.timeStamp, 1);
  }
  else if (timeFilter === "7D") {
    return isNDaysAgo(a.timeStamp, 7);
  }
  else if (timeFilter === '10D') {
    return isNDaysAgo(a.timeStamp, 10);
  } else {
    return true;
  }
};

export const timeSeriesCache = {
  expiryTimestamp: null as Date,
  value: null as TimeSeriesEntry[]
};

export const dailyTimeSeriesCache = {
  expiryTimestamp: null as Date,
  value: null
}



const getDailyTimeSeries = async (timeFilter: TimeFilter, db: Db): Promise<any[]> => {
  let arr;
  if (dailyTimeSeriesCache.expiryTimestamp && dailyTimeSeriesCache.expiryTimestamp.valueOf() > Date.now()) {
    arr = dailyTimeSeriesCache.value;
  } else {
    try {
      const { data } = await axios.get(`${process.env.DO_BASE_URL}timeseries/daily`);
      arr = data;
      const now = new Date();
      const expiryTimestamp = new Date(now.getTime() + 1000 * 60 * 5);
      dailyTimeSeriesCache.expiryTimestamp = expiryTimestamp;
      dailyTimeSeriesCache.value = arr;

    } catch (e) {
      console.log(e);
    }
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

const getTimeSeries = async (db: Db): Promise<TimeSeriesEntry[]> => {
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

const getAllTimeSeries = async (timeFilter, db) => {
  const timeFilteredResult = (await getTimeSeries(db))
    .map(ts => {
      return {
        timeStamp: ts.timeStamp,
        value: ts.entry,
      };
    })
    .filter(arr => filterByTime(arr, timeFilter));
  return timeFilteredResult;
};

handler.get(async (req: NextApiRequestWithDb, res: NextApiResponse<any[]>) => {

  const timeFilter: TimeFilter = req.query.timeFilter as TimeFilter
  if (req.query.gameShow) {
    res.setHeader('Cache-Control', 's-maxage=180')
    if (timeFilter === TimeFilter.DAILY_AVG || timeFilter === TimeFilter.DAILY_MAX) {
      return res.json(await getDailyTimeSeries(timeFilter, req.db))
    }
    return res.json(await getAllTimeSeries(timeFilter, req.db));

  } else {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: 'Bad Request' }));
  }
});

export default handler;
