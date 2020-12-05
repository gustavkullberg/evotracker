import { Db } from "mongodb";
import { NextApiRequest } from "next";

export type NextApiRequestWithDb = NextApiRequest & {
    db: Db;
}