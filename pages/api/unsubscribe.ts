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
    try {
        if (!game || !email) {
            throw new Error("cmon man")
        }
        const gameInfo = await getGameInfo(game, req.db);

        if (gameInfo.subscribers) {
            const index = gameInfo.subscribers.indexOf(email);
            if (index > -1) {
                gameInfo.subscribers.splice(index, 1);

                await req.db.collection("gameInfo").updateOne({ game }, {
                    $set:
                        { subscribers: gameInfo.subscribers }
                });
                return res.json({ status: "EMAIL_UNSUBSCRIBED" })

            } else {
                return res.json({ status: "EMAIL_NOT_SUBSCRIBED" })
            }
        } else {
            console.log("nothing here")
            return res.json({ status: "NO_SUBSCRIBERS" })
        }
    } catch (e) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: 'Internal Server Error', message: e.message }));
    }
});

export default handler;