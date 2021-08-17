<script lang="ts">
  import type {CountryDataPoint} from "src/components/maps/Cartogram.svelte";
  import Cartogram from "src/components/maps/Cartogram.svelte";
  import type { TextBlock } from 'src/types';
  import pm25data from 'src/data/pm25_coords.json';
  import countries from 'src/data/countries.json';
  import policies from 'src/data/policiesData.json';
  import countryNameDictionary from 'src/data/countryDictionary.json';
  import deaths_data from 'src/data/death_coords.json';
  import Legend from "src/components/common/Legend.svelte";
  import { colorPM25, colorHealth, colorPolices } from "src/App.svelte";
  import {createLookup} from 'src/util';

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

  data = "policies";
  enum Datasets {
    pm25  = 0, health =  1, policies = 2
  }

  enum PoliciesStatus {
    Yes = 1, No = 2, Almost = 3, NoData = 4
  }


  let width;
  $: height = width * (data === 'pm25' ? .55 : .62);

  const policiesHoverText = (data : PoliciesData) : string => {
    console.log(data);
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
    return hoverText
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
      color: colorPM25,
      legendTitle: `As a multiple of the <strong>WHO's guideline</strong> (10 µg/m<sup>3</sup>)`,
      legendDomain: ["x1", "2", "3", "4", "5", "6", "7"],
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
      color: colorHealth,
      legendTitle: `<strong>Deaths per 100,000 people</strong> caused by small particle pollution`,
      legendDomain: ["10", "20", "30", "40", "50", "60", "70", "80", "100"],
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
      colorFn: (d: CountryDataPoint) => {
        return  (
          `linear-gradient(to bottom, ${colorPolices(PoliciesStatus.Yes.toString())} ${d.data.pYes}%,
          ${colorPolices(PoliciesStatus.Almost.toString())} ${d.data.pYes}% ${d.data.pAlmost}%,
          ${colorPolices(PoliciesStatus.No.toString())} ${d.data.pAlmost}% ${d.data.pNo}%,
          ${colorPolices(PoliciesStatus.NoData.toString())} ${d.data.pNo}%)`
        );
      },
      color: colorPolices,
      legendTitle: `<strong>Deaths per 100,000 people</strong> caused by small particle pollution`,
      legendDomain: ["Has Policies", "Has no policies", "Could be better", "No data"],
      legendType: 'categorical',
      domain: [1300, 1300 / (740/420)],
    }
  };

  const policiesLookup = createLookup(policies, d => d.id, d => d);
  const countryNameDictionaryLookup = createLookup(countryNameDictionary, d => d.id, d => d)

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

</script>

<section class="viz wide">
  <h2 class='narrow'>{@html head}</h2>

  <div class="right-narrow" >
    <Legend
      title = {datasetParams[data].legendTitle}
      colors = {datasetParams[data].color.range()}
      labels = {datasetParams[data].legendDomain}
      type = {datasetParams[data].legendType}
  />
  </div>

  <div bind:clientWidth={width} style="width:{width}px; height:{height}px">
    <Cartogram
      data={datasets[Datasets[data]]}
      domain={datasetParams[data].domain}
      categoryFn={() => null}
      colorFn={datasetParams[data].colorFn}
      hoverTextFn={datasetParams[data].hoverTextFn}
      nodeSize={datasetParams[data].nodeSize}
      helpText={datasetParams[data].help}
    />
  </div>

  {#each text as t}
    <p class='col-text'>{t.p}</p>
	{/each}

</section>
