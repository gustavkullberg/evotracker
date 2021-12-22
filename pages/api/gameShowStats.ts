import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { cors } from '../../middleware/cors';
import { runMiddleware } from '../../middleware/runMiddleware';


const handler = nextConnect();

type GameShowStatsResponse = {
  topLive: any[],
  aths: any[],
  highestMonthlyRelative: any[],
}

const fetchStats = async () => {
  const { data } = await axios.get(`${process.env.DO_BASE_URL}stats`);
  return data;
}

const getStats = async () => {
  const { topLive, athList, highestMonthlyRelative, highestWeeklyRelative, highestQuarterlyRelative } = await fetchStats();

  return {
    topLive,
    aths: athList,
    highestMonthlyRelative,
    highestWeeklyRelative,
    highestQuarterlyRelative
  };
};


handler.get(async (req: NextApiRequest, res: NextApiResponse<GameShowStatsResponse>) => {
  await runMiddleware(req, res, cors)
  res.setHeader('Cache-Control', 's-maxage=180')
  return res.json(await getStats())
});

export default handler;
