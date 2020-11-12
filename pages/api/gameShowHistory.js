import nextConnect from 'next-connect';
import middleware from '../../middleware/db';

const collectionName = 'evostats';

const handler = nextConnect();
handler.use(middleware);

const timeSeriesCache = {
  expiryTimestamp: null,
  value: null,
};

const getTimeSeries = async db => {
  if (timeSeriesCache.expiryTimestamp && timeSeriesCache.expiryTimestamp > Date.now()) {
    return timeSeriesCache.value;
  }
  const arr = await db.collection(collectionName).find().toArray();
  const now = new Date();
  const expiryTimestamp = new Date(now.getTime() + 1000 * 60 * 5);
  timeSeriesCache.expiryTimestamp = expiryTimestamp;

  timeSeriesCache.value = arr;
  return timeSeriesCache.value;
};

const getTimeSeriesByProp = async (prop, db) => {
  return (await getTimeSeries(db)).map(a => ({ timeStamp: a.timeStamp, value: a.entry[prop] }));
};

const getAllTimeSeries = async db => {
  return (await getTimeSeries(db)).map(ts => {
    return {
      timeStamp: ts.timeStamp,
      value: ts.entry,
    };
  });
};

handler.get(async (req, res) => {
  if (req.query.gameShow) {
    switch (req.query.gameShow) {
      case 'CRAZY_TIME':
        return res.json(await getTimeSeriesByProp('Crazy Time', req.db));
      case 'MONOPOLY':
        return res.json(await getTimeSeriesByProp('MONOPOLY Live', req.db));
      case 'LIGHTNING_ROULETTE':
        return res.json(await getTimeSeriesByProp('Lightning Roulette', req.db));
      case 'MEGA_BALL':
        return res.json(await getTimeSeriesByProp('Mega Ball', req.db));
      case 'DREAM_CATCHER':
        return res.json(await getTimeSeriesByProp('Dream Catcher', req.db));
      case 'ALL_SHOWS':
        return res.json(await getAllTimeSeries(req.db));
      default:
        return res.json(await req.db.collection(collectionName).find().toArray());
    }
  } else {
    const entries = await req.db.collection(collectionName).find().toArray();
    res.json(entries);
  }
});

export default handler;
