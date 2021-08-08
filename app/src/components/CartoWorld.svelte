<script lang="ts">
  //import Cartogram, {CountryDataPoint} from "src/components/maps/Cartogram.svelte";
  import type {CountryDataPoint} from "src/components/maps/Cartogram.svelte";
  import Cartogram from "src/components/maps/Cartogram.svelte";
  import pm25data from 'src/data/pm25_coords.json';

  export var data = "pm25"; // "pm25" / "health"

  let selectedDataset = pm25data;
  let selectedNodeSize = 125;

  let cartogramData: CountryDataPoint[] = selectedDataset
    .map(d => {
      if (data === "pm25"){
        return {
        name: d.id, 
        short: "*",
        code: d.id,
        x: d.x,
        y: d.y, 
        value: d.pm25
        };
      }
      else{ //health
        return {
          name: d.id,
          short: "USA",
          code: d.id,
          x: d.x,
          y: d.y, 
          value: d.pm25
        }
      }
    });

</script>

<div class="container">
  <Cartogram
    data={cartogramData}
    domain={[700, 400]}
    categoryFn={() => null}
    hoverTextFn={() => 'hover text'}
    nodeSize={selectedNodeSize}
  />
</div>

<style>
  .container {
    color: aquamarine;
    border: 1px solid rgb(100, 100, 100);
  }
</style>