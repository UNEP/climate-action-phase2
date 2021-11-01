<script lang="ts">
  import type {CountryDataSquare} from 'src/components/CountryTable.svelte';
  import { createLookup } from "src/util";
  import { scaleThreshold } from 'd3-scale';
  import RiskSVG from 'src/assets/risk.svg';

  export var selectedCountry: string;
  export var data: CountryDataSquare[];
  export var width : number;
  export var height : number;
  export const rerenderFn: () => void = () => data = data;

  const relevantTileWidth = 5;
  const relevantTileHeight = 34;
  const endingTileMargin = 10;

  const colorGenerator = scaleThreshold<number, string>()
    .domain([10,20,30,40,50,60,70,80,100])
    .range([
      '#facc6e', '#f3b670', '#eaa073', '#de8b75', '#d07877',
      '#bf6578', '#ac557a', '#95477c', '#7a3b7f', '#583382'
    ]);

  const colorFunction = (d: number) => colorGenerator(d);

  const dataLookUp = createLookup(data, d => d.id, d => d);

  function findMaxValue(data: CountryDataSquare[]){
    let max = 0;
    data.forEach(c => {
      if (c.value > max){
        max = c.value;
      }
    });
    return max;
  }

  function findXlocation(countryValue: number){
    return countryValue * (width - endingTileMargin) / maxValue;
  }

  $: maxValue = findMaxValue(data);

  $: relevantCountry = {
    id: selectedCountry,
    value: dataLookUp[selectedCountry].value,
    relevantCountryColor: colorFunction(dataLookUp[selectedCountry].value)
  };

</script>

<div class="container">

  <img src={RiskSVG} alt="risk" />

  <svg viewBox="0 0 {width} {height}" transform="scale(-1,1)">
      <g id={relevantCountry.id} class="shadow">
        <rect
          class="selectedCountry"
          width={relevantTileWidth}
          height={relevantTileHeight}
          x={findXlocation(relevantCountry.value)}
          y=4
          rx="10"
          ry="3"
          filter="none"
          fill={colorFunction(relevantCountry.value)}
        />
      </g>
  </svg>
</div>

<style>
  .container {
    position: relative;
  }

  .selectedCountry {
    stroke-width: 1.2;
    stroke: black;
  }

  .shadow {
    filter: drop-shadow(1px 1px 3px rgb(0 0 0 / 0.3));
  }

  svg {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>