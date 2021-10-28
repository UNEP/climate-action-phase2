<script lang="ts">
  import type {CountryDataSquare} from 'src/components/CountryTable.svelte';
  import { createLookup } from "src/util";
  import { scaleThreshold } from 'd3-scale';

  export var selectedCountry: string;
  export var data: CountryDataSquare[];
  export var width : number;
  export var height : number;
  export const rerenderFn: () => void = () => data = data;

  const normalTileWidth = 3;
  const normalTileHeight = 20;
  const relevantTileWidth = 5;
  const relevantTileHeight = 34;
  const xBorderRadius = 10;
  const yBorderRadius = 2;
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

<div>
    <svg viewBox="0 0 {width} {height}" transform="scale(-1,1)" id="distribution-chart">
      {#each data as d}
          {#if d.value !== null && d.id !== selectedCountry}
            <g id={d.id} class="region">
              <rect
                id = {d.id}
                class= "normalTile"
                width= {d.id === selectedCountry ? relevantTileWidth : normalTileWidth}
                height= {d.id === selectedCountry ? relevantTileHeight : normalTileHeight}
                x={findXlocation(d.value)}
                y=10
                rx={xBorderRadius}
                ry={yBorderRadius}
                filter="none"
                style = "--theme-color: {colorFunction(d.value)}"
              />
            </g>
          {/if}
      {/each}
        <g id={relevantCountry.id} class="shadow">
          <rect
            id = {relevantCountry.id}
            class= "selectedCountry"
            width= {relevantTileWidth}
            height= {relevantTileHeight}
            x={findXlocation(relevantCountry.value)}
            y=4
            rx="10"
            ry="3"
            filter="none"
            style = "--theme-color: {colorFunction(relevantCountry.value)}"
          />
        </g>
    </svg>
</div>

<style>
  .selectedCountry {
    fill: var(--theme-color);
    stroke-width: 1.2;
    stroke: black;
  }

  .normalTile {
    fill: var(--theme-color);
  }

  .shadow {
    filter: drop-shadow(3px 5px 2px rgb(0 0 0 / 0.6));
  }
</style>