import fs from 'fs';
import * as aq from 'arquero';
import path from 'path';
import trendsCarto from '../../app/src/data/trends.carto.json';
import { createLookup } from './util';

const ROOT_DIR = path.join(__dirname, '../..');

const outputJSONData = (fullPath: string, data: any, msg = 'Saving') => {
  const dataStr = JSON.stringify(data, null, 2);
  console.log(`${msg} -> ${fullPath}`);
  fs.writeFileSync(path.join(ROOT_DIR, fullPath), dataStr);
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

  outputJSONData('data/output/carto/co2trends-all.json', co2trendsMapped);
  outputJSONData('data/output/carto/co2-all.json', co2Mapped);
  outputJSONData('data/output/carto/co2percapita-all.json', co2percapitaMapped);

  const co2pcLookup = createLookup(co2percapitaMapped, d => d.id, d => d);
  const co2latest = co2Mapped.map(d => ({
    ...d,
    percapita2018: co2pcLookup[d.id].emissions2018
  }));

  outputJSONData('app/src/data/co2-latest.json', co2latest);


  const idsInTrendsCartoData = new Set(trendsCarto.data.map(d => d.id));
  const trendsDataNotInCarto = co2trendsMapped
    .filter(d => !idsInTrendsCartoData.has(d.id))
    .map( d=> ({id: d.id, emissions: d.emissions}));
    outputJSONData(
      'app/src/data/co2trends-notincarto.json',
      trendsDataNotInCarto,
      `Trends data for ${trendsDataNotInCarto.length} countries not in carto dataset`
    );
}

processCO2();
