import { default as percapita } from './percapita.carto.json';
import { default as ghg } from './ghg.carto.json';
import { default as countries } from './countryDictionary.json';

export default {
  countries,
  cartoworld: {
    percapita,
    ghg
  },
  endYear: 2015
};
