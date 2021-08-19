<script lang="ts" context="module">
  import type { HierarchyRectangularNode } from 'd3-hierarchy';
  import Annotation from 'src/components/maps/Annotation.svelte';

  interface HierarchicalDatum {
    value?: number;
    type?: string;
    types?: HierarchicalDatum[];
  }

  export interface RegionTreemapData {
    leaves: HierarchyRectangularNode<HierarchicalDatum>[],
    background: {
      borderTop: number,
      borderBottom: number,
      borderLeft: number,
      borderRight: number,
      color: string,

    },
    x: number,
    y: number,
    width: number,
    height: number,
    totalPollutingValue: number,
    mostPollutingValue: number,
    mostPollutingType: string,
    region: string,
  }
</script>
<script lang="ts">
  import * as d3 from 'src/d3';
  import {colorSectors, colorFuels} from 'src/App.svelte';
  import type { CartoRegionData } from 'src/types';

  interface Position{
    x: number,
    y: number
  }

  export let data: CartoRegionData;
  export let width: number;
  export let height: number;

  let referenceRegion : Position;

  const mapPropotions = (val) => Math.sqrt(val) * width * 0.03;

  let regions : RegionTreemapData[];

  let showInformation = true;

  let showConcreteType = false;

  let currentRegion : RegionTreemapData;

  let currentLeaf : HierarchyRectangularNode<HierarchicalDatum>;

  const getRegionHoverText = (r: RegionTreemapData) => {
    return (
      `Most of the PM 2.5 in <b>${r.region}</b> comes from <b>${r.mostPollutingType}` +
      `</b> —<b>${r.mostPollutingValue.toFixed(2)}</b> of the <b>` +
      `${r.totalPollutingValue.toFixed(2)}</b> µg/m<sup>3</sup>`
    );
  };

  const getLeafHoverText = (leaf: HierarchyRectangularNode<HierarchicalDatum>) => {
    return (
      ` — while <b>${leaf.data.type}</b> accounts for ` +
      `<b>${leaf.data.value.toFixed(2)}</b> µg/m<sup>3</sup>`
    );
  };

  $:{

    regions = data.regions.map(region => {

      const convertX = (val: number) => width * val / data.scale_width;
      const convertY = (val: number) => height * val / data.scale_height;


      const hierarchy = d3.hierarchy<HierarchicalDatum>(region, node => node.types)
        .sum(node => node.value || 0)
        .sort((a,b) => b.value - a.value);

      const treemap = d3.treemap<HierarchicalDatum>()
        .size([
          mapPropotions(region.totalValue / region.numCountries),
          mapPropotions(region.totalValue / region.numCountries)
        ])
        .padding(2)(hierarchy);


      const background = {
        borderTop  : 2,
        borderBottom: 2,
        borderLeft: 2,
        borderRight: 2,
        color: "#f9f9f9",

      };

      const borderX = background.borderRight + background.borderLeft;
      const borderY = background.borderBottom + background.borderTop;

      return {
        leaves : treemap.leaves(),
        background,
        x : convertX(region.posX),
        y : convertY(region.posY),
        width:
          mapPropotions(treemap.value / region.numCountries) + borderX,
        height:
          mapPropotions(treemap.value / region.numCountries) + borderY,
        totalPollutingValue : treemap.value / region.numCountries,
        mostPollutingValue : treemap.children[0].data.value,
        mostPollutingType : treemap.children[0].data.type,
        region: region.region,
        nameX: convertX(region.posX),
        nameY: region.region === "Latin America + Caribbean" ?
          convertX(region.posY) + mapPropotions(treemap.value / region.numCountries) + borderX :
          convertX(region.posY) - 20
      };
    });

    referenceRegion = {
      x: regions[2].x + regions[2].width / 2,
      y: regions[2].y
    };
  }

  const getHelpText = (dataType: string) => (
    `Squares are sized based on <strong>how much each ${dataType}</strong> ` +
    `contributed to the mean annual levels of PM<sub>2.5</sub> in that <strong>region</strong>`
  );

</script>

<div class="text">
{#if showInformation}
  <Annotation
    x={referenceRegion.x}
    y={referenceRegion.y}
    text={getHelpText(data.type === "sectors" ? 'sector' : 'fuel')}
    radius={2}
    forceTopWherePossible={true}
    canvasWidth={width}
    canvasHeight={height}
  />
  {:else}
  <Annotation
    x={currentRegion.x + currentLeaf.x0 + ((currentLeaf.x1 - currentLeaf.x0) / 2)}
    y={currentRegion.y + currentLeaf.y0}
    text={showConcreteType
      ? getRegionHoverText(currentRegion) + getLeafHoverText(currentLeaf)
      : getRegionHoverText(currentRegion)
    }
    radius={0} forceTopWherePossible={true}
    canvasWidth={width} canvasHeight={height}
  />
  {/if}
</div>
<div class="svg" {width} {height}>
  <svg id="treemapCartogram" {width} {height}>
    <filter id="shadow" x="-10%">
      <feDropShadow dx="0" dy="0" stdDeviation="4" flood-opacity="0.4"></feDropShadow>
    </filter>
    {#each regions as region}
      <g id={region.region.replace(/\s/g, '').replace('+','-') + "-group"} class="region">
        <rect
          id = {region.region.replace(/\s/g, '').replace('+','-') + "-background"}
          class="tile"
          width={region.width}
          height={region.height}
          x={region.x - region.background.borderRight}
          y={region.y - region.background.borderBottom}
          rx="2"
          ry="2"
          filter="none"
          on:mouseenter={()=>{showInformation = false; currentRegion = region; currentLeaf = region.leaves[0]; }}
          on:mouseout={()=>{showInformation = true;}}
          on:blur={()=>{showInformation = true;}}
          style="fill: {region.background.color};"
        />
        <g id={region.region.replace(/\s/g, '').replace('+','-') + "-elements"}>
          {#each region.leaves as leaf}
          <rect
            class="tile leaf"
            fill={data.type === "sectors" ? colorSectors(leaf.data.type) : colorFuels(leaf.data.type)}
            width={leaf.x1 - leaf.x0}
            height={leaf.y1 - leaf.y0}
            x={region.x + leaf.x0}
            y={region.y + leaf.y0}
            rx="2"
            ry="2"
            on:mouseenter={()=>{currentRegion = region; showInformation = false; currentLeaf = leaf; showConcreteType = true;}}
            on:mouseout={()=>{showInformation = true; showConcreteType = false;}}
            on:blur={()=>{showInformation = true; showConcreteType = false;}}
          />
          {/each}
        </g>
      </g>
    {/each}
  </svg>

</div>

<style>
  .leaf {
    stroke: transparent;
    stroke-linecap: butt;
    stroke-width: 0.5;
  }
  .leaf:hover {
    stroke: black;
    stroke-width:1.5;
    transition: .3s stroke;
  }
  .region:hover{
    filter: url("#shadow");
  }
</style>