import { default as percapita } from './percapita.carto.json';
import { default as ghg } from './ghg.carto.json';
import { default as trends } from './trends.carto.json';
import { default as countries } from './countryDictionary.json';
export {default as annotations } from './annotations.json';

export interface TimeseriesDataPoint {
  year: number;
  value: number;
}

export const START_YEAR = 1970;
export const END_YEAR = 2015;

const top10emitters = new Set([
  ...ghg.data
    .sort((a,b) => b.emissions2015 - a.emissions2015)
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



export default {
  countries,
  cartoworld: {
    percapita,
    ghg,
    trends
  },
  top10emitters,
  top10drops
};
