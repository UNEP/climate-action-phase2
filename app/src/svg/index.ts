import arrowRight from './arrow-right.svg';
import arrowLeft from './arrow-left.svg';

import dataSource from './icons_data-source.svg';
import embed from './icons_embed.svg';

import data from './icons_data.svg';

import whatshappeningMain from './icons_whats-happening--main.svg';
import whatshappeningOcean from './icons_whats-happening--ocean.svg';
import whatshappeningFire from './icons_whats-happening--fire.svg';
import whatshappeningSurface from './icons_whats-happening--surface.svg';

import stateoftheclimateMain from './icons_state-of-the-climate--main.svg';
import stateoftheclimateEmissions from './icons_state-of-the-climate--total-emissions.svg';
import stateoftheclimatePerCapita from './icons_state-of-the-climate--per-capita.svg';
import stateoftheclimateTrends from './icons_state-of-the-climate--trends.svg';

import climateActionProgressMain from './icons_climate-action-progress--main.svg';
import climateActionProgressNdc from './icons_climate-action-progress--ndc.svg';
import climateActionProgressOpinion from './icons_climate-action-progress--opinion.svg';

import legendLand from './legend_land-anomaly.svg';
import legendSea from './legend_sea-temperature.svg';


const icons = {
  dataSource,
  embed,
  arrows: {
    right: arrowRight,
    left: arrowLeft
  },

  data,

  stateoftheclimate: {
    main: stateoftheclimateMain,
    emissions: stateoftheclimateEmissions,
    percapita: stateoftheclimatePerCapita,
    trends: stateoftheclimateTrends
  },
  whatshappening: {
    main: whatshappeningMain,
    ocean: whatshappeningOcean,
    fire: whatshappeningFire,
    surface: whatshappeningSurface,
  },
  climateactionprogress: {
    main: climateActionProgressMain,
    ndc: climateActionProgressNdc,
    opinion: climateActionProgressOpinion
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
  console.log(iconStr);
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
