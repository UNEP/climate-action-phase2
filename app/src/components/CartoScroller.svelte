<script lang="ts">
  import Scroller from "./common/Scroller.svelte";
  import datasets, { END_YEAR } from 'src/data';
  import type { SimpleCartogramDataPoint } from "./maps/Cartogram.svelte";
  import Cartogram from "./maps/Cartogram.svelte";
  import { CartogramDataPoint } from "./maps/CartogramTypes";
  import { displayVal } from "src/util";
  import { colorNetZero } from "src/colors";
  import TrendsNode, { TrendsCartogramDataPoint } from "./maps/TrendsNode.svelte";
  import CartogramNode from "./maps/CartogramNode.svelte";

  export let text: {p: string}[];
  export let id: string;

  let section: number;
  let prevSection: number;

  type SharedParamNames = 'dataset' | 'countries';

  type CartogramProps = Cartogram<[
    SimpleCartogramDataPoint<'emissions2018'>,
    TrendsCartogramDataPoint<'size'>
  ]>['$$prop_def'];

  let sharedParams: Pick<CartogramProps, SharedParamNames> = {
    dataset: [
      {
        ...datasets.cartoworld.ghg,
        NodeComponent: CartogramNode,
        NodeClass: CartogramDataPoint,
        hoverTextFn: c =>
          `<b>${c.name}</b> emitted ${displayVal(c.value, 1)} ` +
          `tonnes of GHG in ${END_YEAR}`,
        classesFn: c => section === 1 && !datasets.top10emitters.has(c.id) ? ['fade'] : [],
        colorFn: d => datasets.lookups.netzero[d.id]
          ? colorNetZero(datasets.lookups.netzero[d.id].status)
          : '#000000'
      },
      {
        ...datasets.cartoworld.trends,
        NodeComponent: TrendsNode,
        NodeClass: TrendsCartogramDataPoint,
        classesFn: c => section === 3 && !datasets.top10drops.has(c.id) ? ['fade'] : [],
        colorFn: d => datasets.lookups.netzero[d.id]
          ? colorNetZero(datasets.lookups.netzero[d.id].status)
          : '#000000'
      },
    ],
    countries: datasets.countries
  };

  let sectionParams: {[section: string]: Omit<CartogramProps, SharedParamNames>} = {
    emissions: {
      helpText: {
        code: "CAN",
        text: "Each square represents a country, scaled by its per capita emissions"
      },
    },
    trends: {
      helpText: null
    }
  };

  $: currentSectionParams = sectionParams[section === 0 ? 'emissions' : 'trends'];

  let rerenderFn: () => void;
  $: {
    if (rerenderFn && prevSection !== section) {
      rerenderFn();
    }
  }


</script>

<div {id}>
  <Scroller bind:section>
    <div slot="sticky">
      <div class="carto-container">
        <div class="carto-content">
          <Cartogram
            {...sharedParams} {...currentSectionParams}
            bind:rerenderFn
            selectedDatasetIndex={Math.floor((section || 0) / 2)} />
        </div>

      </div>
    </div>

    <div slot="scrollable">
      {#each text as {p}}
      <section>
        <div class="scrollcard">{p}</div>
      </section>
      {/each}
    </div>
  </Scroller>
</div>


<style lang="scss">

  section {
    pointer-events: none;
    height: 100vh;
    .scrollcard {
      position: absolute;
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
      height: 70vh;
      width: 100%;
    }
  }

  .carto-container :global(.annotation .text) {
    background: #f9f9f9e0;
    border-radius: 4px;
    padding: 0 10px 5px;
  }

</style>