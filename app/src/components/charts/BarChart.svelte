<script lang="ts">
    import Annotation from '../maps/Annotation.svelte';
    import {colorSectors, colorFuels} from 'src/App.svelte';
    import regionDictionary from 'src/data/regionDictionary.json';
    import meanSectorRegions from 'src/data/regionalMean_sectors.json';
    import meanFuelRegions from 'src/data/regionalMean_fuels.json';
    import { createLookup } from 'src/util';

    
    const width = 950;
    const height = 125;
    const tileHeight = 85;
    const similarityRange = 1;
    const regionLookUp = createLookup(regionDictionary, r => r.id, r => r.region);

    export var tiles: {categoryName: string, value: number}[];
    export var selectedDataset: string;
    export var selectedCountry: string = null;

    const colorFunction = (d: string) => selectedDataset === "fuels" ? colorFuels(d) : colorSectors(d);

    const categoryDictionary = {
      sector: {
        'waste': 'Waste',
        'windblowndust': 'Windblown dust',
        'solvents' : 'Solvents',
        'intlshipping': 'International shipping',
        'transport': 'Transport',
        'residential': 'Residential',
        'othercombustion': 'Other combustion',
        'commercial': 'Commercial',
        'remainingsources': 'Remaining sources',
        'industry': 'Industry',
        'otherfires': 'Other fires',
        'agrwasteburning': 'Agr. waste burning',
        'energy': 'Energy',
        'agriculture': 'Agriculture',
        'afciddust': 'AFCID dust'
      },
      fuel: {
        'solidbio': 'Solid bio',
        'process': 'Process',
        'coal': 'Coal',
        'liquid': 'Liquid'
      },
      disease: {
        'COPD': 'Chronic obstructive pulmonary disease',
        'DM': 'Diabetes mellitus type 2',
        'IHD': 'Ischemic heart disease',
        'LC': 'Lung cancer',
        'LRI': 'Lower respiratory infections',
        'Stroke': 'Stroke',
        'PTB': 'Pulmonary Tuberculosis',
        'LBW': 'Low birth weight'
      }
    };

    function categoryTranslator(category: string){
      if (selectedDataset === "fuels"){
        return categoryDictionary.fuel[category];
      }
      else if (selectedDataset === "sectors"){
        return categoryDictionary.sector[category];
      }
      else {
        return categoryDictionary.disease[category];
      }
    }

    function calculateTotalSum(){
      let sum = 0;
      tiles.forEach(d => {
        sum += d.value;
      });
      return sum;
    }


    function generateDeathPhrase(text: {sentence1: string, sentence2: string}, 
      numSentence: number, lastProcessed: number, percent: number){
        
      let commentary: string;
      let keepSearching = true;
      let leadingCauses = [];
      while (keepSearching && lastProcessed < tiles.length){
        if (tiles[lastProcessed].value >= percent){
          leadingCauses.push(tiles[lastProcessed].categoryName);
          lastProcessed++;
        }
        else { keepSearching = false; }
      }
          
      if (leadingCauses.length === 1){
        if (numSentence === 1){
          commentary = `The leading cause of death is: <b>` 
            + categoryTranslator(leadingCauses[0]) + `</b>.`;
        }
        else {
          commentary = ` Another significant cause is: <b>` 
            + categoryTranslator(leadingCauses[0]) + `</b>.`;
        }
      }

      else if (leadingCauses.length === 0){
        if (numSentence === 1){
          commentary = `An important cause of death is: <b>` 
            + categoryTranslator(tiles[0].categoryName) + `</b>.`;
        }
        else {
          commentary = ``;
        }
        lastProcessed++;
      }

      else {
        if (numSentence === 1){
          commentary = `The leading causes of death are: <b>`;
        }
        else{
          commentary = ` Other significant causes are: <b>`;
        }

        let a = 0;
        while (a < leadingCauses.length){
          commentary += categoryTranslator(leadingCauses[a]);
          if (a === leadingCauses.length - 2){
            commentary += `</b> and <b>`;
          }
          else if (a === leadingCauses.length - 1){
            commentary += `</b>.`;
          }
          else{
            commentary += `</b>, <b>`;
          }
          a++;
        }
      }
      
      if (numSentence === 1){ text.sentence1 = commentary; } 
      else { text.sentence2 = commentary; }

      return lastProcessed;
    }


    function generateDeathsCommentary(){
      let text = {
        sentence1: '',
        sentence2: ''
      };

      let lastProcessed = 0;
      let _50percent = (50 / 100 * totalValue);
      let _25percent = (25 / 100 * totalValue);
      let _12_5_percent = (12.5 / 100 * totalValue);

      if (tiles[0].value >= _50percent){ 
        text.sentence1 = `Most deaths are due to <b>${categoryTranslator(tiles[0].categoryName)}</b>.`;
        lastProcessed = 1;
      }
      else {
        lastProcessed = generateDeathPhrase(text, 1, lastProcessed, _25percent);
      }
      generateDeathPhrase(text, 2, lastProcessed, _12_5_percent);
      return (text.sentence1 + text.sentence2);
    }

    function generateSectorsCommentary(){
      let comparisonText = comparisonRegionalMean(tiles[0].value, 
        findRegionalMean("sectors", tiles[0].categoryName, selectedCountry));

      let text = `<b>${categoryTranslator(tiles[0].categoryName)}
        </b> is the top contributor to the fine particle pollution levels 
        —<b>${tiles[0].value.toFixed(1)}</b> of the <b>${totalValue.toFixed(1)}</b> µg/m<sup>3</sup>.`;
      
      return text + comparisonText;
    }


    function generateFuelsCommentary(){

      let commentary: string;
      let _50percent = (50 / 100 * totalValue);

      if (tiles[0].value >= _50percent){
        commentary = `Most of that PM2.5 in comes from <b>${categoryTranslator(tiles[0].categoryName)}
          </b> —<b>${tiles[0].value.toFixed(1)}</b> of the <b>
          ${totalValue.toFixed(1)}</b> µg/m<sup>3</sup>.`;
        
        return commentary + comparisonRegionalMean(tiles[0].value, 
          findRegionalMean("fuels", tiles[0].categoryName, selectedCountry));
      }
      else {
        commentary = `An important sum of the total fine particle pollution value comes from <b>
          ${categoryTranslator(tiles[0].categoryName)}</b> —<b>${tiles[0].value.toFixed(1)}
          </b> of the <b>${totalValue.toFixed(1)}</b> µg/m<sup>3</sup>.`;
          
        return commentary + comparisonRegionalMean(tiles[0].value, 
          findRegionalMean("fuels", tiles[0].categoryName, selectedCountry));
      }
    }

    function findRegionalMean(type: string, category:string, countryID: string){
      let region = regionLookUp[countryID];
      if (type === "fuels"){
        return meanFuelRegions.find(r => r.region === region)
          .fuelValues.find(c => c.fuel === category).value;
      }
      else {
        return meanSectorRegions.find(r => r.region === region)
          .sectorValues.find(c => c.sector === category).value;
      }
    }


    function comparisonRegionalMean(countryValue: number, regionalMean: number){
      if ((countryValue > regionalMean - similarityRange) && 
        (countryValue < regionalMean + similarityRange)){

        return ` Similar to the regional mean (<b>${regionalMean}</b> µg/m<sup>3</sup>).`;
      }

      else if (countryValue < regionalMean){
        if (countryValue < regionalMean / 2){
          return ` Far lower than the regional mean (<b>${regionalMean}</b> µg/m<sup>3</sup>).`;
        }
        else {
          return ` Lower than the regional mean (<b>${regionalMean}</b> µg/m<sup>3</sup>).`;
        }
      }
      else {
        if (countryValue > regionalMean * 2){
          return ` A lot more than the regional mean (<b>${regionalMean}</b> µg/m<sup>3</sup>).`;
        }
        else {
          return ` Higher than the regional mean (<b>${regionalMean}</b> µg/m<sup>3</sup>).`;
        }
      }
    }

    function commentaryByDataset(dataset: string){
      if (dataset === "deaths"){
        return generateDeathsCommentary();
      }
      else if (dataset === "fuels"){
        return generateFuelsCommentary();
      }
      else {
        return generateSectorsCommentary();
      }
    }

    function sortDataByValue(tiles){
      tiles.sort(function(a, b) {
        return b.value - a.value;
      });
    }

    function redrawBarChart(){
      totalValue = calculateTotalSum();
      sum_width_categories = 0;
      showInformation = false;
      currentCategory = null;
      annotationPositions = [];
      commentary = commentaryByDataset(selectedDataset);
    }

    function reloadData(tiles: {categoryName: string, value: number}[]){
      sortDataByValue(tiles);
      redrawBarChart();
    }

    let totalValue = calculateTotalSum();
    let sum_width_categories = 0;
    let showInformation = false;
    let currentCategory = null;

    let annotationPositions = [];

    function generateTextPosition(tile: {categoryName: string, value: number}, x: number){
      let label = {
        name: tile.categoryName,
        x: x
      };
      return label;
    }

    function calculateCategoricalWidth(value: number){
      return value * width / totalValue;
    }

    function calculateX(tile: {categoryName: string, value: number}){
      let widthOfCurrentCategory = calculateCategoricalWidth(tile.value);
      sum_width_categories += widthOfCurrentCategory;
      let x = sum_width_categories - widthOfCurrentCategory;
      annotationPositions.push(generateTextPosition(tile,x));
      return (x);
    }

    function generateAnnotation(){
      let annotation = categoryTranslator(currentCategory.categoryName) + 
        `: ` + currentCategory.value.toLocaleString('en-US') + ` `;

      if (selectedDataset === "deaths"){
        annotation += `deaths`;
      }
      else{
        annotation += `µg/m<sup>3</sup>`;
      }

      return annotation;
    }

    $: commentary = commentaryByDataset(selectedDataset);
    $: reloadData(tiles);

</script>


<div class="col-text">
    <p>{@html commentary}</p>
</div>

{#if showInformation}
    <div class="annotation-text">
         <Annotation
            x={annotationPositions.find(a => a.name === currentCategory.categoryName).x}
            y={tileHeight + 5}
            text={generateAnnotation()}
            radius={0}
            justText={true}
            canvasWidth={width}
            canvasHeight={height}
        />
    </div>
{/if}

<div class="svg" {width} {height}>
    <svg id="barchart" {width} {height}>
        {#each tiles as tile}
            <g id="ID" class="region">
                <rect
                    id = {tile.categoryName}
                    class="tile"
                    width= {calculateCategoricalWidth(tile.value)}
                    height= {tileHeight}
                    x={calculateX(tile)}
                    y=0
                    rx="15"
                    ry="1"
                    filter="none"
                    style= "fill: {colorFunction(tile.categoryName)}; outline: none;"
                    on:mouseenter={()=>{showInformation = true; currentCategory = tile;}}
                    on:mouseout={()=>{showInformation = false;}}
                    on:blur={()=>{showInformation = false;}}
                />
            </g>
        {/each}
    </svg>
</div>

<style>

</style>