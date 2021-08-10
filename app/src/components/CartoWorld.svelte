<script lang="ts">
  import { scaleThreshold } from 'd3-scale';
  import type {CountryDataPoint} from "src/components/maps/Cartogram.svelte";
  import Cartogram from "src/components/maps/Cartogram.svelte";
  import pm25data from 'src/data/pm25_coords.json';
  import countryNameDictionary from 'src/data/countryDictionary.json';
  import deaths_data from 'src/data/death_coords.json';
  import Legend from "./common/Legend.svelte";

  export var data:string;

  const datasetParams = {
    pm25: {
      nodeSize: 11,
      help: {
        code: "CPV",
        text: "Each square represents a country, scaled by its PM2.5 emissions"
      },
      color: scaleThreshold<number, string>()
      .domain([...new Array(7)].map((d,i) => (i+1)*10))
      .range(['#ffbeb3','#eda6ac','#dc8ea5','#ca769e',
      '#b85f97','#a5468f','#932b88','#800080']),
      legendTitle: "PM2.5 emissions in μg/m3"
    },

    health: {
      nodeSize: 73,
      help: {
        code: "BRA",
        text: "Each square represents a country, scaled by the number of attributable deaths"
      },
      color: scaleThreshold<number, string>()
      .domain([10,20,30,40,50,60,70,80,100])
      .range(['#facc6e', '#f3b670', '#eaa073', '#de8b75', '#d07877', 
      '#bf6578', '#ac557a', '#95477c', '#7a3b7f', '#583382']),
      legendTitle: "Number of attributable deaths"
    }
  };

  let dsParam = data === "pm25" ? datasetParams.pm25 : datasetParams.health;
  let selectedDataset = data === "pm25" ? pm25data : deaths_data;

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
    }
  );

  function colorFunction(d: CountryDataPoint) {
    return data === "pm25" ? dsParam.color(d.value) : dsParam.color(d.rate);
  }

  function hoverTextFunction(d: CountryDataPoint){
    if (data === "pm25"){
      return `${d.name} emitted ${d.value} μg/m3 of PM2.5`;
    }
    else{
      return `${d.name} had a total of ${d.value} attributable deaths`;
    }
  }

</script>

<div class="container">
  <div class="cartogram-container">
    <Cartogram
    data={cartogramData}
    domain={[700, 400]}
    categoryFn={() => null}
    colorFn={d => colorFunction(d)}
    hoverTextFn={d => hoverTextFunction(d)}
    nodeSize={dsParam.nodeSize}
    helpText={{code: dsParam.help.code, text: dsParam.help.text}}
  />
  </div>

  <div class="legend-container">
    <Legend
    title = {dsParam.legendTitle}
	  colors = {dsParam.color.range()}
	  labels = {dsParam.color.domain().map(String)}
	  type = {'sequential'}
  />
  </div>
</div>


<style>

  .cartogram-container {
    width: 700px;
    height: 400px;
  }

  .container {
    position: relative;
    width: 700px;
    height: 500px;
  }

  .legend-container {
    width: 75%;
    position: relative;
    padding-left: 70px;
    height: 100px;
  }

</style>
