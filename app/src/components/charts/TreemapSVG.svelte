<script lang="ts">
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

  let convertX = (val: number) => width * val / data.scale_width;
  let convertY = (val: number) => height * val / data.scale_height

  const regions = data.regions.map(region => {
    let hierarchy = d3.hierarchy<HierarchicalDatum>(region, node => node.types)
      .sum(node => node.value || 0)
      .sort((a,b) => b.value - a.value);

    const canvasWidth = convertX(region.width);
    const canvasHeight = convertY(region.height);

    let treemap = d3.treemap<HierarchicalDatum>()
      .size([canvasWidth, canvasHeight])
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
      <g>
        <rect
          class="tile"
          width={region.background.width + region.background.borderRight + region.background.borderLeft}
          height={region.background.height + region.background.borderTop + region.background.borderBottom}
          x={region.background.x - region.background.borderRight}
          y={region.background.y - region.background.borderBottom}
          rx="2"
          ry="2"
          filter="url(#shadow)"
          on:mouseover={handleMouseOutTreemap}
          on:focus={handleMouseOverTreemap}
          on:mouseout={handleMouseOutTreemap}
          on:blur={handleMouseOutTreemap}
        />
      </g>

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
          stroke="transparent"
          stroke-linecap="butt"
          stroke-width="0.5"
        />
      {/each}

    {/each}

  </svg>
</div>

<style>
  .svg {
    position:absolute;
    border-width: 0.5px;
    border-style: solid;
    border-color: black;
    background-color: rgb(237,237,237);
  }
</style>