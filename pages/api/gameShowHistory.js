import nextConnect from 'next-connect';
import middleware from '../../middleware/db';

const groupBy = (list, keyGetter) => {
  const map = new Map();
  list.forEach(item => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
};
const collectionName = 'evostats';

const handler = nextConnect();
handler.use(middleware);

const isOneDayAgo = date => {
  const day = 1000 * 60 * 60 * 24;
  const dayAgo = Date.now() - day;
  return new Date(date) > dayAgo;
};

const isSevenDaysAgo = date => {
  const day = 1000 * 60 * 60 * 24 * 7;
  const dayAgo = Date.now() - day;
  return new Date(date) > dayAgo;
};

const filterByTime = (a, timeFilter) => {
  if (timeFilter === '1D') {
    return isOneDayAgo(a.timeStamp);
  } else if (timeFilter === '7D') {
    return isSevenDaysAgo(a.timeStamp);
  } else {
    return true;
  }
};

const sampleByTime = (arr, timeFilter) => {
  if (timeFilter !== 'Daily') {
    return arr;
  }
  const groups = groupBy(arr, x => new Date(x.timeStamp).toISOString().split('T')[0]);
  let newarr = [];

  groups.forEach((g, idx) => {
    newarr.push({
      timeStamp: idx,
      value: Math.max.apply(
        Math,
        g.map(function (o) {
          return o.value;
        })
      ),
    });
  });
  return newarr;
};
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

const getTimeSeriesByProp = async (prop, timeFilter, db) => {
  const timeFilteredResult = (await getTimeSeries(db))
    .map(a => ({ timeStamp: a.timeStamp, value: a.entry[prop] }))
    .filter(arr => filterByTime(arr, timeFilter))
    .filter(a => a.value);

  return sampleByTime(timeFilteredResult, timeFilter);
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

  return sampleByTime(timeFilteredResult, timeFilter);
};

handler.get(async (req, res) => {
  const timeFilter = req.query.timeFilter;
  if (req.query.gameShow) {
    switch (req.query.gameShow) {
      case 'CRAZY_TIME':
        return res.json(await getTimeSeriesByProp('Crazy Time', timeFilter, req.db));
      case 'MONOPOLY':
        return res.json(await getTimeSeriesByProp('MONOPOLY Live', timeFilter, req.db));
      case 'LIGHTNING_ROULETTE':
        return res.json(await getTimeSeriesByProp('Lightning Roulette', timeFilter, req.db));
      case 'MEGA_BALL':
        return res.json(await getTimeSeriesByProp('Mega Ball', timeFilter, req.db));
      case 'DREAM_CATCHER':
        return res.json(await getTimeSeriesByProp('Dream Catcher', timeFilter, req.db));
      case 'SPEED_BACCARAT_A':
        return res.json(await getTimeSeriesByProp('Speed Baccarat A', timeFilter, req.db));
      case 'SPEED_BACCARAT_B':
        return res.json(await getTimeSeriesByProp('Speed Baccarat B', timeFilter, req.db));
      case 'SUPER_SIC_BO':
        return res.json(await getTimeSeriesByProp('Super Sic Bo', timeFilter, req.db));
      case 'LIGHTNING_BACCARAT':
        return res.json(await getTimeSeriesByProp('Lightning Baccarat', timeFilter, req.db));
      case 'ALL_SHOWS':
        return res.json(await getAllTimeSeries(timeFilter, req.db));
      default:
        return res.json(await req.db.collection(collectionName).find().toArray());
    }
  } else {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: 'Bad Request' }));
  }
});

export default handler;
