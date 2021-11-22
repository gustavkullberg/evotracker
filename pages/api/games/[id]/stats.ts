import axios from 'axios';
import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { cors } from '../../../../middleware/cors';
import { runMiddleware } from '../../../../middleware/runMiddleware';
import { NextApiRequestWithDb } from '../../../../utils/NextRequestWithDbType';


const handler = nextConnect();

const fetchStats = async (game) => {
    const { data } = await axios.get(`${process.env.DO_BASE_URL}games/${game}/stats`);
    return data;
}

const getStats = async (game: string) => {
    const { ath, livePlayers, ma7, ma30, ma90, rank } = await fetchStats(game);
    return {
        ath: ath.value,
        athDate: ath.timeStamp,
        livePlayers: livePlayers.value,
        liveTimeStamp: livePlayers.timeStamp,
        ma7: ma7.value,
        ma7Delta: ma7.delta,
        ma30: ma30.value,
        ma30Delta: ma30.delta,
        ma90: ma90.value,
        ma90Delta: ma90.delta,
        rank: rank
    };
};


handler.get(async (req: NextApiRequestWithDb, res: NextApiResponse<any>) => {
    const id = req.query.id as string;
    await runMiddleware(req, res, cors)

    if (id) {
        res.setHeader('Cache-Control', 's-maxage=180')
        return res.json(await getStats(id))
    } else {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ status: 'Bad Request' }));
    }
});

export default handler;