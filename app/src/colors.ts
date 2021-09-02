import { scaleOrdinal, scaleThreshold } from 'd3-scale';

export const colorSectors = scaleOrdinal<string>()
  .domain([
    'windblowndust','residential','intlshipping','transport','commercial','industry','afciddust',
    'othercombustion','remainingsources','otherfires','agrwasteburning','agriculture',
    'waste','solvents','energy'
  ])
  .range([
    '#faba26','#407aa9','#9b7ccc','#811494','#ff9c9c','#ab4867','#b3b3b3','#8c8c8c','#666666',
    '#333333','#62b048','#1b6e29','#bd8e71','#854f38','#ff8a18'
  ]);

export const colorFuels = scaleOrdinal<string>()
  .domain(['process','liquid','solidbio','coal'])
  .range(['#407aa9','#faba26','#62b048','#333333']);

export const colorPM25 = scaleThreshold<number, string>()
  .domain([...new Array(7)].map((d,i) => (i + 1) * 10))
  .range(['#ffbeb3','#eda6ac','#dc8ea5','#ca769e','#b85f97','#a5468f','#932b88','#800080']);

export const colorHealth = scaleThreshold<number, string>()
  .domain([10,20,30,40,50,60,70,80,100])
  .range([
    '#facc6e', '#f3b670', '#eaa073', '#de8b75', '#d07877',
    '#bf6578', '#ac557a', '#95477c', '#7a3b7f', '#583382'
  ]);

export const colorPolices = scaleOrdinal<string>()
  .domain(['Target met', 'On track', 'Not met', 'No data'])
  .range(['#0074B2', '#5A93B4', '#ffffaa', '#cacaca']);
