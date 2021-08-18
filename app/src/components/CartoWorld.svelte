<script lang="ts">
  import type { TextBlock } from 'src/types';
  import pm25data from 'src/data/pm25_coords.json';
  import countryNameDictionary from 'src/data/countryDictionary.json';
  import deaths_data from 'src/data/death_coords.json';
  import type {CountryDataPoint} from "src/components/maps/Cartogram.svelte";
  import Cartogram from "src/components/maps/Cartogram.svelte";
  import Legend from "src/components/common/Legend.svelte";
  import ScrollableX from 'src/components/common/ScrollableX.svelte';
  import { colorPM25, colorHealth } from "src/App.svelte";

  export var data:string;
  export var head:string;
  export var text:TextBlock[];

  let selected: number;

  let clientWidth: number;
  $: width = Math.max(clientWidth, 700);
  $: height = width * (data === 'pm25' ? .55 : .62);

  const datasetParams = {
    pm25: {
      nodeSize: 11,
      help: {
        code: "CPV",
        text:
          `<strong>Each square is a country</strong>, sized by the annual mean levels
          of <strong>fine particles PM2.5</strong>, measured in µg/m<sup>3</sup>.`
      },
      color: colorPM25,
      legendTitle: `As a multiple of the <strong>WHO's guideline</strong> (10 µg/m<sup>3</sup>)`,
      legendDomain: ["x1", "2", "3", "4", "5", "6", "7"]
    },

    health: {
      nodeSize: 73,
      help: {
        code: "BRA",
        text:
          `<strong>Each square is a country</strong>, sized by the total
          number of <strong>deaths caused by fine particle pollution</strong>.`
      },
      color: colorHealth,
      legendTitle: `<strong>Deaths per 100,000 people</strong> caused by fine particle pollution`,
      legendDomain: ["10", "20", "30", "40", "50", "60", "70", "80", "100"]
    }
  };

  let dsParam = data === "pm25" ? datasetParams.pm25 : datasetParams.health;
  let selectedDataset = data === "pm25" ? pm25data : deaths_data;

  let cartogramData: CountryDataPoint[] = selectedDataset
    .map(d => {
      return {
        name: countryNameDictionary.find(c => c.id === d.id).name,
        short: countryNameDictionary.find(c => c.id === d.id).name,
        code: d.id,
        x: d.x,
        y: d.y,
        value: data === "pm25" ? d.pm25 : d.deaths,
        rate: data === "health" ? d.rate : null
      };
    }
  );

  const colorFunction = (d: CountryDataPoint) => dsParam.color(data === "pm25" ? d.value : d.rate);

  function hoverTextFunction(d: CountryDataPoint){
    if (data === "pm25"){
      return `In <strong>${d.name}</strong>, people are exposed to an average of
        <strong>${d.value} μg/m<sup>3</sup></strong> a year —<strong>${(d.value / 10).toFixed(1)}</strong> the WHO guideline.`;
    }
    else{
      return `In <strong>${d.name}</strong>, fine particle pollution caused <strong>${d.value}
        deaths</strong> in 2017 —or <strong>${d.rate} per 100,000 people</strong>.`;
    }
  }
</script>

<section class="viz wide">
  <h2 class='narrow'>{@html head}</h2>

  <div class="right-narrow" >
    <Legend
      title = {dsParam.legendTitle}
      colors = {dsParam.color.range()}
      labels = {dsParam.legendDomain}
      type = {'sequential'}
      bind:selected
  />
  </div>

  <div class="scroll-container" bind:clientWidth={clientWidth}>
    <ScrollableX>
      <div class="carto-container" style="width:{width}px; height:{height}px">
        <Cartogram
          data={cartogramData}
          domain={[700, 400]}
          categoryFn={() => null}
          colorFn={d => colorFunction(d)}
          hoverTextFn={d => hoverTextFunction(d)}
          nodeSize={dsParam.nodeSize}
          helpText={{code: dsParam.help.code, text: dsParam.help.text}}
        />
      </div>
    </ScrollableX>
  </div>

  {#each text as t}
    <p class='col-text'>{@html t.p}</p>
  {/each}

</section>