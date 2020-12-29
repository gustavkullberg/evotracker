import { Db } from 'mongodb';
import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import middleware from '../../middleware/db';
import { NextApiRequestWithDb } from '../../utils/NextRequestWithDbType';

const handler = nextConnect();
handler.use(middleware);

const getGameInfo = async (game: string, db: Db) => {
    const gameInfos = await db.collection("gameInfo").find().toArray();
    const a = gameInfos.find(h => h.game === game)
    if (!a) {
        throw new Error("game not found.")
    }
    return a;
}

handler.post(async (req: NextApiRequestWithDb, res: NextApiResponse<any>) => {
    const { game, email } = JSON.parse(req.body);

    if (!game || !email) {
        throw new Error("cmon man")
    }
    try {
        const a = await getGameInfo(game, req.db);

        if (a.subscribers) {

            if (a.subscribers.find(s => s === email)) {
                return res.json({ status: "ALREADY_SUBSCRIBED" })
            } else {

                const newSubs = [...a.subscribers, email]
                await req.db.collection("gameInfo").updateOne({ game }, {
                    $set:
                        { subscribers: newSubs }
                });
                return res.json({ status: "EMAIL_SUBSCRIBED" })
            }
        } else {
            await req.db.collection("gameInfo").updateOne({ game }, {
                $set:
                    { subscribers: [email] }
            });
            return res.json({ status: "EMAIL_SUBSCRIBED" })

        }
    } catch (e) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: 'Internal Server Error', message: e.message }));
    }
});

export default handler;