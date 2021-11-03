<script lang="ts">
  import type { SimpleCartogramDataPoint } from "src/components/maps/Cartogram.svelte";
  import Cartogram from "src/components/maps/Cartogram.svelte";
  import datasets from 'src/data';
  import Legend from "src/components/common/Legend.svelte";
  import { colorNDC, colorGHG } from "src/colors";
  import { displayVal} from 'src/util';
  import type { Content, TextBlock } from 'src/types';
  import ScrollableX from "./common/ScrollableX.svelte";
  import EmbedFooter from "./EmbedFooter.svelte";
  import SectionTitle from "src/components/SectionTitle.svelte";
  import TrendsNode, { TrendsCartogramDataPoint } from "./maps/TrendsNode.svelte";
  import type { InputDataPoint } from "./maps/CartogramTypes";
  import { CartogramDataPoint } from "./maps/CartogramTypes";
  import CartogramNode from "./maps/CartogramNode.svelte";

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
  let legendIsHoveredValue : string;

  let rerender: () => void;

  type NDCDataPoint<VK extends string> = InputDataPoint<VK> & {
    label: string,
    colorValue: string;
  };

  type Dataset<CDP extends CartogramDataPoint<any>> = {
    cartogram: Cartogram<[CDP]>['$$prop_def'];
    legend: Omit<Legend['$$prop_def'], 'selected'>;
  };

  interface Datasets {
    ghg: Dataset<SimpleCartogramDataPoint<'emissions2018'>>,
    percapita: Dataset<SimpleCartogramDataPoint<'emissions_percapita'>>,
    trends: Dataset<TrendsCartogramDataPoint<'size'>>,
    ndc: Dataset<CartogramDataPoint<NDCDataPoint<'ghg'>, 'ghg'>>
  }

  const ghgLabels = ['Lower', 'Status quo', 'More than in 1990'];

  const datasetParams: Datasets = {
    ghg: {
      cartogram: {
        dataset: [
          {
            ...datasets.cartoworld.ghg,
            NodeComponent: CartogramNode,
            NodeClass: CartogramDataPoint,
            hoverTextFn: c =>
              `<b>${c.name}</b> emitted ${displayVal(c.value, 1)} ` +
              `million tonnes of GHG in 2018`,
            colorFn: d => colorGHG(datasets.ghgCategories[d.id] || 'Unknown'),
          }
        ],
        helpText: {
          code: "CAN",
          text: "Each square represents a country, scaled by its emissions"
        },
        countries: datasets.countries,
      },
      legend: {
        title: `How much have <b>emissions changed since 1990</b>`,
        colors: colorGHG.range(),
        labels: ghgLabels,
        type: 'categorical',
      }
    },
    percapita: {
      cartogram: {
        dataset: [
          {
            ...datasets.cartoworld.percapita,
            NodeComponent: CartogramNode,
            NodeClass: CartogramDataPoint,
            hoverTextFn: c =>
              `<b>${c.name}</b> emitted ${displayVal(c.value, 1)} ` +
              `tonnes of GHG per capita in 2018`,
            colorFn: d => colorGHG(datasets.ghgCategories[d.id] || 'Unknown')
          }
        ],
        helpText: {
          code: "CAN",
          text: "Each square represents a country, scaled by its per capita emissions"
        },
        countries: datasets.countries,
      },
      legend: {
        title: `How much have <b>emissions changed since 1990</b>`,
        colors: colorGHG.range(),
        labels: ghgLabels,
        type: 'categorical',
      }
    },
    trends: {
      cartogram: {
        dataset: [{
          ...datasets.cartoworld.trends,
          NodeClass: TrendsCartogramDataPoint,
          NodeComponent: TrendsNode,
          classesFn: () => ['invert'],
          colorFn: d => colorGHG(datasets.ghgCategories[d.id]) || 'black'
        }],
        countries: datasets.countries,
        helpText: {
          code: "IRN",
          text: "Each tile represents individual country trends in GHG emissions"
        },
      },
      legend: {
        title: `How much have <b>emissions changed since 1990</b>`,
        colors: colorGHG.range(),
        labels: ghgLabels,
        type: 'categorical',
      }
    },
    ndc: {
      cartogram: {
        dataset: [{
          ...datasets.cartoworld.ndc,
          NodeClass: CartogramDataPoint,
          NodeComponent: CartogramNode,
          hoverTextFn: (c) => {
            let current = datasets.lookups.netzero[c.id];
            let res = "";

            current.status !== "" && current.year !== null ?
              res = datasets.lookups.countries[c.id].name +
              " has the status: " + current.status + " by " + current.year + "." :
              res = "No data for " + datasets.lookups.countries[c.id].name + ".";

            return res;

          },
          colorFn: d => colorNDC(d.data.colorValue),
        }],
        countries: datasets.countries,
        helpText: {
          code: "CAN",
          text: "Each square represents a country, scaled by its per capita emissions"
        },
      },
      legend: {
        title: `As a multiple of the <strong>WHO's guideline</strong> (10 µg/m<sup>3</sup>)`,
        colors: colorNDC.range(),
        labels: colorNDC.domain(),
        type: 'categorical',
      }
    }
  };

  $: legendIsHoveredValue = legendElementSelectedIndex !== null && legendElementSelectedIndex >= 0
    ? selectedDataset.legend.colors[legendElementSelectedIndex]
    : "";

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
          <Cartogram
            {legendIsHoveredValue}
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
