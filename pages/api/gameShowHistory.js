import nextConnect from 'next-connect';
import middleware from '../../middleware/db';
import { groupBy } from '../../utils/groupBy';
import { isOneDayAgo } from '../../utils/isOneDayAgo';
import { isSevenDaysAgo } from '../../utils/isSevenDaysAgo';

const collectionName = 'evostats';

const handler = nextConnect();
handler.use(middleware);

const mapToMovingAverage = (arr, maIdx) => {
  const res1 = arr.map((a, idx) => {
    const minIndex = idx - maIdx >= 0 ? idx - maIdx : 0;
    const slicedArr = arr.slice(minIndex, idx);
    return {
      timeStamp: a.timeStamp,
      value: a.value,
      maValue: Math.round(slicedArr.reduce((total, obj) => total + obj.value, 0) / (idx - minIndex)),
    };
  });
  return res1;
};

export const filterByTime = (a, timeFilter) => {
  if (timeFilter === '1D') {
    return isOneDayAgo(a.timeStamp);
  } else if (timeFilter === '7D') {
    return isSevenDaysAgo(a.timeStamp);
  } else {
    return true;
  }
};

const sampleByTime = (arr, timeFilter, isAggregatedView = false) => {
  if (isAggregatedView && timeFilter === 'Daily Max') {
    const summedArr = arr.map(a => ({
      timeStamp: a.timeStamp,
      value: Object.values(a.value).reduce((tot, obj) => tot + obj, 0),
    }));
    const groups = groupBy(summedArr, x => new Date(x.timeStamp).toISOString().split('T')[0]);

    const res = [];
    groups.forEach(g => {
      const hej = g.reduce(
        (total, obj) => {
          if (obj.value > total.value) {
            return obj;
          }
          return total;
        },
        { value: 0 }
      );
      res.push(hej);
    });
    const timeStampsToCheck = res.map(r => r.timeStamp);
    return arr.filter(a => timeStampsToCheck.includes(a.timeStamp));
  }
  if (isAggregatedView && timeFilter === 'Daily Avg') {
    const groups = groupBy(arr, x => new Date(x.timeStamp).toISOString().split('T')[0]);
    const resArr = [];
    groups.forEach((g, idx) => {
      const value = g.reduce((tot, obj) => {
        Object.keys(obj.value).forEach(key => {
          tot[key] = obj.value[key] / g.length + (tot[key] ?? 0);
        });
        return tot;
      }, {});
      const roundedValues = Object.keys(value).reduce((tot, key) => {
        tot[key] = Math.round(value[key]);
        return tot;
      }, {});
      resArr.push({ timeStamp: idx, value: roundedValues });
    });
    return resArr;
  }

  if (timeFilter === 'Daily Max') {
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
  }

  if (timeFilter === 'Daily Avg') {
    const groups = groupBy(arr, x => new Date(x.timeStamp).toISOString().split('T')[0]);
    let newarr = [];
    groups.forEach((g, idx) => {
      newarr.push({
        timeStamp: idx,
        value: Math.round(g.reduce((total, obj) => total + obj.value, 0) / g.length),
      });
    });
    return newarr;
  }
  return arr;
};

export const timeSeriesCache = {
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

  return sampleByTime(timeFilteredResult, timeFilter, true);
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
