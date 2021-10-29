import fs from 'fs';
import * as aq from 'arquero';
import path from 'path';
import countryDict from '../input/countryDictionary.json';
import netzeroRaw from '../input/netzero-raw.json';
import trendsCarto from '../../app/src/data/trends.carto.json';

const OUTPUT_DIR = path.join(__dirname, '../output');

const outputJSONData = (filename: string, data: any, msg = 'Saving') => {
  const dataStr = JSON.stringify(data, null, 2);
  const outfile = path.join(OUTPUT_DIR, filename);
  console.log(`${msg} -> ${filename}`);
  fs.writeFileSync(outfile, dataStr);
}

function processCO2() {

  const co2_totals = fs.readFileSync(path.resolve(__dirname, '../input/co2-totals.csv'));
  const co2_percapita = fs.readFileSync(path.resolve(__dirname, '../input/co2-percapita.csv'));


  const foldData = (csv, not, as) => {
    const data = aq.fromCSV(String(csv))
      .fold(aq.not(not), {as:as});

    return data.objects();
  }

  const folded_co2_totals = foldData(co2_totals, ['id', 'country_name'], ['year', 'emissions']);
  const folded_co2_percapita = foldData(co2_percapita, ['id', 'country_name'], ['year', 'emissions']);

  const co2Mapped = folded_co2_totals
    .filter(d => d.year === '2018')
    .map(d => ({id: d.id, emissions2018: d.emissions}));

  const co2percapitaMapped = folded_co2_percapita
    .filter(d => d.year === '2018')
    .map(d => ({id: d.id, emissions2018: d.emissions}));

  const co2trendsMapped = [...new Set(folded_co2_totals.map(d => d.id))]
    .map(d => (
      {
        id: d,
        size: 1,
        emissions: Object.fromEntries(
          folded_co2_totals
            .filter(_d => _d.id === d)
            .map(d => [d.year, d.emissions])
        )
      }
    ));


  outputJSONData('co2-all.json', co2Mapped);
  outputJSONData('co2trends-all.json', co2trendsMapped);
  outputJSONData('co2percapita-all.json', co2percapitaMapped);

  const idsInTrendsCartoData = new Set(trendsCarto.data.map(d => d.id));
  const trendsDataNotInCarto = co2trendsMapped
    .filter(d => !idsInTrendsCartoData.has(d.id))
    .map( d=> ({id: d.id, emissions: d.emissions}));
  outputJSONData('co2trends-missing.json', trendsDataNotInCarto, `Trends data for ${trendsDataNotInCarto.length} countries not in carto dataset`);
}

function processNetZero() {

  console.log('Processing Netzero dataset...');

  let out = [];

  const OVERRIDES = {
    'SOUTH KOREA': 'KOR',
    'UAE': 'ARE',
    'DOMINICAN REPUBLIC': 'DOM',
    'LAOS': 'LAO',
    'VATICAN CITY': 'VAT',
    'THE NETHERLANDS': 'NLD',
    'DEMOCRATIC REPUBLIC OF CONGO': 'COD',
    'CENTRAL AFRICAN REPUBLIC': 'CAF',
  };

  Object.entries(netzeroRaw).forEach(([status, countries]) => {
    Object.entries(countries).forEach(([_nzname, year]) => {
      const re = new RegExp(_nzname, 'i');
      const id = OVERRIDES[_nzname] || countryDict.find(({name}) => re.exec(name))?.id;
      if (id) {
        out.push({ id, year, status });
      } else {
        console.warn(`Missing country data for: ${_nzname}`);
      }
    });
  });
  outputJSONData('netzero.json', out, `NZ data for ${out.length} countries`);
}

processNetZero();
processCO2();
