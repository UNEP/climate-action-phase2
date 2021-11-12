<script lang="ts" context="module">
  import datasets, { calcGradientFrom } from 'src/data';
  import { CartogramDataPoint } from "./maps/CartogramTypes";
  import { colorNetZero } from "src/colors";
  import TrendsNode, { TrendsCartogramDataPoint } from "./maps/TrendsNode.svelte";
  import type { SimpleCartogramDataPoint } from "./maps/Cartogram.svelte";
  import Cartogram from "./maps/Cartogram.svelte";
  import CartogramNode from "./maps/CartogramNode.svelte";

  export const legendProps: Omit<Legend['$$prop_def'], 'selected'> = {
    title: "Status of <b>net-zero</b> targets",
    type: 'categorical',
    colors: colorNetZero.range(),
    labels: [
      ...colorNetZero.domain().slice(0, -1),
      'No target'
    ]
  };

  const topemitters = new Set([
    ...datasets.cartoworld.ghg.data
      .sort((a,b) => b.emissions2018 - a.emissions2018)
      .slice(0, 10)
      .map(d => d.id)
  ]);

  const topdrops = new Set([
    ...datasets.cartoworld.trends.data
      .map(d => ({
        id: d.id,
        m: calcGradientFrom(d, 2015, 2018)
      }))
      .filter(d => d.m < -0.01)
      .map(d => d.id)
  ]);

  type CartogramProps = Cartogram<[
    SimpleCartogramDataPoint<'emissions2018'>,
    TrendsCartogramDataPoint<'size'>
  ]>['$$prop_def'];

  export const nzDataset: CartogramProps['dataset'][0] = {
    ...datasets.cartoworld.ghg,
    NodeComponent: CartogramNode,
    NodeClass: CartogramDataPoint,
    hoverTextFn: (c) => {
      const { year, status } = datasets.lookups.netzero[c.id];
      const { name } = datasets.lookups.countries[c.id];
      const yearText = (y: number) => y ? `The target year is ${y}.` : '';

      if (status === "Achieved (self-declared)")
        return `<b>${name}</b> has self-declared that it has achieved its net-zero target.`;
      else if (status === "In law")
        return `<b>${name}</b> has a net-zero target in law. ${yearText(year)}`;
      else if (status === "In policy document")
        return `<b>${name}</b> has set a net-zero target in policy documents. ${yearText(year)}`;
      else if (status === "Declaration / pledge")
        return `<b>${name}</b> has declared or pledged a net-zero target. ${yearText(year)}`;
      else if (status === "Proposed / in discussion")
        return `<b>${name}</b> has proposed or discussed a net-zero target. ${yearText(year)}`;
      else if (year !== null)
        return `<b>${name}</b> has set ${year} as its target year.`;
      else
        return `No data for ${name}.`;
    },
    colorFn: d => datasets.lookups.netzero[d.id]
      ? colorNetZero(datasets.lookups.netzero[d.id].status)
      : '#000000'
  };

  export const nztrendsDataset: CartogramProps['dataset'][1] = {
    ...datasets.cartoworld.trends,
    NodeComponent: TrendsNode,
    NodeClass: TrendsCartogramDataPoint,
    colorFn: d => datasets.lookups.netzero[d.id]
      ? colorNetZero(datasets.lookups.netzero[d.id].status)
      : '#000000'
  };

</script>

<script lang="ts">
  import Scroller from "./common/Scroller.svelte";
  import Legend from "./common/Legend.svelte";
  import type { Content } from "src/types";
  import ScrollableX from "./common/ScrollableX.svelte";
  import CartogramHeader from "./maps/CartogramHeader.svelte";

  export let text: {p: string}[];
  export let id: string;
  export var block: Content;

  let section: number;
  let prevSection: number;

  let cartoParams: CartogramProps;
  $: cartoParams = {
    dataset: [
      {
        ...nzDataset,
        classesFn: c => section === 1 && !topemitters.has(c.id) ? ['fade'] : [],
      },
      {
        ...nztrendsDataset,
        classesFn: c => section === 3 && !topdrops.has(c.id) ? ['fade'] : [],
      }
    ],
    countries: datasets.countries,
    helpText: section === 0 ? {
      code: "CAN",
      text: "Each square represents a country, scaled by its per capita emissions"
    } : null
  };

  let rerenderFn: () => void;
  $: {
    if (rerenderFn && prevSection !== section) {
      rerenderFn();
    }
  }

  let hoveredLegendIndex: number;

  $: hoveredLegendColor = hoveredLegendIndex !== null && hoveredLegendIndex >= 0
    ? colorNetZero.range()[hoveredLegendIndex] : "";

</script>

<div {id} class="container">
  <div class="cartoheader1">
    <CartogramHeader {block}/>
  </div>
  <Scroller bind:section>


    <div class="sticky" slot="sticky">

      <div class="cartoheader2">
        <CartogramHeader {block}>
          <div slot="legend">
            <Legend {...legendProps}
            bind:selected={hoveredLegendIndex} />
          </div>
        </CartogramHeader>
      </div>

      <div class="carto-container">
        <ScrollableX>
          <div class="carto-content">
            <Cartogram
              {...cartoParams}
              legendIsHoveredValue={hoveredLegendColor}
              bind:rerenderFn
              selectedDatasetIndex={Math.floor((section || 0) / 2)} />
          </div>
        </ScrollableX>
      </div>
    </div>

    <div class="scrollable" slot="scrollable">
      {#each text as {p}}
      <section>
        <div class="scrollcard">{p}</div>
      </section>
      {/each}
    </div>
  </Scroller>
</div>


<style lang="scss">

  .cartoheader2 :global(.copy) {
    display: none;
  }

  @media screen and (min-width: 800px) {
    .cartoheader1 {
      display: none;
    }
    .cartoheader2 :global(.copy) {
      display: block;
    }
  }

  .container {
    padding-top: 20px;
  }

  .sticky {
    top: 10vh;
  }

  .scrollable {
    padding-bottom: 60vh;
  }

  section {
    pointer-events: none;
    height: 100vh;
    .scrollcard {
      position: absolute;
      z-index: 10;
      top: 20vh;
      width: 300px;
      padding: 20px;
      background: #fffffff0;
      pointer-events: all;
      font-size: 1.25rem;
      line-height: 1.875rem;
      font-weight: 300;
      box-shadow: 0 0 20px 0 #0000003d;
    }

    &:not(:last-child) {
      margin-bottom: 600px;
    }
  }

  .carto-container {
    -webkit-transform: translate3d(0, 0, 0);
    .carto-content {
      display: flex;
      height: 70vh;
      width: 100%;
      min-width: 800px;
      > :global(.scrollable) {
        flex: 1;
      }
    }
  }

  @media screen and (max-width: 800px) {
    .carto-container {
      margin: 0 -1rem;
    }
    .carto-content {
      padding: 1rem;
      height: 55vh;
    }
  }

  .carto-container :global(.annotation .text) {
    background: #f9f9f9e0;
    border-radius: 4px;
    padding: 0 10px 5px;
  }

</style>