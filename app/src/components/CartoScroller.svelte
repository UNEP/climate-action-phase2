<script lang="ts">
  import Scroller from "./common/Scroller.svelte";
  import datasets, { END_YEAR } from 'src/data';
  import type { BaseCartogramData } from "./maps/Cartogram.svelte";
  import Cartogram from "./maps/Cartogram.svelte";
  import { CartogramDataPoint } from "./maps/CartogramTypes";
  import { displayVal } from "src/util";
  import { colorNetZero, colorPM25 } from "src/colors";
  import type { TrendsInputDataPoint } from "./maps/TrendsNode.svelte";
  import TrendsNode, { TrendsCartogramDataPoint } from "./maps/TrendsNode.svelte";
  import CartogramNode from "./maps/CartogramNode.svelte";

  let section: number;
  let prevSection: number;
  let trends = datasets.cartoworld.trends as BaseCartogramData<'size', TrendsInputDataPoint<'size'>>;

  type SharedParamNames = 'dataset' | 'countries';

  let sharedParams: Pick<Cartogram['$$prop_def'], SharedParamNames> = {
    dataset: [
      {
        ...datasets.cartoworld.ghg as BaseCartogramData<'emissions2015'>,
        NodeComponent: CartogramNode,
        NodeClass: CartogramDataPoint,
        hoverTextFn: c =>
          `<b>${c.name}</b> emitted ${displayVal(c.value, 1)} ` +
          `tonnes of GHG in ${END_YEAR}`,
        classesFn: c => section === 1 && !datasets.top10emitters.has(c.id) ? ['fade'] : [],
        colorFn: d => colorNetZero('IN LAW'),
      },
      {
        ...trends as any, // weird TS error here where it can't deal with union of mapped types
        NodeComponent: TrendsNode,
        NodeClass: TrendsCartogramDataPoint,
        classesFn: c => section === 3 && !datasets.top10drops.has(c.id) ? ['fade'] : [],
        colorFn: d => colorNetZero('IN LAW')
      },
    ],
    countries: datasets.countries
  };

  let sectionParams: {[section: string]: Omit<Cartogram['$$prop_def'], SharedParamNames>} = {
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
    <section>
      <div class="scrollcard">
        This is the first section.
      </div>
    </section>
    <section>
      <div class="scrollcard">
        This is the second section.
      </div>
    </section>
    <section>
      <div class="scrollcard">
        This is the third section.
      </div>
    </section>
    <section>
      <div class="scrollcard">
        This is the fourth section.
      </div>
    </section>
  </div>
</Scroller>


<style lang="scss">

  section {
    pointer-events: none;
    // min-height: 100vh;
    height: 480px;
    display: flex;
    align-items: center;
    .scrollcard {
      width: 300px;
      padding: 20px;
      background: white;
      border-radius: 4px;
    }

    &:not(:last-child) {
      margin-bottom: 600px;
    }
  }
  .carto-container {
    // min-height: 100vh;
    // height: 600px;
    // display: flex;
    // align-items: center;

    -webkit-transform: translate3d(0, 0, 0);
    .carto-content {
      height: 70vh;
      width: 100%;
      border: 1px solid #aaa;
    }
  }
</style>