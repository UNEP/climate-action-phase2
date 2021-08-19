<script lang="ts">
  import type { TextBlock } from 'src/types';
  import dataPm25 from 'src/data/pm25_coords.json';
  import countryNameDictionary from 'src/data/countryDictionary.json';
  import dataDeaths from 'src/data/death_coords.json';
  import type {CountryDataPoint} from "src/components/maps/Cartogram.svelte";
  import Cartogram from "src/components/maps/Cartogram.svelte";
  import Legend from "src/components/common/Legend.svelte";
  import ScrollableX from 'src/components/common/ScrollableX.svelte';
  import { colorPM25, colorHealth } from "src/App.svelte";

  export var data : "pm25" | "health";
  export var head:string;
  export var text:TextBlock[];

  let selected: number;

  let clientWidth: number;
  $: width = Math.max(clientWidth, 700);
  $: height = width * (data === 'pm25' ? .55 : .62);

  const datasets = {
    pm25: {
      data: dataPm25,
      nodeSize: 11,
      help: {
        code: "CPV",
        text:
          `<strong>Each square is a country</strong>, sized by the annual mean levels
          of <strong>fine particles PM2.5</strong>, measured in µg/m<sup>3</sup>.`
      },
      colorParam: 'value',
      color: colorPM25,
      legendTitle: `As a multiple of the <strong>WHO's guideline</strong> (10 µg/m<sup>3</sup>)`,
      legendDomain: ["x1", "2", "3", "4", "5", "6", "7"],
      hoverText: (d: CountryDataPoint) =>
        `In <strong>${d.name}</strong>, people are exposed to an average of
        <strong>${d.value} μg/m<sup>3</sup></strong> a year —
        <strong>${(d.value / 10).toFixed(1)}</strong> the WHO guideline.`
    },

    health: {
      data: dataDeaths,
      nodeSize: 73,
      help: {
        code: "BRA",
        text:
          `<strong>Each square is a country</strong>, sized by the total
          number of <strong>deaths caused by fine particle pollution</strong>.`
      },
      colorParam: 'rate',
      color: colorHealth,
      legendTitle: `<strong>Deaths per 100,000 people</strong> caused by fine particle pollution`,
      legendDomain: ["10", "20", "30", "40", "50", "60", "70", "80", "100"],
      hoverText: (d: CountryDataPoint) =>
        `In <strong>${d.name}</strong>, fine particle pollution caused <strong>${d.value}
        deaths</strong> in 2017 —or <strong>${d.rate} per 100,000 people</strong>.`
    }
  };

  let dataset = datasets[data];

  let cartogramData: CountryDataPoint[] = dataset.data
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
    });

</script>

<section class="viz wide">
  <h2 class='narrow'>{@html head}</h2>

  <div class="right-narrow" >
    <Legend
      title = {dataset.legendTitle}
      colors = {dataset.color.range()}
      labels = {dataset.legendDomain}
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
          colorFn={d => dataset.color(d[dataset.colorParam])}
          hoverTextFn={dataset.hoverText}
          nodeSize={dataset.nodeSize}
          helpText={{code: dataset.help.code, text: dataset.help.text}}
        />
      </div>
    </ScrollableX>
  </div>

  {#each text as t}
    <p class='col-text'>{@html t.p}</p>
  {/each}

</section>