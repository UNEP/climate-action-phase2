import arrowRight from './arrow-right.svg';
import arrowLeft from './arrow-left.svg';
import arrowDown from './arrow-down.svg';

import dataSource from './icons_data-source.svg';
import embed from './icons_embed.svg';

import data from './icons_data.svg';

import whatshappeningMain from './icons_whats-happening--main.svg';
import whatshappeningOcean from './icons_whats-happening--ocean.svg';
import whatshappeningFire from './icons_whats-happening--fire.svg';
import whatshappeningSurface from './icons_whats-happening--surface.svg';

import searchTable from './icons_search-table.svg';
import climateActionProgressNZT from './icons_climate-action-progress--nzt.svg';
import climateActionProgressSubsidies from './icons_climate-action-progress--ffsubsidies.svg';

import stateoftheclimateMain from './icons_state-of-the-climate--main.svg';
import stateoftheclimateEmissions from './icons_state-of-the-climate--total-emissions.svg';
import stateoftheclimatePerCapita from './icons_state-of-the-climate--per-capita.svg';
import stateoftheclimateTrends from './icons_state-of-the-climate--trends.svg';

import climateActionProgressMain from './icons_climate-action-progress--main.svg';
import climateActionProgressNdc from './icons_climate-action-progress--ndc.svg';
import climateActionProgressOpinion from './icons_climate-action-progress--opinion.svg';

import adaptationMain from './adapt-main.svg';
import adaptation2 from './adapt-2.svg';
import adaptation3 from './adapt-3.svg';
import adaptation4 from './adapt-4.svg';

import legendLand from './legend_land-anomaly.svg';
import legendSea from './legend_sea-temperature.svg';


const icons = {
  dataSource,
  embed,
  arrows: {
    right: arrowRight,
    left: arrowLeft,
    down: arrowDown
  },

  data,

  stateoftheclimate: {
    main: stateoftheclimateMain,
    emissions: stateoftheclimateEmissions,
    percapita: stateoftheclimatePerCapita,
    trends: stateoftheclimateTrends,
    searchtable:searchTable
  },
  whatshappening: {
    main: whatshappeningMain,
    ocean: whatshappeningOcean,
    fire: whatshappeningFire,
    surface: whatshappeningSurface,
    searchtable:searchTable
  },
  climateactionprogress: {
    nzt: climateActionProgressNZT,
    main: climateActionProgressMain,
    ndc: climateActionProgressNdc,
    ffsubsidies: climateActionProgressSubsidies,
    opinion: climateActionProgressOpinion
  },
  adaptationprogress: {
    main: adaptationMain,
    second: adaptation2,
    third: adaptation3,
    fourth: adaptation4,
  },
  legends: {
    land: legendLand,
    sea: legendSea
  }
};

export const alignment = {
//   pm25: 'transform: translateY(-7%)',
//   sectors: 'transform: translateY(-8%)',
};

export const getIcon = (iconStr: string): string => {
  // fetches nested icons using dot notation
  // e.g: "menu.data" -> icons['menu']['data']
  type Icons = string | {[id: string]: Icons};
  const _getIcon = (cur: Icons, ...args: string[]) => {
    const [next, ...rest] = args;
    if (rest.length === 0) return cur[next] || '?';
    else {
      const args: [Icons, ...string[]] = [cur[next], ...rest];
      return _getIcon(...args);
    }
  };

  return _getIcon(icons, ...iconStr.split('.'));
};


export default icons;
