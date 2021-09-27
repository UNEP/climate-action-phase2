import ghg from '../input/ghg.json';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.join(__dirname, '../output');

const outputJSONData = (filename: string, data: any) => {
  const dataStr = JSON.stringify(data, null, 2);
  const outfile = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(outfile, dataStr);
}

const mapped = ghg.map(row => ({
  code: row.code,
  emissions2015: row.emissions['2015']
}))

outputJSONData('ghg.json', mapped);
