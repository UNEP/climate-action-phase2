<script lang="ts">
    import { groups } from 'd3-array';
    import dataset from '../data';
    import MiniSurveyCharts from '../components/MiniSurveyCharts.svelte';
    import {fade} from 'svelte/transition';
    import EmbedFooter from './EmbedFooter.svelte';
    import SectionTitle from './SectionTitle.svelte';
    import type { Content, TextBlock } from 'src/types';


    export var isEmbed = false;
    export var embed: string;
    export var block: Content.AnnotatedImage;
    export var id: string;
    export var text: TextBlock[];

    interface PewData {
      country: string,
      year: string,
      value: number
    }

    let datasetPewData = dataset.pew as PewData [];
    let loaded: boolean = false;
    let selectedCountry:Array<any>;
    let width: number = 100;
    $: tileWidth = width * .1;
    let hover: boolean = false;

    let groupByCountry;
    let detailChartPosition: {x:number, y:number};
    let container:HTMLElement;
    let offset:{x:number, y:number, width: number, height: number};


    let dataFiltered = datasetPewData.filter(d => d.value !== null);
    groupByCountry = groups(dataFiltered, d => d.country).map(d => d[1]);
    groupByCountry.sort((a,b) => b[b.length - 1].value - a[a.length - 1].value );
    loaded = true;


    function selectCountry(selection:Array<any>, pos:{x:number, y:number}) {

      offset = {
        x: container.getBoundingClientRect().x,
        y: container.getBoundingClientRect().y,
        width: container.getBoundingClientRect().width,
        height: container.getBoundingClientRect().height
      };

      selectedCountry = selection;
      hover = true;

      detailChartPosition = pos;
      detailChartPosition.x = detailChartPosition.x - 75;
      detailChartPosition.y = detailChartPosition.y;

    }

    const nameOverrides = {
      "United States of America": "United States"
    };
</script>
<section {id} class="viz wide">
  {#if !isEmbed}
    <SectionTitle {block} />
  {/if}

  <h2 class='narrow'>{@html block.head}</h2>

  {#if hover && selectedCountry}
      <div class="detail-chart" style='transform: translate({detailChartPosition.x}px, {detailChartPosition.y}px);'  transition:fade={{duration:200}}>
      <p class="description"><span class='value'>{selectedCountry[selectedCountry.length - 1].value}%</span> of people in <span class='country'>{selectedCountry[0].country}</span> consider climate change a major threat
      </p>
      <MiniSurveyCharts
              data={selectedCountry}
              width={270}
              selected={true}
          />
      </div>
  {/if}
  {#if loaded}
  <div class="pew-container" bind:clientWidth={width} bind:this={container} >
      {#each groupByCountry as country}
      <div class="mini-chart"
      on:mouseenter={(e) => selectCountry(country, {x: e.target.offsetLeft, y: e.target.offsetTop})}
      on:mouseleave={() => hover = false }
      >
          <p class="label">{nameOverrides[country[0].short] || country[0].short}</p>
          <MiniSurveyCharts
              data={country}
              width={tileWidth}
              selected={false}
          />
      </div>
      {/each}
  </div>
  {/if}
  {#if !isEmbed}

    <div class="footer">
      <EmbedFooter {embed} />
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
    .pew-container {
        box-sizing: border-box;
        padding-bottom: 20px;
        flex: 0 0 100%;
        text-align: left;
        margin-top:30px;
    }

    .mini-chart {
        width: 10%;
        margin-right: 4px;
        padding: 20px 0 0 2px;
        background-color: #E8E8E8;
        display: inline-block;
        position:relative;
        overflow: hidden;
    }

    .mini-chart:hover {
        background-color: #E8E8E8;
        transform: scale(1.2);
        transition: transform 0.1s;
        z-index: 5;
    }

    .label {
        font-size: .8rem;
        margin:0;
        padding:0;
        text-align:left;
        position:absolute;
        color: #505050;
        top: 2px;
        left: 6px;
        pointer-events: none;
    }

    .detail-chart {
        width:270px;
        height:calc(270px * 0.75);
        z-index:1000;
        margin-right: 2px;
        margin-bottom: 2px;
        padding: 10px 0 0 2px;
        background-color: rgba(243,243,243,.85);
        box-shadow: 0px 0px 15px 0px #00000018;
        position:absolute;
        pointer-events: none;
        transform: translate(-30%, -15%);
    }

    .description {
        width:270px;
        font-size:14px;
        line-height: 20px;
        font-weight: 300;
        padding:0;
        text-align:left;
        width: 70%;
        padding-left: 5px;
        padding-top: 2px;
        margin-bottom: -10px;
        margin-top: 0;
        position: absolute;
        top:10px;
        left:6px;
    }

    .country {
        font-size:18px;
        font-weight: 600;
    }

    .value {
        font-size:18px;
    }

    @media (max-width: 900px) {
        .label {
            font-size: 11px;
        }
        .pew-container {
            margin-top:0;
        }
    }
</style>