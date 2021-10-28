import { scaleOrdinal } from './d3';

export const colorNDC = scaleOrdinal<string>()
  .domain(['Nothing submitted','Only INDC','Only First NDC','First 2020 NDC', 'Second 2020 NDC'])
  .range(['#D5D7D9','#A3A4A6','#4A7D94','#1EA3C7', '#1EA3C7']);

export const colorGHG = scaleOrdinal<string>()
  .domain(['Decreased since 1990', 'Stable since 1990', 'Still climbing'])
  .range(['#00AACC','#BEC7CD','#FD7D2E']);

export const colorNetZero = scaleOrdinal<string>()
  .domain([
    'ACHIEVED', 'IN LAW', 'PROPOSED LEGISLATION',
    'IN POLICY DOCUMENT', 'TARGET UNDER DISCUSSION'
  ])
  .range(['#30609e', '#4e8cb7', '#6cb7cf', '#fec200', '#f58c00']);
