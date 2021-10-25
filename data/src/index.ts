import ghg from '../input/ghg.json';
import fs from 'fs';
import * as aq from 'arquero';
import path from 'path';
import _ from 'underscore';

const OUTPUT_DIR = path.join(__dirname, '../output');

const co2_totals = fs.readFileSync(path.resolve(__dirname, '../input/co2-totals.csv'));
const co2_percapita = fs.readFileSync(path.resolve(__dirname, '../input/co2-percapita.csv'));

const outputJSONData = (filename: string, data: any) => {
  const dataStr = JSON.stringify(data, null, 2);
  const outfile = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(outfile, dataStr);
}

const foldData = (csv, not, as) => {
  const data = aq.fromCSV(String(csv))
    .fold(aq.not(not), {as:as});

  return data.objects();
}

const folded_co2_totals = foldData(co2_totals, ['id', 'country_name'], ['year', 'emissions']);
const folded_co2_percapita = foldData(co2_percapita, ['id', 'country_name'], ['year', 'emissions']);

const co2Mapped = folded_co2_totals
  .filter(d => d.year === '2019')
  .map(d => ({code: d.id, emissions2019: d.emissions}));

const co2percapitaMapped = folded_co2_percapita
  .filter(d => d.year === '2019')
  .map(d => ({code: d.id, emissions2019: d.emissions}));

const co2trendsMapped = [...new Set(folded_co2_totals.map(d => d.id))]
  .map(d => (
    {
      code: d,
      size: 1,
      emissions: Object.fromEntries(
        folded_co2_totals
          .filter(_d => _d.id === d)
          .map(d => [d.year, d.emissions])
      )  
    }
  ))

outputJSONData('co2.json', co2Mapped);
outputJSONData('co2trends.json', co2trendsMapped);
outputJSONData('co2percapita.json', co2percapitaMapped);
