<script lang="ts">
  import type { CartogramData } from "src/components/maps/Cartogram.svelte";
  import Cartogram from "src/components/maps/Cartogram.svelte";
  import datasets from 'src/data';
  import Legend from "src/components/common/Legend.svelte";
  import { colorNDC, colorPM25 } from "src/colors";
  import { displayVal} from 'src/util';
  import type { Content, TextBlock } from 'src/types';
  import ScrollableX from "./common/ScrollableX.svelte";
  import EmbedFooter from "./EmbedFooter.svelte";
  import SectionTitle from "src/components/SectionTitle.svelte";
  import TrendsNode, { TrendsCartogramDataPoint } from "./maps/TrendsNode.svelte";
  import type { TrendsInputDataPoint } from "./maps/TrendsNode.svelte";
  import type { InputDataPoint } from "./maps/CartogramTypes";
  import { CartogramDataPoint } from "./maps/CartogramTypes";

  export var data : keyof Datasets;
  export var id: string;
  export var block: Content;
  export var head: string;
  export var text: TextBlock[];
  export var embed: string;
  export var isEmbed = false;

  let legendElementSelectedIndex: number = null;
  let clientWidth = 0;
  let width : number;
  let height : number;
  let cartogramAnnotation: boolean;

  let rerender: () => void;


  type LegendProps = {
    title: string;
    labels: string[];
    colors: string[];
    type: string;
  }

  interface NDCDataPoint extends InputDataPoint<'ghg'> {
    label: string,
    colorValue: string;
  }

  type Dataset<T extends string, CDP extends CartogramDataPoint<T> = CartogramDataPoint<T>> = {
    cartogram: Cartogram<CDP>['$$prop_def'];
    legend: LegendProps;
  };

  interface Datasets {
    ghg: Dataset<'emissions2015'>,
    percapita: Dataset<'emissions_percapita'>,
    trends: Dataset<'size', TrendsCartogramDataPoint<'size'>>,
    ndc: Dataset<'ghg', CartogramDataPoint<'ghg', NDCDataPoint>>,
  }

  const datasetParams: Datasets = {
    ghg: {
      cartogram: {
        NodeClass: CartogramDataPoint,
        dataset: datasets.cartoworld.ghg as CartogramData<'emissions2015'>,
        countries: datasets.countries,
        helpText: {
          code: "CAN",
          text: "Each square represents a country, scaled by its per capita emissions"
        },
        hoverTextFn: c =>
          `<b>${c.name}</b> emitted ${displayVal(c.value, 1)} ` +
          `tonnes of GHG in ${datasets.endYear}`,
        colorFn: d => colorPM25(d.value),
      },
      legend: {
        title: `As a multiple of the <strong>WHO's guideline</strong> (10 µg/m<sup>3</sup>)`,
        colors: colorPM25.range(),
        labels: ["x1", "2", "3", "4", "5", "6", "7", "8"],
        type: 'sequential',
      }
    },
    percapita: {
      cartogram: {
        NodeClass: CartogramDataPoint,
        dataset: datasets.cartoworld.percapita as CartogramData<'emissions_percapita'>,
        countries: datasets.countries,
        helpText: {
          code: "CAN",
          text: "Each square represents a country, scaled by its per capita emissions"
        },
        hoverTextFn: c =>
          `<b>${c.name}</b> emitted ${displayVal(c.value, 1)} ` +
          `tonnes of GHG per capita in ${datasets.endYear}`,
        colorFn: d => colorPM25(d.value),
      },
      legend: {
        title: `As a multiple of the <strong>WHO's guideline</strong> (10 µg/m<sup>3</sup>)`,
        colors: colorPM25.range(),
        labels: ["x1", "2", "3", "4", "5", "6", "7", "8"],
        type: 'sequential',
      }
    },
    trends: {
      cartogram: {
        NodeClass: TrendsCartogramDataPoint,
        NodeComponent: TrendsNode,
        dataset: datasets.cartoworld.trends as CartogramData<'size', TrendsInputDataPoint<'size'>>,
        countries: datasets.countries,
        helpText: {
          code: "IRN",
          text: "Each tile represents individual country trends in greenhouse gas emissions"
        },
        colorFn: d => colorPM25(d.value),
      },
      legend: {
        title: `As a multiple of the <strong>WHO's guideline</strong> (10 µg/m<sup>3</sup>)`,
        colors: colorPM25.range(),
        labels: ["x1", "2", "3", "4", "5", "6", "7", "8"],
        type: 'sequential',
      }
    },
    ndc: {
      cartogram: {
        NodeClass: CartogramDataPoint,
        dataset: datasets.cartoworld.ndc as CartogramData<'ghg', NDCDataPoint>,
        countries: datasets.countries,
        helpText: {
          code: "CAN",
          text: "Each square represents a country, scaled by its per capita emissions"
        },
        hoverTextFn: c => c.data.label,
        colorFn: d => colorNDC(d.data.colorValue),
      },
      legend: {
        title: `As a multiple of the <strong>WHO's guideline</strong> (10 µg/m<sup>3</sup>)`,
        colors: colorNDC.range(),
        labels: colorNDC.domain(),
        type: 'sequential',
      }
    }
  };

  // re-render hack (as Cartogram component doesn't know when then result of our funcs change)
  $: legendElementSelectedIndex !== undefined && rerender && rerender();

  $: {
    width = Math.max(clientWidth, 700);
  }
  $: height = width * 0.62;

  $: selectedDataset = datasetParams[data];

</script>

{#if datasetParams[data]}
  <section {id} class="viz wide">

    {#if !isEmbed}
      <SectionTitle {block} />
    {/if}

    <h2 class='narrow'>{@html head}</h2>

    <div class="right-narrow" >
      <Legend
        {...datasetParams[data].legend}
        bind:selected = {legendElementSelectedIndex}
      />
    </div>

    {#if isEmbed && embed !== "policies"}
      <div class="embed-additional-text-desktop" class:hide={cartogramAnnotation}>
        <p>
          To explore more about the climate emergency and
          the effects on the planet visit
          <b><a target="_blank" href="https://www.unep.org/">unep.org</a></b>
        </p>
      </div>
    {/if}

    <div class="margin-breakout-mobile" bind:clientWidth={clientWidth}>
      <ScrollableX>
        <div
          style="width:{width}px; height:{height}px"
          class="cartogram-container"
        >
          <svelte:component this={Cartogram}
            {...selectedDataset.cartogram}
            bind:rerenderFn={rerender}
            bind:annotationShowing={cartogramAnnotation}
            />
        </div>
      </ScrollableX>
    </div>

    {#if isEmbed && embed === "policies"}
      <div class="embed-additional-text-desktop-policies" class:hide={cartogramAnnotation}>
        <p>
          To explore more about the climate emergency and
          the effects on the planet visit
          <b><a target="_blank" href="https://www.unep.org/">unep.org</a></b>
        </p>
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
{:else}
  <div>Missing dataset: {data}</div>
{/if}

<style lang="scss">

  .footer {
    margin-bottom: 30px;
  }

  .embed-additional-text-desktop, .embed-additional-text-desktop-policies{
    opacity: 1;
    transition: 300ms opacity 700ms;
    position: relative;
    z-index: 1;
    &.hide {
      opacity: 0;
      transition: 150ms opacity;
    }
  }

  .cartogram-container {
    overflow: hidden;
  }

  .cartogram-container :global(.annotation .text) {
    background: #f9f9f9e0;
    border-radius: 4px;
    padding: 0 10px 5px;
  }
</style>
