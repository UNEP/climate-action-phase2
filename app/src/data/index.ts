import { createLookup, Unpacked } from 'src/util';
import percapita from './co2-percapita-2019.carto.json';
import ghg from './co2-2019.carto.json';
import trends from './trends.carto.json';
import trendsNotInCarto from './co2trends-notincarto.json';
import countries from './countryDictionary.json';
import ndc from './ndc.carto.json';
import pew from './pewsurvey.json';
import netzero from './netzero.json';
import co2baseData from 'src/data/co2data.json';
import { IS_DEV } from 'src/util/env';
export {default as annotations } from './annotations.json';

export interface TimeseriesDataPoint {
  year: number;
  value: number;
}

export const START_YEAR = 1970;
export const END_YEAR = 2015;

const top10emitters = new Set([
  ...ghg.data
    .sort((a,b) => b.emissions2019 - a.emissions2019)
    .slice(0, 10)
    .map(d => d.id)
]);

const top10drops = new Set([
  ...trends.data
    .map(d => ({
      id: d.id,
      drop: (d.emissions[END_YEAR] - d.emissions['1990']) / d.emissions['1990']
    }))
    .sort((a,b) => a.drop - b.drop)
    .slice(0, 10)
    .map(d => d.id)
]);

type TrendsDataPoint = Unpacked<typeof trends.data>;

export const calcGHGCategory = (d: TrendsDataPoint): string => {
  const { emissions } = d;
  const baseValue = emissions['1990'];
  const lastValue = emissions[ Object.keys(emissions)[Object.keys(emissions).length - 1] ];
  const diff = (lastValue - baseValue) / baseValue;
  // 0 means the same. 0.5 means 50% increase. 1 means 100% increase. etc
  if (Math.abs(diff) < 0.25) return 'stable';
  else if (diff < -0.25) return 'falling';
  else return 'climbing';
};

const ghgCategories: {[id: string]: string} = {};
trends.data.forEach(d => {
  ghgCategories[d.id] = calcGHGCategory(d);
});

const countriesLookup = createLookup(countries, d => d.id, d => d);

const co2trends = [
  ...trends.data.map(d => ({id: d.id, emissions: d.emissions})),
  ...trendsNotInCarto
];

const totalGHG2019 = co2baseData.map(d => d.emissions2019).reduce((a,b) => a + b, 0);

const co2data = co2baseData.map(d => ({
  ...d,
  name: countriesLookup[d.id].name,
  globalPct: Number((d.emissions2019 / totalGHG2019).toFixed(2))
}));

if (IS_DEV) {
  // check data
  const trendsLookup = createLookup(trends.data, d => d.id, d => d);
  const missingTrends = new Set([
    ...ghg.data.map(d => d.id).filter(id => !trendsLookup[id]),
    ...percapita.data.map(d => d.id).filter(id => !trendsLookup[id])
  ]);
  if (missingTrends.size > 0) {
    const countries = [...missingTrends].join(', ');
    console.warn(`Missing trends data for: ${countries}`);
  }
}

export default {
  countries,
  cartoworld: {
    percapita,
    ghg,
    ndc,
    trends,
  },
  lookups: {
    netzero: createLookup(netzero, d => d.id, d => d),
    trends: createLookup(co2trends, d => d.id, d => d),
    countries: countriesLookup
  },
  co2data,
  co2trends,
  top10emitters,
  top10drops,
  pew,
  ghgCategories
};
