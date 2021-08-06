<script lang="ts">
  import Cartogram, { CountryDataPoint } from "src/components/maps/Cartogram.svelte";
  import pm25data from 'src/data/pm25_coords.json';
  //import deathsData from 'src/data/death_coords.json';

  export var data: string; // "pm25" / "health"

  let selectedDataset = pm25data;
  let selectedNodeSize = 125;

  let cartogramData: CountryDataPoint[] = selectedDataset
    .map(d => {
      // d =
      // {
      //   "id": "AFG",
      //   "pm25": 44.6,
      //   "x": 481.366,
      //   "y": 135.288
      // }

      return {
        name: 'XXX',
        short: 'XXX',
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

  }
</style>