<script lang="ts">
  import TreemapSvg from 'src/components/charts/TreemapSVG.svelte';
  import {sectoralBD, differentFuels} from 'src/data';
  import Legend from 'src/components/common/Legend.svelte';
  import { colorFuels, colorSectors } from "src/colors";
  import ScrollableX from './common/ScrollableX.svelte';
  import EmbedFooter from './EmbedFooter.svelte';

  interface Text {
    p : string;
  }
  enum TreemapType{
    fuel = 0, sectors = 1
  }
  export let data : string;
  export let head : string;
  export let text : Text[];
  export let embed : boolean = true;

  let cartogramAnnotation: boolean;

  const treemapParams = {
    [TreemapType.fuel] : {
      help: {
        text:
        `<strong>Each big square is a world region</strong>, sized
         by the annual mean levels of <strong>small particular
         matter PM2.5</strong>, measured in µg/m<sup>3</sup>.`
      }
    },
    [TreemapType.sectors] : {
      help: {
        text:
        `<strong>Each big square is a world region</strong>, sized
         by the annual mean levels of <strong>small particular
         matter PM2.5</strong>, measured in µg/m<sup>3</sup>.`
      }
    }
  };
  const legendOptions = {
    sectors: {
      title: "Contribution of each <b>sector</b> to small particle pollution",
      labels: [
        'Windblown dust','Residential','International shipping',
        'Transport','Commercial','Industry','AFCID dust',
        'Other combustion','Remaining sources','Other fires',
        'Agr. waste burning','Agriculture',
        'Waste','Solvents','Energy'
      ],
      selectionDictionary: [
        'windblowndust', 'residential', 'intlshipping', 'transport',
        'commercial', 'industry', 'afciddust', 'othercombustion',
        'remainingsources', 'otherfires', 'agrwasteburning', 'agriculture',
        'waste', 'solvents', 'energy'
      ],
      colors: colorSectors.range()
    },
    fuel: {
      title: "Contribution of each <b>type of fuel</b> to fine particle pollution",
      labels: ['Process','Liquid','Solid bio','Coal'],
      selectionDictionary: ['process', 'liquid', 'solidbio', 'coal'],
      colors: colorFuels.range()
    }
  };
  const currentData = data === "sectors" ? sectoralBD : data === "fuel" ? differentFuels : null;
  const scaleRate = currentData.scale_height / currentData.scale_width;
  let clientWidth: number = 0;
  let width: number;
  let height: number;
  $: width = Math.max(clientWidth, 700);

  $: height = width * scaleRate;
  let legendElementSelectedIndex = -1;
  let legendElementSelected = "";
  $: {
    if(
      legendElementSelectedIndex >= 0 &&
      legendElementSelectedIndex < legendOptions[data].selectionDictionary.length
    )
      legendElementSelected =
        (legendOptions[data].selectionDictionary[legendElementSelectedIndex] + "")
          .toLocaleLowerCase().replaceAll('.', '').replaceAll(' ', '');
  }
</script>
<section class='viz wide' id={data}>
  <h2 class='narrow'>{@html head}</h2>

	<div class='right-narrow' >
		<Legend
			title = {legendOptions[data].title}
			colors = {legendOptions[data].colors}
			labels = {legendOptions[data].labels}
			type = {'categorical'}
      bind:selected = {legendElementSelectedIndex}
		/>
	</div>

  {#if embed}
    <div class="embed-additional-text-desktop">
      <p>
        To explore more about the climate emergency and
        the effects on the planet visit
        <b><a href="https://www.unep.org/">unep.org</a></b>
      </p>
    </div>

    <div class="embed-additional-text-mobile">
      <p>
        To explore more about air pollution visit
        <b><a href="https://www.unep.org/">unep.org</a></b>
      </p>
    </div>
  {/if}

  <div class="scroll-container" bind:clientWidth={clientWidth}>
    <ScrollableX>
      <div class="treemap-container" style="width:{width}px; height:{height}px; "class:background={cartogramAnnotation}>
        <TreemapSvg
          data={currentData}
          {width}
          {height}
          source = {treemapParams[TreemapType[data]].help.text}
          legendElementSelected = {legendElementSelected}
          bind:annotationShowing={cartogramAnnotation}
        />
      </div>
    </ScrollableX>
  </div>
  
  {#if !embed}
    <div class="footer">
      <EmbedFooter
        embed = {data}>
      </EmbedFooter>
    </div>

    {#each text as t}
      <p class='col-text'>{@html t.p}</p>
    {/each}
  {/if}


</section>

<style>

  .footer {
    margin-bottom: 30px;
  }

  .treemap-container {
    transition: 300ms background-color 700ms;
  }
  .background {
    background-color: #f9f9f9;
    transition: 150ms background-color;
  }
</style>