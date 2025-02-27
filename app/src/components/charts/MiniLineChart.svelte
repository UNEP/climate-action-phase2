<script lang="ts">
  import type { TimeseriesDataPoint } from 'src/data';
  import * as d3 from 'src/d3';
  import { clamp, displayVal } from 'src/util';

  export let data: TimeseriesDataPoint[];
  export let stroke: string = 'black';
  export let width = 200 * 1.5;
  export let height = 125 * 1.5;

  const axisHeight = 25;
  const topPadding = height * 0.2;

  let chartWidth = width;
  let chartHeight = height - axisHeight - topPadding;

  const startYear = data[0].year;
  const endYear = data[data.length - 1].year;

  let hoverInfo: { data: TimeseriesDataPoint, x: number, y: number, valStr: string };

  $: x = d3.scaleLinear()
    .domain([startYear, endYear])
    .range([ 0, chartWidth ]);

  $: y = d3.scaleLinear()
    .domain([0, Math.max(...data.map(d => d.value))])
    .range([ chartHeight, 0 ]);

  $: linePath = d3.line<TimeseriesDataPoint>().x(d => x(d.year)).y(d => y(d.value))(data);

  function onMouseMove(event: MouseEvent & { currentTarget: EventTarget & SVGRectElement }) {
    const { width } = event.currentTarget.getBoundingClientRect();
    const { offsetX } = event;
    const p = offsetX / width;
    const closestYear = Math.round(x.invert(p * chartWidth));
    const d = data.find(d => d.year === closestYear);
    hoverInfo = {
      data: d,
      x: x(d.year),
      y: y(d.value),
      valStr: `${displayVal(d.value)} Mt`
    };
  }

</script>

<div class="chart-container">
  <svg viewBox="0 0 {width} {height}">

    <g class="x-axis" transform="translate(0, {y(0) + topPadding})">
      <line class="x-axis-line" x1={x(startYear)} x2={x(endYear)} y1="0" y2="0" />
      <text class="x-axis-text x-axis-text--min" y="6">{startYear}</text>
      <text class="x-axis-text x-axis-text--max" x={x(endYear)} y="6">{endYear}</text>
    </g>

    <g transform="translate(0, {topPadding})">
      <path class="line" {stroke} d={linePath}></path>
    </g>

    {#if hoverInfo}
    <g transform="translate(0, {topPadding})">
      <line class="hover-line" x1={hoverInfo.x} x2={hoverInfo.x} y1={hoverInfo.y} y2={y(0)} />
      <circle class="hover-circle" r="4" cx={hoverInfo.x} cy={hoverInfo.y} />

      <text
        class="hover-year"
        x={clamp(hoverInfo.x, 24, width - 24)}
        y={y(0) + 2 + (hoverInfo.y > 75 ? 18 : -5)}
      >{hoverInfo.data.year}</text>

      <text
        class="hover-value"
        x={clamp(hoverInfo.x, hoverInfo.valStr.length * 5.5, width - hoverInfo.valStr.length * 5.5)}
        y={Math.min(70, hoverInfo.y - 10)}
      >{hoverInfo.valStr}</text>
  </g>
  {/if}

  <rect class="mouse-rect" width={width} height={height - axisHeight}
    on:mousemove={onMouseMove} on:mouseout={() => hoverInfo = null} />

</svg>

</div>

<style>
  svg {
    display: block;
  }

  .mouse-rect {
    fill: transparent;
    cursor: none;
  }
  .hover-line {
    stroke-width: 1;
    stroke: #D7DFE5;
  }

  .hover-circle {
    stroke-width: 2;
    stroke: black;
    fill: none;
  }

  .hover-year {
    text-anchor: middle;
    fill: #555555;
    font-size: 20px;
    stroke: #f3f3f3;
    stroke-width: 5px;
    paint-order: stroke;
  }

  .hover-value {
    text-anchor: middle;
    dominant-baseline: bottom;
    fill: #555555;
    font-weight: bold;
    font-size: 20px;
    stroke: #f3f3f3;
    stroke-width: 3px;
    paint-order: stroke;
  }

  .line {
    fill: none;
    stroke-width: 3;
  }

  .x-axis-line {
    stroke-width: 1;
    stroke: #D7DFE5;
    shape-rendering: crispEdges;
  }

  .x-axis-text {
    font-weight: 100;
    fill: #999;
    dominant-baseline: hanging;
    font-size: 16px;
    font-weight: 400;
  }

  .x-axis-text--min {
    text-anchor: start;
  }
  .x-axis-text--max {
    text-anchor: end;
  }

</style>