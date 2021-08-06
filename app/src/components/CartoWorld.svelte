<script lang="ts">
  //import Cartogram, {CountryDataPoint} from "src/components/maps/Cartogram.svelte";
  import type {CountryDataPoint} from "src/components/maps/Cartogram.svelte";
  import Cartogram from "src/components/maps/Cartogram.svelte";
  import pm25data from 'src/data/pm25_coords.json';

  export var data:string = "pm25"; // "pm25" / "health"

  let selectedDataset = pm25data;
  let selectedNodeSize:number = 125;

  let cartogramData: CountryDataPoint[] = selectedDataset
    .map(d => {
      const name = d.id;
      const short = "SHORT";
      const code = d.id;
      const x = d.x;
      const y = d.y;
      const value = d.pm25;
      return {
        name, short, code, x, y, value
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
    position: relativa;
    border: 1px solid #777;
    width: fit-content;
    height: fit-content;
  }
</style>