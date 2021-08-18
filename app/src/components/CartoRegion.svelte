<script lang="ts">
  import TreemapSvg from 'src/components/charts/TreemapSVG.svelte';
  import {sectoralBD, differentFuels} from 'src/data';
  import Legend from 'src/components/common/Legend.svelte';
  import { colorFuels, colorSectors } from "src/App.svelte";

  interface Text {
    p : string;
  }

  export let data : string;
  export let head : string;
  export let text : Text[];

  let selected: number;

  const legendOptions = {
    sectors: {
      title: "Contribution of each <b>sector</b> to fine particle pollution",
      labels: [
        'Windblown dust','Residential','International shipping','Transport','Commercial','Industry','AFCID dust',
        'Other combustion','Remaining sources','Other fires','Agr. waste burning','Agriculture',
        'Waste','Solvents','Energy'
      ],
      colors: colorSectors.range()
    },

    fuel: {
      title: "Contribution of each <b>type of fuel</b> to fine particle pollution",
      labels: ['Process','Liquid','Solid bio','Coal'],
      colors: colorFuels.range()
    }
  };

  const currentData = data === "sectors" ? sectoralBD : data === "fuel" ? differentFuels : null;

  const scaleRate = currentData.scale_height / currentData.scale_width;

  let width = 100;
  let height;

  $: height = width * scaleRate;

</script>

<section class='viz wide'>
  <h2 class='narrow'>{@html head}</h2>

  <div class='right-narrow'>
    <Legend
      title = {legendOptions[data].title}
      colors = {legendOptions[data].colors}
      labels = {legendOptions[data].labels}
      type = {'categorical'}
      bind:selected
    />
  </div>

  <div bind:clientWidth={width} >
    <TreemapSvg
      data={currentData}
      {width}
      {height}
    />
  </div>

  {#each text as t}
  <p class='col-text'>{@html t.p}</p>
  {/each}

</section>
