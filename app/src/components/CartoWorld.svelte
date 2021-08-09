<script lang="ts">
  //import Cartogram, {CountryDataPoint} from "src/components/maps/Cartogram.svelte";
  import type {CountryDataPoint} from "src/components/maps/Cartogram.svelte";
  import Cartogram from "src/components/maps/Cartogram.svelte";
  import pm25data from 'src/data/pm25_coords.json';

  export var data = "pm25"; // "pm25" / "health"

  let selectedDataset = pm25data;
  let selectedNodeSize = 11;

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
    colorFn={d => 'red'}
    hoverTextFn={d => `${d.code} ${d.value}`}
    nodeSize={selectedNodeSize}
    helpText={{code: "USA", text: "test help text"}}
  />
</div>

<style>
  .container {
    position: relative;
    width: 700px;
    height: 400px;
  }
</style>