<script lang="ts">
import { tree } from 'd3-hierarchy';

  import * as d3 from 'src/d3';
  import type { CartoRegionData } from 'src/types';


  interface HierarchicalDatum {
    value?: number;
    type?: string;
    types?: HierarchicalDatum[];
  }

  export let handleMouseOver;
  export let handleMouseOut;
  export let handleMouseOverTreemap;
  export let handleMouseOutTreemap;
  export let data: CartoRegionData;
  export let currentRegionData;
  export let width: number;
  export let height: number;
  

  const mapPropotions =  (val) => Math.sqrt(val)*width*0.03
  
  let regions;
    
  $: regions = data.regions.map(region => {
    const convertX = (val: number) => width * val / data.scale_width;
    const convertY = (val: number) => height * val / data.scale_height
    
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
      width: convertX(region.width),
      height: convertY(region.height),
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
 
  const colorSectors = d3.scaleOrdinal<string>()
    .domain(['intlshipping','transport','residential','commercial','industry','afciddust','othercombustion','remainingsources','otherfires','agrwasteburning','agriculture','windblowndust','waste','solvents','energy'])
    .range(['#9b7ccc','#811494','#407aa9','#ff9c9c','#ab4867','#b3b3b3','#8c8c8c','#666666','#333333','#62b048','#1b6e29','#faba26','#bd8e71','#854f38','#ff8a18']);

  const handleMouseOverNode = (evt, node) => {
    currentRegionData.region = node.leave.parent.data.region
    currentRegionData.type = node.leave.data.type;
    currentRegionData.value = node.leave.data.value
    currentRegionData.total = node.leave.parent.value
    currentRegionData.current.value = node.leave.parent.value
    currentRegionData.current.type = node.leave.data.type;
    handleMouseOver(evt);
  }

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
            fill={colorSectors(leaf.data.type)}
            width={leaf.x1 - leaf.x0}
            height={leaf.y1 - leaf.y0}
            x={region.x + leaf.x0}
            y={region.y + leaf.y0}
            rx="2"
            ry="2"
            on:mouseover={handleMouseOver(this, leaf.data)}
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