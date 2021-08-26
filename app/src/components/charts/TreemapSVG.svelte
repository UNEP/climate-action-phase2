<script lang="ts" context="module">
  import type { HierarchyRectangularNode } from 'd3-hierarchy';
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
    nameX: number,
    nameY: number
  }
</script>
<script lang="ts">
  import Annotation from 'src/components/maps/Annotation.svelte';
  import * as d3 from 'src/d3';
  import {colorSectors, colorFuels} from 'src/colors';
  import type { CartoRegionData } from 'src/types';

  interface Position{
    x: number,
    y: number
  }
  export let data: CartoRegionData;
  export let width: number;
  export let height: number;
  export let source: string;
  export let showRegionName: boolean = true;
  export let legendElementSelected: string = "";
  export let annotationShowing: boolean = false;


  let referenceRegion : Position;
  const mapPropotions = (val) => Math.sqrt(val) * width * 0.03;
  let regions : RegionTreemapData[];
  let showInformation = true;
  let showConcreteType = false;
  let currentRegion : RegionTreemapData;
  let currentLeaf : HierarchyRectangularNode<HierarchicalDatum>;
  let legendTypeParams = [];
  let showHoverText = () => {
    return (
      "Most of the PM 2.5 in <b>"
      + currentRegion.region + "</b> comes from <b>"
      + currentRegion.mostPollutingType +
      "</b> —<b>" + currentRegion.mostPollutingValue.toFixed(2) + "</b> of the <b>" +
      currentRegion.totalPollutingValue.toFixed(2) + "</b> µg/m<sup>3</sup>"
    );
  };
  let showCurrentLeaf = (currentType:string, currentValue:number) => {
    return (
      showHoverText() + "— while <b>" + currentType + "</b> accounts for <b>"
      + currentValue.toFixed(2) + "</b> µg/m<sup>3</sup>"
    );
  };
  $:{
    legendTypeParams = [];
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
      let posX = convertX(region.posX);
      let posY = convertY(region.posY);
      treemap.leaves().forEach((e) => {

        if (e.data.type === legendElementSelected){
          let currentLeaf = {
            x: posX + e.x0,
            y: posY + e.y0,
            width: e.x1 - e.x0,
            height: e.y1 - e.y0,
            type: e.data.type
          };
          legendTypeParams.push(currentLeaf);
        }
      });
      return {
        leaves : treemap.leaves(),
        background,
        x : convertX(region.posX),
        y : convertY(region.posY),
        width: (
          mapPropotions(treemap.value / region.numCountries) +
          background.borderRight + background.borderLeft
        ),
        height: (
          mapPropotions(treemap.value / region.numCountries) +
          background.borderBottom + background.borderTop
        ),
        totalPollutingValue : treemap.value / region.numCountries,
        mostPollutingValue : treemap.children[0].data.value,
        mostPollutingType : treemap.children[0].data.type,
        region: region.region,
        nameX: convertX(region.posX),
        nameY: region.region === "Latin America + Caribbean" ?
          (
            convertX(region.posY) +
            mapPropotions(treemap.value / region.numCountries) +
            background.borderRight + background.borderLeft
          ) :
          convertX(region.posY) - 20
      };
    });
    referenceRegion = {
      x: regions[4].x + regions[4].width / 2,
      y: regions[4].y
    };
  }

  $: annotationShowing = !showInformation;

</script>

<div class="text">
{#if showInformation}
  <Annotation
    x={referenceRegion.x}
    y={referenceRegion.y}
    text={source}
    radius={2}
    forceTopWherePossible={true}
    canvasWidth={width}
    canvasHeight={height}
  />
{:else}
  <Annotation
    x={currentRegion.x + currentLeaf.x0 + ((currentLeaf.x1 - currentLeaf.x0) / 2)}
    y={currentRegion.y + currentLeaf.y0}
    text={showConcreteType ? showCurrentLeaf(currentLeaf.data.type, currentLeaf.data.value) : showHoverText()}
    radius={2} forceTopWherePossible={true}
    canvasWidth={width} canvasHeight={height}
  />
{/if}
</div>

  {#if showRegionName}

  <div class="text">
    {#each regions as region}
    <Annotation
      x={region.nameX}
      y={region.nameY}
      text={region.region}
      radius={2}
      justText={true}
      canvasWidth={width}
      canvasHeight={height}
    />
    {/each}
  </div>
  {/if}
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
          on:mouseenter={()=>{showInformation = false; currentRegion = region; currentLeaf = region.leaves[0];}}
          on:mouseout={()=>{showInformation = true;}}
          on:blur={()=>{showInformation = true;}}
          style="fill: {region.background.color};"
        />

        <g id={region.region.replace(/\s/g, '').replace('+','-') + "-elements"}>
          {#each region.leaves as leaf}
          <rect
            class="tile leaf {leaf.data.type}"
            fill={data.type === "sectors" ? colorSectors(leaf.data.type) : colorFuels(leaf.data.type)}
            width={leaf.x1 - leaf.x0}
            height={leaf.y1 - leaf.y0}
            x={region.x + leaf.x0}
            y={region.y + leaf.y0}
            rx="2"
            ry="2"
            on:mouseenter={()=>{
              currentRegion =
              region; leaf.data.type !== region.mostPollutingType ?
                showConcreteType = true :
                showConcreteType = false;
              currentLeaf = leaf;
              showInformation = false;}
              }
            on:mouseout={()=>{showInformation = true; showConcreteType = false;}}
            on:blur={()=>{showInformation = true; showConcreteType = false;}}
          />
          {/each}
        </g>
      </g>
    {/each}

    {#each legendTypeParams as current}
          <rect
          class="leaf-legend"
          fill={data.type === "sectors" ? colorSectors(current.type) : colorFuels(current.type)}
          width={current.width}
          height={current.height}
          x={current.x}
          y={current.y}
          rx="2"
          ry="2"
          cx="0"
          cy="0"
          >

          </rect>
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
    filter: drop-shadow( 0 0 3px rgba(0, 0, 0, 1));
  }
  .leaf-legend {
    stroke: transparent;
    stroke-width:0.5;
    transform: scale(1);
    transform-box: fill-box;
    transform-origin: center;
    animation: popupType .2s forwards;
  }
  @keyframes popupType {
    to {
      stroke: black;
      transform: scale(1.3);
    }
  }
</style>