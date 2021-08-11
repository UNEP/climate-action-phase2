<script lang="ts">
  import TreemapSvg from 'src/components/charts/TreemapSVG.svelte';
  import {sectoralBD, differentFuels} from  'src/data';

  interface Text {
    p : string;
  }

  export let data : string;
  export let head : string;
  export let text : Text[];
  export let source : string;

  const currentData = data === "sectors" ? sectoralBD: data === "fuel"? differentFuels : null;

  const scaleRate = currentData.scale_height / currentData.scale_width;

  let width = 100;
  let height;

  $:  height = width * scaleRate;

</script>

<div class="head">
  <p>{head}</p>
</div>

<div bind:clientWidth={width} >
  <TreemapSvg
    data={currentData}
    {width}
    {height}
    {source}
  />
</div>


<div class="text">
  {#each text as t}
  <p>{t.p}</p>
  {/each}
</div>

<style>
  .head p{
    font-size: 2em;
    width: 50%;
    margin-top: 100px;
  }

  .text p{
    font-size: 18px;
    width: 70%;
  }
</style>
