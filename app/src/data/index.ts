import { calcBestFitGradient, createLookup, range, Unpacked } from 'src/util';
import percapita from './co2-percapita.carto.json';
import ghg from './co2.carto.json';
import trends from './trends.carto.json';
import ffsubsidies from './subsidies.carto.json';
import trendsNotInCarto from './co2trends-notincarto.json';
import countries from './countryDictionary.json';
import ndc from './ndc.json';
import pew from './pewsurvey.json';
import netzero from './netzero.json';
import co2baseData from 'src/data/co2-latest.json';
import { IS_DEV } from 'src/util/env';
export {default as annotations } from './annotations.json';

export interface TimeseriesDataPoint {
  year: number;
  value: number;
}

type TrendsDataPoint = Unpacked<typeof trends.data>;

const countriesLookup = createLookup(countries, d => d.id, d => d);

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

  const missing = co2baseData.filter(d => !countriesLookup[d.id]).map(d => d.id);
  if (missing.length) {
    console.warn(`Missing country metadata for: ${missing.join(', ')}`);
  }
}

export const START_YEAR = 1970;
export const END_YEAR = 2018;

export function calcGradientFrom(data: TrendsDataPoint, startYear: number, endYear: number) {
  const years = range(startYear, endYear + 1);
  const norm = data.emissions[startYear.toString()];
  const ys = years.map(year => data.emissions[year.toString()] / norm);
  return calcBestFitGradient(years.map((_, i) => i), ys);
}


export const calcGHGCategory = (d: TrendsDataPoint): string => {
  const m = calcGradientFrom(d, 1990, END_YEAR);
  const cutoff = 0.01;
  if (Math.abs(m) <= cutoff) return 'stable';
  else if (m > cutoff) return 'climbing';
  else return 'falling';
};

const ghgCategories: {[id: string]: string} = {};
trends.data.forEach(d => {
  ghgCategories[d.id] = calcGHGCategory(d);
});

const co2trends = [
  ...trends.data.map(d => ({id: d.id, emissions: d.emissions})),
  ...trendsNotInCarto
];

const totalGHG2018 = co2baseData.map(d => d.emissions2018).reduce((a,b) => a + b, 0);

const co2latest = co2baseData.map(d => ({
  ...d,
  name: countriesLookup[d.id].name,
  globalPct: Number((100 * d.emissions2018 / totalGHG2018).toFixed(2))
}));

const ndcLookup = createLookup(ndc, d => d.id, d => d);

const ndcCarto = {
  ...ghg,
  data: ghg.data.map(d => ({
    ...d,
    ndc: {
      status: ndcLookup[d.id]?.status,
      description: ndcLookup[d.id]?.description
    }
  }))
};

export default {
  countries,
  cartoworld: {
    percapita,
    ghg,
    ndc: ndcCarto,
    trends,
    ffsubsidies
  },
  lookups: {
    ndc: ndcLookup,
    netzero: createLookup(netzero, d => d.id, d => d),
    trends: createLookup(co2trends, d => d.id, d => d),
    countries: countriesLookup
  },
  co2latest,
  co2trends,
  pew,
  ghgCategories
};
