<script lang="ts" context="module">
  import type { TimeseriesDataPoint } from 'src/data';
  import type { CartogramConstructor, InputDataPoint } from "./CartogramTypes";
  import * as d3 from 'src/d3';
  import { clamp, displayVal, range } from "src/util";
  import { CartogramDataPoint } from "./CartogramTypes";

  export type TrendsInputDataPoint<VK extends string> = InputDataPoint<VK> & {
    emissions: {[year: number]: number};
  }

  const startYear = 1970;
  const endYear = 2015;
  const years = range(startYear, endYear+1);

  export class TrendsCartogramDataPoint<VK extends string, IDP extends TrendsInputDataPoint<VK> = TrendsInputDataPoint<VK>> extends CartogramDataPoint<VK, IDP> {
    timeseries: TimeseriesDataPoint[];
    _path: string;

    constructor(input: CartogramConstructor<TrendsCartogramDataPoint<VK, IDP>>) {
      super(input);
      this.timeseries = years.map(year => ({
        year, value: input.data.emissions[year]
      }));

    }

    private generatePath(): string {
      const yVals = this.timeseries.map(d => d.value);
      const maxVal = Math.max(...yVals);
      const minVal = 0;
      const range = maxVal - minVal;
      const padding = range / 6;
      const y = d3.scaleLinear()
        .domain([minVal - padding, maxVal + padding])
        .range([ this.height, 0 ]);

      const x = d3.scaleLinear()
          .domain([startYear, endYear+1])
          .range([ 0, this.width ]);

      const pathGenerator = d3.line<TimeseriesDataPoint>()
        .x(d => x(d.year))
        .y(d => y(d.value));

      return pathGenerator(this.timeseries);

    }

    get path(): string {
      if (!this._path) {
        this._path = this.generatePath();
      }
      return this._path;
    }

    get color(): string {
      return 'transparent';
    }

    get category(): string {
      const baseValue = this.data.emissions['1990'];
      const lastValue = this.data.emissions['2015'];
      const diff = (lastValue - baseValue) / baseValue;
      // 0 means the same. 0.5 means 50% increase. 1 means 100% increase. etc
      if (Math.abs(diff) < 0.25) return 'stable';
      else if (diff < -0.25) return 'falling';
      else return 'climbing-fast';
    }

    get emissionsDisplayVal(): string {
      const val = this.data.emissions[endYear];
      return displayVal(val, val < 10 ? 1 : 0);
    }

  }


</script>

<script lang="ts">
  import MiniLineChart from "../charts/MiniLineChart.svelte";
	import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  type VK = $$Generic<string>;

  export let d: TrendsCartogramDataPoint<VK>;
  export let canvasWidth: number;
  export let canvasHeight: number;
  let activeChart = false;

  const onClickCountry = () => {
    if(!activeChart) activeChart = true
  };

  const onMouseLeaveCountry = evt => {
    activeChart = false;
    dispatch('mouseleave', evt);
  };

</script>

<div
  class="country testing {d.classes}"
  style={d.style}
  data-code={d.id}
  tabindex="0"
  on:mouseenter
  on:mouseleave={onMouseLeaveCountry}
  on:focus
  on:blur
  on:click={onClickCountry}
>

  <div class="hover-chart"
    class:hover-chart--active={activeChart}
    style="top: {clamp(0, 90 - d.top, canvasHeight - d.top - 90)}px; left: {clamp(0, 135 - d.left, canvasWidth - d.left - 135)}px;" >
      <div class="hover-chart__header">
        <h3 class="hover-chart__name">{d.name}</h3>
        <h3 class='hover-chart__emissions'>{d.emissionsDisplayVal} Mt</h3>
      </div>
      <MiniLineChart data={d.timeseries} category={d.category} />
  </div>

  <svg viewBox="0 0 {d.width} {d.height}">
    <path class="line stroke--{d.category}" d={d.path} />
  </svg>
</div>

<style lang="scss">

  svg {
    background: #eaeaea;
    stroke-width: 1.5px;
    position: absolute;
    left: 50%;
    top: 50%;
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    transform: translate(-50%, -50%);
    box-shadow: 0px 0px 0px 0px #00000018;
    transition: width 50ms, height 50ms, box-shadow 50ms;
    pointer-events: none;
    .country:hover & {
      transition: width 100ms, height 100ms, box-shadow 100ms;
      box-shadow: 0px 0px 8px 1px #00000040;
      width: 200%;
      height: 200%;
    }
  }

  .line {
    fill: none;
    vector-effect: non-scaling-stroke;
    pointer-events: none;
  }

  .country {
    position: absolute;
    cursor: pointer;
    opacity: 1;
    z-index: 2;
    padding: 2px;
    transition: top 0.2s, left 0.2s, width 0.2s, height 0.2s, background-color 0.2s, opacity 0.45s ease 0.15s;
    will-change: opacity, background-color, border-radius;
    background: grey;
    outline-color: black;
    &:hover {
      z-index: 10;
    }
  }

  .country-text {
    color: white;
    font-weight: 400;
    font-size: .85rem;
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    width: min(100%, 50px);
    margin: auto;
    transform: translateY(-50%);
    text-align: center;
  }

  .country--hide {
    opacity: 0.5;
  }

  .country--shadow {
    box-shadow: 0 3px 10px rgb(0 0 0 / 0.4);
  }

  :global(.cartogram-resizing) .country {
    transition: none;
  }

  @keyframes growcountry {
    0% {
      transform: scale(1);
      transform-origin: 50% 50%;
      box-shadow: 0px 0px 0px 0px #00000018;
    }
    25% {
      transform: scale(2);
      transform-origin: 50% 50%;
      box-shadow: 0px 0px 4px 1px #00000055;
    }
    100% {
      transform: scale(2);
      transform-origin: 50% 50%;
      box-shadow: 0px 0px 4px 1px #00000055;
    }
  }

  @keyframes grow {
    from {
      transform: translate(-50%, -50%) scale(0.3);
      transform-origin: 50% 50%;
    }
    to {
      transform: translate(-50%, -50%) scale(1);
      transform-origin: 50% 50%;
    }
  }

  @keyframes appear {
    to {
      visibility: visible;
    }
  }

  @keyframes raise {
    from {
      box-shadow: 0px 0px 0px 0px #00000018;
    }
    to {
      box-shadow: 0px 0px 15px 0px #00000018;
    }
  }

  .hover-chart {
    position: absolute;
    width: 250px;
    box-sizing: border-box;
    pointer-events: none;
    background: #EAEAEA;
    padding: 8px;
    padding-bottom: 4px;
    border: 1px solid #E7E7E7;
    z-index: 3;
    visibility: hidden;

    .country:hover & {
      animation:
        appear 0s ease 300ms 1 normal forwards,
        grow 80ms ease 300ms 1 normal forwards,
        raise 80ms ease 300ms 1 normal forwards;
    }

  }

  .hover-chart__header {
    > * {
      margin: 0;
      font-size: 14px;
    }
    display: flex;
  }
  .hover-chart__name {
    font-weight: 700;
  }

  .hover-chart__emissions {
    font-weight: 300;
    text-align: right;
    flex-grow: 1;
    white-space: nowrap;
  }

  .hover-chart--active {
    pointer-events: all;
  }

</style>