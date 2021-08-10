<script lang="ts" context="module">
  export interface RegionTreemapData{
    leaves: any,
    background: {
      borderTop: number,
      borderBottom: number,
      borderLeft: number,
      borderRight: number,
      x: number,
      y: number,
      color: string,
      region: string,
    },
    x: number,
    y: number,
    totalPollutingValue: number,
    mostPollutingValue: any,
    mostPollutingType: any
  };
</script>
<script lang="ts">


  import * as d3 from 'src/d3';
  import {colorSectors, colorFuels} from '../../App.svelte';
  import type { CartoRegionData } from 'src/types';


  interface HierarchicalDatum {
    value?: number;
    type?: string;
    types?: HierarchicalDatum[];
  };

  export let handleMouseOver;
  export let handleMouseOut;
  export let handleMouseOverTreemap;
  export let handleMouseOutTreemap;
  export let data: CartoRegionData;
  export let width: number;
  export let height: number;
  

  const mapPropotions =  (val) => Math.sqrt(val)*width*0.03;
  
  let regions : RegionTreemapData[];
    
  $: regions = data.regions.map(region => {
    const convertX = (val: number) => width * val / data.scale_width;
    const convertY = (val: number) => height * val / data.scale_height;
    
    const hierarchy = d3.hierarchy<HierarchicalDatum>(region, node => node.types)
      .sum(node => node.value || 0)
      .sort((a,b) => b.value - a.value);

    const treemap = d3.treemap<HierarchicalDatum>()
      .size([mapPropotions(region.totalValue/region.numCountries), mapPropotions(region.totalValue/region.numCountries)])
      .padding(2)
      (hierarchy);
    

    const background = {
      borderTop  : 2,
      borderBottom: 2,
      borderLeft: 2,
      borderRight: 2,
      x: convertX(region.posX),
      y: convertY(region.posY),
      color: "#f3f3f3",
      region: region.region
    };
   
    return {
      leaves : treemap.leaves(),
      background,
      x : convertX(region.posX),
      y : convertY(region.posY),
      totalPollutingValue : treemap.value/region.numCountries,
      mostPollutingValue : treemap.children[0].data.value,
      mostPollutingType : treemap.children[0].data.type
    };
  });

</script>

<div class="svg" {width} {height}>
  <svg id="treemapCartogram" {width} {height}>
    <filter id="shadow" x="-10%">
      <feDropShadow dx="0" dy="0"></feDropShadow>
    </filter>
    {#each regions as region}
      <g id={region.background.region.replace(/\s/g, '').replace('+','-') + "-group"}>
        <rect
          id = {region.background.region.replace(/\s/g, '').replace('+','-') + "-background"}
          class="tile"
          width={mapPropotions(region.totalPollutingValue) + region.background.borderRight + region.background.borderLeft}
          height={mapPropotions(region.totalPollutingValue) + region.background.borderTop + region.background.borderBottom}
          x={region.background.x - region.background.borderRight}
          y={region.background.y - region.background.borderBottom}
          rx="2"
          ry="2"
          filter="none"
          on:mouseover={handleMouseOverTreemap(this, region)}
          on:focus={handleMouseOverTreemap(this,region)}
          on:mouseout={handleMouseOutTreemap(this)}
          on:blur={handleMouseOutTreemap(this)}
          style="fill: {region.background.color};"
        />
        <g id={region.background.region.replace(/\s/g, '').replace('+','-') + "-elements"}>
          {#each region.leaves as leaf}
          <rect
            class="tile"
            fill={data.type === "sectors"? colorSectors(leaf.data.type): colorFuels(leaf.data.type)}
            width={leaf.x1 - leaf.x0}
            height={leaf.y1 - leaf.y0}
            x={region.x + leaf.x0}
            y={region.y + leaf.y0}
            rx="2"
            ry="2"
            on:mouseover={handleMouseOver(this, (leaf.data))}
            on:focus={handleMouseOver(this, leaf.data)}
            on:mouseout={handleMouseOut(this)}
            on:blur={handleMouseOut(this)}
          />
          {/each}
        </g>
      </g>
    {/each}

  </svg>
</div>

<style>
  .svg {
    border-width: 0.5px;
    border-style: solid;
    border-color: black;
    background-color: rgb(237,237,237);
  }
</style>