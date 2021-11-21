import nextConnect from 'next-connect';
import type { NextApiResponse } from 'next'
import type { NextApiRequestWithDb } from "../../utils/NextRequestWithDbType"
import TimeFilter from '../../utils/timeFIlter';
import axios from "axios";
import { getStartDateFromTimeFilter } from '../../utils/getStartDateFromTimeFilter';
import { runMiddleware } from '../../middleware/runMiddleware';
import { cors } from '../../middleware/cors';

type TimeSeriesEntry = {
  timeStamp: Date
  entry: Record<string, number>
}
const handler = nextConnect();

const getDailyTimeSeries = async (timeFilter: TimeFilter): Promise<any[]> => {
  const { data } = await axios.get(`${process.env.DO_BASE_URL}timeseries/daily`);

  if (timeFilter === TimeFilter.DAILY_AVG) {
    return data.map(m => ({
      timeStamp: m.date,
      value: m.dailyAverages
    }))
  } else if (timeFilter === TimeFilter.DAILY_MAX) {
    return data.map(m => ({
      timeStamp: m.date,
      value: m.dailyMaxes
    }))
  }

  return data
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
