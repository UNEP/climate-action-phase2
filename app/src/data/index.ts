import { default as percapita } from './percapita.carto.json';
import { default as ghg } from './ghg.carto.json';
import { default as trends } from './trends.carto.json';
import { default as countries } from './countryDictionary.json';
import { default as ndc } from './ndc.carto.json';
import { default as pew } from './pewsurvey.json';
export {default as annotations } from './annotations.json';

export interface TimeseriesDataPoint {
  year: number;
  value: number;
}

export default {
  countries,
  cartoworld: {
    percapita,
    ghg,
    ndc,
    trends,
  },
  pew,
  endYear: 2015
};
