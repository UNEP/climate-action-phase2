<script lang="ts">
  //import Cartogram, {CountryDataPoint} from "src/components/maps/Cartogram.svelte";
  import type {CountryDataPoint} from "src/components/maps/Cartogram.svelte";
  import Cartogram from "src/components/maps/Cartogram.svelte";
  import pm25data from 'src/data/pm25_coords.json';

  //export var data:string = "pm25"; // "pm25" / "health"

  let selectedDataset = pm25data;
  let selectedNodeSize = 125;

  let cartogramData: CountryDataPoint[] = selectedDataset
    .map(d => {
      return {
        name: d.id, 
        short: "USA",
        code: d.id,
        x: d.x,
        y: d.y, 
        value: d.pm25
      };
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
    position: relative;
    border: 1px solid rgb(255, 255, 255);
    width: fit-content;
    height: fit-content;
  }
</style>