<script lang="ts">
  import Cartogram from "src/components/maps/Cartogram.svelte";
  import pm25data from 'src/data/pm25_coords.json';
  import countries from 'src/data/countries.json';
  import policies from 'src/data/policiesData.json';
  import countryNameDictionary from 'src/data/countryDictionary.json';
  import deaths_data from 'src/data/death_coords.json';
  import Legend from "src/components/common/Legend.svelte";
  import { colorPM25, colorHealth, colorPolices } from "src/App.svelte";
  import {createLookup, hexToRgb} from 'src/util';

  import type {CountryDataPoint} from "src/components/maps/Cartogram.svelte";
  import type { TextBlock} from 'src/types';
  import type { RGB } from 'src/util'
import ScrollableX from "./common/ScrollableX.svelte";

  export var data:string;
  export var head:string;
  export var text:TextBlock[];

  interface PoliciesData{
    name : string;
    id : string;
    "ind-1" : number;
    "tra-1" : number;
    "tra-2" : number;
    "waste-1" : number;
    "a1-1" : number;
    pYes : number;
    pNo : number;
    pAlmost : number
  }

  enum Datasets {
    pm25  = 0, health =  1, policies = 2
  }

  enum PoliciesStatus {
    Yes = 1, No = 2, Almost = 3, NoData = 4
  }

  const policiesLookup = createLookup(policies, d => d.id, d => d);
  const countryNameDictionaryLookup = createLookup(countryNameDictionary, d => d.id, d => d);
  let legendElementSelectedIndex = -1;
  let legendElementSelected = "";
  let width : number;
  let height : number;

  const policiesHoverText = (data : PoliciesData) : string => {

    let hasPolicies = false;
    let hoverText = `<strong>${data.name}</strong> has policies for: `;
    if(data['ind-1'] == PoliciesStatus.Yes || data['ind-1'] == PoliciesStatus.Almost) { hoverText += `<br/><strong>─ Clean production incentives</strong>`; hasPolicies = true; }
    if(data['ind-1'] == PoliciesStatus.Almost) hoverText += ` (Almost)`;

    if(data['tra-1'] == PoliciesStatus.Yes || data['tra-1'] == PoliciesStatus.Almost) { hoverText += `<br/><strong>─ Vehicle emissions standards</strong>`; hasPolicies = true; }
    if(data['tra-1'] == PoliciesStatus.Almost) hoverText += ` (Almost)`;

    if(data['tra-2'] == PoliciesStatus.Yes || data['tra-2'] == PoliciesStatus.Almost) { hoverText += `<br/><strong>─ Fuel Sulphur content</strong>`; hasPolicies = true; }
    if(data['tra-2'] == PoliciesStatus.Almost) hoverText += ` (Almost)`;

    if(data['waste-1'] == PoliciesStatus.Yes || data['waste-1'] == PoliciesStatus.Almost) { hoverText += `<br/><strong>─ Solid Waste Burning</strong>`; hasPolicies = true; }
    if(data['waste-1'] == PoliciesStatus.Almost) hoverText += ` (Almost)`;

    if(data['res-1'] == PoliciesStatus.Yes || data['res-1'] == PoliciesStatus.Almost) { hoverText += `<br/><strong>─ Incentives for residential cooking and heating</strong>`; hasPolicies = true; }
    if(data['res-1'] == PoliciesStatus.Almost) hoverText += ` (Almost)`;

    if(data['aq-1'] == PoliciesStatus.Yes || data['aq-1'] == PoliciesStatus.Almost) { hoverText += `<br/><strong>─ Air quality standards</strong>`; hasPolicies = true; }
    if(data['aq-1'] == PoliciesStatus.Almost) hoverText += ` (Almost)`;

    if(!hasPolicies) hoverText += `<br/><strong>─ No policies</strong>`

    return hoverText;
  }

  const datasetParams = {
    pm25: {
      nodeSize: 11,
      help: {
        code: "CPV",
        text:
        `<strong>Each square is a country</strong>, sized
         by the annual mean levels of <strong>small particular
         matter PM2.5</strong>, measured in µg/m<sup>3</sup>.`
      },
      hoverTextFn: (d: CountryDataPoint) =>
      `In <strong>${d.name}</strong>, people are exposed
       to an average of <strong>${d.value} μg/m<sup>3</sup>
      </strong> a year —<strong>${(d.value/10).toFixed(1)}
      </strong> the WHO guideline.`,
      colorFn: (d: CountryDataPoint) => colorPM25(d.value),
      categoryFn: (d) => {
        return colorPM25(d.value)
      },
      color: colorPM25,
      legendTitle: `As a multiple of the <strong>WHO's guideline</strong> (10 µg/m<sup>3</sup>)`,
      legendDomain: ["x1", "2", "3", "4", "5", "6", "7"],
      legendDictionary: [0,10,20,30,40,50,60,70],
      legendType: 'sequential',
      domain: [700, 400]
    },

    health: {
      nodeSize: 73,
      help: {
        code: "BRA",
        text:
        `<strong>Each square is a country</strong>,
        sized by the total number of <strong>deaths
        caused by small particle pollution</strong>.`
      },
      hoverTextFn: (d:CountryDataPoint) =>
      `In <strong>${d.name}</strong>, small particle
      pollution caused <strong>${d.value} deaths</strong>
      in 2017 —or <strong>${d.rate} per 100,000 people</strong>.`,
      colorFn: (d: CountryDataPoint) => colorHealth(d.rate),
      categoryFn: () => {

      },
      color: colorHealth,
      legendTitle: `<strong>Deaths per 100,000 people</strong> caused by small particle pollution`,
      legendDomain: ["10", "20", "30", "40", "50", "60", "70", "80", "100"],
      legendDictionary: [10,20,30,40,50,60,70,80,90,100],
      legendType: 'sequential',
      domain: [700, 400]
    },

    policies: {
      nodeSize: 16,
      help: {
          code: "JPN",
          text:
          `<strong>Each square is a country</strong>,
           sized by the total number of <strong>deaths
           caused by small particle pollution</strong>.`
      },
      hoverTextFn: (d:CountryDataPoint) => policiesHoverText(d.data as PoliciesData),
      colorFn: (d: CountryDataPoint, les: string) => {

        let yes : RGB = hexToRgb(colorPolices(PoliciesStatus.Yes.toString()));
        let no : RGB = hexToRgb(colorPolices(PoliciesStatus.No.toString()));
        let almost : RGB = hexToRgb(colorPolices(PoliciesStatus.Almost.toString()));
        let noData : RGB = hexToRgb(colorPolices(PoliciesStatus.NoData.toString()));
        let yesOpacity = "0.0";
        let noOpacity = "0.0";
        let almostOpacity = "0.0";
        let noDataOpacity = "0.0";

        switch(les){
          case "y":
            yesOpacity = "1";
            break;
          case "n":
            noOpacity = "1";
            break;
          case "cbb":
            almostOpacity = "1";
            break;
          case "nd":
            noDataOpacity = "1";
            break;
          default:
            yesOpacity = "1";
            noOpacity = "1";
            almostOpacity = "1";
            noDataOpacity = "1";
            break;
        }

        return (
          `linear-gradient(to bottom, rgb(${yes.r},${yes.g} ,${yes.b}, ${yesOpacity}) ${d.data.pYes}%,
          rgb(${almost.r},${almost.g} ,${almost.b}, ${almostOpacity}) ${d.data.pYes}% ${d.data.pAlmost}%,
          rgb(${no.r},${no.g} ,${no.b}, ${noOpacity}) ${d.data.pAlmost}% ${d.data.pNo}%,
          rgb(${noData.r},${noData.g} ,${noData.b}, ${noDataOpacity}) ${d.data.pNo}%)`
        );
      },
      categoryFn: () => {

      },
      color: colorPolices,
      legendTitle: `<strong>Deaths per 100,000 people</strong> caused by small particle pollution`,
      legendDomain: ["Has Policies", "Has no policies", "Could be better", "No data"],
      legendDictionary: ["y", "n", "cbb", "nd"],
      legendType: 'categorical',
      domain: [1300, 1300 / (740/420)],
    }
  };

  let datasets = {

    [Datasets.pm25]: pm25data
        .map(d => {
            return {
              name: countryNameDictionaryLookup[d.id].name,
              short: countryNameDictionaryLookup[d.id].name,
              code: d.id,
              x: d.x,
              y: d.y,
              value: d.pm25,
            };
        }),
    [Datasets.health]: deaths_data
        .map(d => {
            return {
              name: countryNameDictionaryLookup[d.id].name,
              short: countryNameDictionaryLookup[d.id].name,
              code: d.id,
              x: d.x,
              y: d.y,
              value: d.deaths,
              rate: d.rate
            };
        }),
    [Datasets.policies]: countries
        .filter((d) => policiesLookup[d.code])
        .map(d => {
            return {
              ...d,
              ...d.trends,
              value: 5,
              data : policiesLookup[d.code]
            };
        })
  };

  $: {
    legendElementSelected = "";

    if(
      legendElementSelectedIndex >= 0 &&
      legendElementSelectedIndex < datasetParams[data].legendDictionary.length &&
      legendElementSelectedIndex != null
    ){
      if(data !== "policies") legendElementSelected = datasetParams[data].color(datasetParams[data].legendDictionary[legendElementSelectedIndex]);
      else legendElementSelected = datasetParams[data].legendDictionary[legendElementSelectedIndex];
    }
  }

  $: height = width * (data === 'pm25' ? .55 : .62);

  </script>

<section class="viz wide">
  <h2 class='narrow'>{@html head}</h2>

  <div class="right-narrow" >
    <Legend
      title = {datasetParams[data].legendTitle}
      colors = {datasetParams[data].color.range()}
      labels = {datasetParams[data].legendDomain}
      type = {datasetParams[data].legendType}
      bind:selected = {legendElementSelectedIndex}
    />
  </div>
  <ScrollableX>
    <div bind:clientWidth={width} style="width:{width}px; height:{height}px">
      <Cartogram
        data={datasets[Datasets[data]]}
        domain={datasetParams[data].domain}
        categoryFn={() => null}
        colorFn={datasetParams[data].colorFn}
        hoverTextFn={datasetParams[data].hoverTextFn}
        nodeSize={datasetParams[data].nodeSize}
        helpText={datasetParams[data].help}
        {legendElementSelected}
        dataType = {data}
      />
    </div>
  </ScrollableX>

  {#each text as t}
    <p class='col-text'>{@html t.p}</p>
  {/each}

</section>