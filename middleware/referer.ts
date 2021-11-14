import { NextApiRequest } from "next";

export const checkReferer = (req: NextApiRequest) => {
    if (req.headers["referer"] != process.env.REFERER) {
        throw Error(":)");
    }
};