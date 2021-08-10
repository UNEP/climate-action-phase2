<script lang="ts">
  import type {CountryDataPoint} from "src/components/maps/Cartogram.svelte";
  import Cartogram from "src/components/maps/Cartogram.svelte";
  import pm25data from 'src/data/pm25_coords.json';
  import countryNameDictionary from 'src/data/countryDictionary.json';
  import deaths_data from 'src/data/death_coords.json'

  export var data:string; // "pm25" / "health"

  let selectedDataset = data === "pm25" ? pm25data : deaths_data;
  let selectedNodeSize = data === "pm25" ? 11 : 73;

  const PM25colorPalette = ['#ffbeb3','#eda6ac','#dc8ea5','#ca769e',
  '#b85f97','#a5468f','#932b88','#800080'];

  const healthColorPalette = ['#facc6e', '#f3b670', '#eaa073', '#de8b75',
  '#d07877', '#bf6578', '#ac557a', '#95477c', '#7a3b7f', '#7a3b7f', '#583382'];

  function colorFunction(d: CountryDataPoint) {
    return data === "pm25" ? PM25colorPalette[Math.floor(d.value/10)] : healthColorPalette[Math.floor(d.rate/10)];
  }

  function hoverTextFunction(d: CountryDataPoint){
    if (data === "pm25"){
      return `${d.name} emitted ${d.value} μg/m3 of PM2.5`;
    }
    else{
      return `${d.name} had a total of ${d.value} attributable deaths`;
    }
  }

  let cartogramData: CountryDataPoint[] = selectedDataset
    .map(d => {
      return {
        name: countryNameDictionary.find(c => c.id === d.id).name,
        short: countryNameDictionary.find(c => c.id === d.id).name,
        code: d.id,
        x: d.x,
        y: d.y,
        value: data === "pm25" ? d.pm25 : d.deaths,
        rate: data === "health" ? d.rate : null
      };
    });

</script>

<div class="container">
  <Cartogram
    data={cartogramData}
    domain={[700, 400]}
    categoryFn={() => null}
    colorFn={d => colorFunction(d)}
    hoverTextFn={d => hoverTextFunction(d)}
    nodeSize={selectedNodeSize}
    helpText={data === "pm25" ? 
    {code: "CPV", text: "Each square represents a country, scaled by its PM2.5 emissions"}
    :{code: "BRA", text: "Each square represents a country, scaled by the number of attributable deaths"}}
  />
</div>

<style>
  .container {
    position: relative;
    width: 700px;
    height: 400px;
  }
</style>
