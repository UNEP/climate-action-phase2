<script lang="ts">
  import type { SimpleCartogramDataPoint } from "src/components/maps/Cartogram.svelte";
  import Cartogram from "src/components/maps/Cartogram.svelte";
  import datasets from 'src/data';
  import Legend from "src/components/common/Legend.svelte";
  import { colorNDC, colorGHG, colorSubsidies } from "src/colors";
  import { displayVal} from 'src/util';
  import type { Content, TextBlock } from 'src/types';
  import ScrollableX from "./common/ScrollableX.svelte";
  import EmbedFooter from "./EmbedFooter.svelte";
  import TrendsNode, { TrendsCartogramDataPoint } from "./maps/TrendsNode.svelte";
  import type { InputDataPoint } from "./maps/CartogramTypes";
  import { CartogramDataPoint } from "./maps/CartogramTypes";
  import CartogramNode from "./maps/CartogramNode.svelte";
  import CartogramHeader from "./maps/CartogramHeader.svelte";

  export var data : keyof Datasets;
  export var id: string;
  export var block: Content;
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
    ndc: Dataset<CartogramDataPoint<NDCDataPoint<'ghg'>, 'ghg'>>,
    ffsubsidies: Dataset<SimpleCartogramDataPoint<'subsidies_percapita'>>,
  }

  const ghgLabels = ['Lower', 'Stagnant', 'More than in 1990'];

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
          hoverTextFn: (c) => c.data.label,
          colorFn: d => colorNDC(d.data.colorValue),
        }],
        countries: datasets.countries,
        helpText: {
          code: "CAN",
          text: "Each square represents a country, scaled by its per capita emissions"
        },
      },
      legend: {
        title: `Status of <b>Nationally Determined Contributions (NDCs)</b>`,
        colors: colorNDC.range(),
        labels: colorNDC.domain(),
        type: 'categorical',
      }
    },
    ffsubsidies: {
      cartogram: {
        dataset: [{
          ...datasets.cartoworld.ffsubsidies,
          NodeClass: CartogramDataPoint,
          NodeComponent: CartogramNode,
          hoverTextFn: c =>
            `<b>${c.name}</b> subsidized fossil fuels with ` +
            `<b>$${displayVal(c.data.subsidies_total_in_millions, 1)} million</b> in 2019` +
            ` — <b>$${displayVal(c.data.subsidies_percapita, 1)} per person</b>. ` +
            `That represents <b>${displayVal(c.data.subsidies_pct_gdp, 1)}% of its GDP</b>.`,
          colorFn: d => colorSubsidies(d.data.subsidies_pct_gdp),
        }],
        countries: datasets.countries,
        helpText: {
          code: "CAN",
          text: "Each square represents a country, scaled by its fossil-fuel subsidies per capita"
        },
      },
      legend: {
        title: `How much <b>fossil-fuel subsidies</b> represent <b>as a percent of GDP</b>`,
        colors: colorSubsidies.range(),
        labels: colorSubsidies.domain(),
        type: 'sequential',
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

    <CartogramHeader {block} >
      <div slot="legend">
        <Legend
          {...datasetParams[data].legend}
          bind:selected = {legendElementSelectedIndex}
        />
      </div>
    </CartogramHeader>

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
