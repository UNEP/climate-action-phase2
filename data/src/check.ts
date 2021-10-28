import co2 from '../output/co2.json';
import co2percapita from '../output/co2percapita.json';
import co2trends from '../output/co2trends.json';
import netzero from '../output/netzero.json';
import countryDictionary from '../input/countryDictionary.json';
import { createLookup } from './util';

const countryLookup = createLookup(countryDictionary, d => d.id, d => d);

function checkCountryDefs(ids: string[])  {
  const missing = ids.filter(id => !countryLookup[id]);
  if (missing.length > 0) {
    console.warn(`Missing ${missing.length} country definitions: ${missing.join(', ')}`);
  }
}

function checkMissingNetzeroCountries() {
  const idnz = new Set(netzero.map(d => d.id));
  const missing = co2.map(d => d.code).filter(id => !idnz.has(id));
  if (missing.length > 0) {
    console.warn(`Missing ${missing.length} countries in netzero data:\n`);
    console.warn(`IDs: ${missing.join(', ')}\n`);
    console.warn(`Names: ${missing.map(id => countryLookup[id].name).join(', ')}\n`);
    ;
  };
}

function checkData() {
  checkCountryDefs(co2.map(d => d.code));
  checkCountryDefs(co2percapita.map(d => d.code));
  checkCountryDefs(co2trends.map(d => d.code));
  checkCountryDefs(netzero.map(d => d.id));

  checkMissingNetzeroCountries();


}

checkData();
