import type {CartoRegionData} from '../types';
import {default as sectoralBDData} from './sectoralBDData.json';

const data = {
	sectoralBD : sectoralBDData,
};

function getMockData<DatumType>(dataset) {
    return data[dataset] as DatumType;
}

export const sectoralBD = getMockData<CartoRegionData>('sectoralBD');