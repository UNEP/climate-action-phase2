<script lang="ts">
  import type {CountryDataPoint} from "src/components/maps/Cartogram.svelte";
  import * as d3 from 'src/d3';
  import Cartogram from "src/components/maps/Cartogram.svelte";
  import pm25data from 'src/data/pm25_coords.json';
  import countryNameDictionary from 'src/data/countryDictionary.json';
  import deaths_data from 'src/data/death_coords.json'
  //import shortCountryNameDictionary from 'src/data/countryDictionary.json';

  export var data = "pm25"; // "pm25" / "health"

  let selectedDataset = pm25data;
  let selectedNodeSize = 11;

  var colorPalette = ['#ffbeb3','#eda6ac','#dc8ea5','#ca769e','#b85f97','#a5468f','#932b88','#800080'];
  //colorPalette.reverse();

  let cartogramData: CountryDataPoint[] = selectedDataset
    .map(d => {
      return {
        name: countryNameDictionary.find(c => c.id === d.id).name,
        short: "*",
        code: d.id,
        x: d.x,
        y: d.y,
        value: data === "pm25" ? d.pm25 : 0
      };
    });

</script>

<div class="container">
  <Cartogram
    data={cartogramData}
    domain={[700, 400]}
    categoryFn={() => null}
    colorFn={d => colorPalette[Math.floor(d.value/10)]}
    hoverTextFn={d => `${d.name} emitted ${d.value} μg/m3 of PM2.5`}
    nodeSize={selectedNodeSize}
    helpText={{code: "CPV", text: "Each square represents a country,\n scaled by its PM2.5 emissions"}}
  />
</div>

<style>
  .container {
    position: relative;
    width: 700px;
    height: 400px;
  }
</style>