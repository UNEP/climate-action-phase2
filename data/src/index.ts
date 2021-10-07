import ghg from '../input/ghg.json';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.join(__dirname, '../output');

const outputJSONData = (filename: string, data: any) => {
  const dataStr = JSON.stringify(data, null, 2);
  const outfile = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(outfile, dataStr);
}

const ghgMapped = ghg.map(row => ({
  code: row.code,
  emissions2015: row.emissions['2015']
}))

const trendsMapped = ghg.map(row => ({
  code: row.code,
  size: 1,
  emissions: row.emissions
}))


outputJSONData('ghg.json', ghgMapped);
outputJSONData('trends.json', trendsMapped);
