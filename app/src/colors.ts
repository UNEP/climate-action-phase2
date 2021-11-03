import { scaleOrdinal } from './d3';

export const colorNDC = scaleOrdinal<string>()
  .domain(['Nothing submitted','Only INDC','Only First NDC','First 2020 NDC', 'Second 2020 NDC'])
  .range(['#DAE0E6','#BEC7CD','#6fa1d9','#4574b8', '#004a97']);

export const colorGHG = scaleOrdinal<string>()
  .domain(['falling', 'stable', 'climbing'])
  .range(['#4574b8','#BEC7CD','#f5a14c']);

export const colorNetZero = scaleOrdinal<string>()
  .domain([
    'Achieved (self-declared)', 'In law', 'In policy document',
    'Declaration / pledge', 'Proposed / in discussion', ''
  ])
  .range(['#004a97', '#4574b8', '#6fa1d9', '#ffcf61', '#f5a14c', '#BEC7CD']);
