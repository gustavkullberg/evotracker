import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { cors } from '../../middleware/cors';
import { runMiddleware } from '../../middleware/runMiddleware';

interface Event {
    type: string
    timeStamp: Date
}

interface AthEvent extends Event {
    game: string
    value: number
}

const handler = nextConnect();

const getAthEvents = async (): Promise<AthEvent[]> => {
    const { data } = await axios.get(`${process.env.DO_BASE_URL}events/allTimeHighs`);

    return data.map(d => ({ game: d.game, value: d.players, timeStamp: d.timeStamp, type: "All time High" }));
}


handler.get(async (req: NextApiRequest, res: NextApiResponse<any>) => {
    await runMiddleware(req, res, cors)
    res.setHeader('Cache-Control', 's-maxage=180')
    return res.json(await getAthEvents())
});

export default handler;
