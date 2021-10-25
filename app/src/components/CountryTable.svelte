<script lang="ts" context="module">
  export interface CountryDataSquare {
      id: string,
      value: number
  }
</script>

<script lang="ts">
  import Typeahead from "svelte-typeahead";
  import countries from 'src/data/countryDictionary.json';
  import countryTableData from 'src/data/countryTableData.json';
  import countryTableData2 from 'src/data/countryTableData2.json';
  import trendsData from 'src/data/trends.carto.json';
  import { createLookup } from 'src/util';
  import MiniLineChart from "src/components/charts/MiniLineChart.svelte";
  import DistributionTiles from "src/components/charts/DistributionTiles.svelte";

  export var data : "GHG" | "Risk";

  const countryTableLookUp = createLookup(countryTableData, d => d.id, d => d);
  const countryTable2LookUp = createLookup(countryTableData2, d => d.id, d => d);


  const numMainCountriesTable = 6;
  const maxNumSearchResults = 6;
  const extract = (item) => item.name;
  const head = `Lorem <b>ipsum dolor sit amet</b>, consectetur adipiscing elit.
    Mauris mattis posuere faucibus.`;
  const emissions2015Comment = 'million tonnes of GHG';
  const globalPCTComment = `<t style="font-size:16px;">%</t>`;
  const perCapitaComment = `tonnes<br> of GHG`;

  var selectedDatabase = data === "GHG" ? countryTableData : countryTableData2;

  var buttonMode: "First" | "Search" | "All";
  buttonMode = "All";
  var buttonTextOptions = {"All": "Show all countries", "First": "Show only main"};
  var buttonText = buttonTextOptions[buttonMode];

  var tableMode : "First" | "Search" | "All";
  tableMode = "First";

  var sortingMethod: 'Ascending' | 'Descending';
  sortingMethod = 'Descending';

  var currentSortingHeader = 'country';

  let results = selectedDatabase;
  showFirstTables(currentSortingHeader);


  //------LINE CHART VALUES----------//

  let widthLineChart = 225;
  let heightLineChart = 100;


  //-------DISTRIBUTION TILES---------//

  let climateRiskIndexData: CountryDataSquare[] = countryTableData2
    .map(d => {
      return { id: d.id, value: d.climateRiskIndex };
    });

  let widthDistribution = 10;




  //TREND DATA GENERATION 
  var countryEmissions = [];
  if (data === 'GHG'){
    var countryDataArray = trendsData.data;

    for (let i = 0; i < countryDataArray.length; i++){
      let emissionsArray = Object.entries(countryDataArray[i].emissions);
      let entries = [];
      let baseValue = 0;
      let lastValue = 0;
      emissionsArray.forEach(([key, value]) => {
        let yearEntry = {year: parseInt(key), value: value};
        if (yearEntry.year === 1990){
          baseValue = value;
        }
        else if (yearEntry.year === 2015){
          lastValue = value;
        }
        entries.push(yearEntry);
      });
      let cat = getCategory(baseValue, lastValue);
      const newCountry = {id:countryDataArray[i].id, emissions: entries, category: cat};
      countryEmissions.push(newCountry);
    }
  }

  const countryTrendLookUp = createLookup(countryEmissions, c => c.id, c => c);


  function getCategory(baseValue, lastValue) {
    let diff = (lastValue - baseValue) / baseValue;
    if (Math.abs(diff) < 0.25)
      return 'stable';
    else if (diff < -0.25) 
      return 'falling';
    else 
      return 'climbing-fast';
  }


  function howManyButtonClicked(){
    if (buttonMode === "All"){
      buttonMode = "First";
      tableMode = "All";
      buttonText = buttonTextOptions[buttonMode];
      results = selectedDatabase;
      sortByHeader(currentSortingHeader);
    }
    else {
      buttonMode = "All";
      tableMode = "First";
      buttonText = buttonTextOptions[buttonMode];
      showFirstTables(currentSortingHeader);
    }
  }


  //TOO MUCH REPETITIVE CODE
  function sortByHeader(sortingColumn){
    var arrayResults = results;
    if (sortingColumn === "country"){
      if (sortingMethod === 'Ascending'){
        arrayResults.sort((a, b) => a.name.localeCompare(b.name));
      }
      else {
        arrayResults.sort((a, b) => b.name.localeCompare(a.name));
      }

    }
    else if (sortingColumn === "emissions2015"){
      if (sortingMethod === 'Ascending'){
        arrayResults.sort((a, b) => a.emissions2015 - b.emissions2015);
      }
      else{
        arrayResults.sort((a, b) => b.emissions2015 - a.emissions2015);
      }
    }

    else if (sortingColumn === "globalpct"){
      if (sortingMethod === 'Ascending'){
        arrayResults.sort((a, b) => a.globalPCT - b.globalPCT);
      }
      else{
        arrayResults.sort((a, b) => b.globalPCT - a.globalPCT);
      }
    }

    else if (sortingColumn === "percapita"){
      if (sortingMethod === 'Ascending'){
        arrayResults.sort((a, b) => a.perCapita - b.perCapita);
      }
      else{
        arrayResults.sort((a, b) => b.perCapita - a.perCapita);
      }
    }
    results = arrayResults;
  }


  function showFirstTables(sortingColumn){
    sortByHeader(sortingColumn);
    results = results.slice(0,numMainCountriesTable);
  }


  function reorder(selectedHeader){
    if (currentSortingHeader !== selectedHeader){
      currentSortingHeader = selectedHeader;
      sortingMethod = 'Descending';
    }
    else {
      if (sortingMethod === 'Descending'){
        sortingMethod = 'Ascending';
      }
      else {
        sortingMethod = 'Descending';
      }
    }

    if (tableMode === "First"){
      results = selectedDatabase;
      showFirstTables(currentSortingHeader);
    }
    else {
      sortByHeader(currentSortingHeader);
    }
  }


  function clearSearchBar(){
    buttonMode = "All";
    buttonText = buttonTextOptions[buttonMode];
    tableMode = "First";
    results = selectedDatabase;
    showFirstTables(currentSortingHeader);
  }


  function getResultFromSearch(result, index){
    if (data === 'GHG'){
      if (index === 0){
        tableMode = "Search";
        buttonMode = "Search";
        results = [];
        var firstResult = countryTableLookUp[result.id];
        if (firstResult !== undefined){ //Because we dont have final database
          results.push(firstResult);
        }
      }
      else {
        var countryResult = countryTableLookUp[result.id];
        if (countryResult !== undefined){ //Because we dont have final database
          results.push(countryResult);
        }
      }
    }

    sortByHeader(currentSortingHeader);
  }

  let rerender: () => void;

</script>


<h2 class='narrow'>{@html head}</h2>

<div class="search-bar">
  <Typeahead 
    let:result
    let:index
    data={countries} 
    {extract}
    limit={maxNumSearchResults}
    placeholder={ `Search a country`}
    hideLabel
    on:clear={() => clearSearchBar()}
    >
    {getResultFromSearch(result.original, index)}
  </Typeahead>
</div>

{#if data === "GHG"}

  <div class="grid-ghg">
    <div class="header" class:selected="{currentSortingHeader === 'country'}"
        on:click={() => reorder('country')}
        on:click={() => rerender()}>
      <span>
        <br>COUNTRY
        {#if currentSortingHeader === 'country'}
          <i class="arrow-down" class:arrow-up="{sortingMethod === 'Ascending'}"></i>
        {/if}
      </span>
    </div>

    <div class="header" class:selected="{currentSortingHeader === 'trend'}"
      on:click={() => currentSortingHeader = 'trend'}>
      <span>
        <br>TREND
        {#if currentSortingHeader === 'trend'}
          <i class="arrow-down" class:arrow-up="{sortingMethod === 'Ascending'}"></i>
        {/if}
      </span>
    </div>

    <div class="header" class:selected="{currentSortingHeader === 'emissions2015'}"
      on:click={() => reorder('emissions2015')}
      style="text-align:right;">
      <span>
        {#if currentSortingHeader === 'emissions2015'}
          <i class="arrow-down" class:arrow-up="{sortingMethod === 'Ascending'}"></i>
        {/if}
        2015 EMISSIONS
      </span>
    </div>

    
    <div class="header" class:selected="{currentSortingHeader === 'globalpct'}"
      on:click={() => reorder('globalpct')}
      style="text-align:right;">
      <span>
        {#if currentSortingHeader === 'globalpct'}
          <i class="arrow-down" class:arrow-up="{sortingMethod === 'Ascending'}"></i>
        {/if}
        AS PCT OF GLOBAL
      </span>
    </div>

    <div class="header" class:selected="{currentSortingHeader === 'percapita'}"
      on:click={() => reorder('percapita')}
      style="text-align:right;">
      <span>
        {#if currentSortingHeader === 'percapita'}
          <i class="arrow-down" class:arrow-up="{sortingMethod === 'Ascending'}"></i>
        {/if}
        PER<br>CAPITA
      </span>
    </div>

    {#each results as row}
      <span class="country-span">
        <div class="country-column">

          <div class="country-name">
            {row.name}
          </div>

          <div class="country-description">
            {row.desc}
          </div>

        </div>
      </span>

      <span bind:clientWidth={widthLineChart}>
          <MiniLineChart 
            data={countryTrendLookUp[row.id].emissions} 
            category={countryTrendLookUp[row.id].category}
            />
      </span>

      <span class="row-number">
        {row.emissions2015}
        <p class="number-descriptor">{emissions2015Comment}</p>
      </span>
      <span class="row-number">
        {row.globalPCT}{@html globalPCTComment}
      </span>
      <span class="row-number">
        {row.perCapita}
        <p class="number-descriptor">{@html perCapitaComment}</p>
      </span>
    {/each}
  </div>

{:else}

  <div class="grid-climate-risk">
    <div class="header" class:selected="{currentSortingHeader === 'country'}"
        on:click={() => reorder('country')}
        on:click={() => rerender()}>
      <span>
        <br>COUNTRY
        {#if currentSortingHeader === 'country'}
          <i class="arrow-down" class:arrow-up="{sortingMethod === 'Ascending'}"></i>
        {/if}
      </span>
    </div>

    <div class="header" class:selected="{currentSortingHeader === 'climateRisk'}"
      on:click={() => currentSortingHeader = 'climateRisk'}>
      <span>
        <br>CLIMATE RISK INDEX RANK
        {#if currentSortingHeader === 'climateRisk'}
          <i class="arrow-down" class:arrow-up="{sortingMethod === 'Ascending'}"></i>
        {/if}
      </span>
    </div>

    <div class="header" class:selected="{currentSortingHeader === 'climateDeathsTotal'}"
      on:click={() => reorder('climateDeathsTotal')}
      style="text-align:right;">
      <span>
        {#if currentSortingHeader === 'climateDeathsTotal'}
          <i class="arrow-down" class:arrow-up="{sortingMethod === 'Ascending'}"></i>
        {/if}
        TOTAL
      </span>
    </div>

    <div class="header" class:selected="{currentSortingHeader === 'climateDeathsPopAdj'}"
      on:click={() => reorder('climateDeathsPopAdj')}
      style="text-align:right;">
      <span>
        {#if currentSortingHeader === 'climateDeathsPopAdj'}
          <i class="arrow-down" class:arrow-up="{sortingMethod === 'Ascending'}"></i>
        {/if}
        POP. ADJ.
      </span>
    </div>

    
    <div class="header" class:selected="{currentSortingHeader === 'economicLossesTotal'}"
      on:click={() => reorder('economicLossesTotal')}
      style="text-align:right;">
      <span>
        {#if currentSortingHeader === 'economicLossesTotal'}
          <i class="arrow-down" class:arrow-up="{sortingMethod === 'Ascending'}"></i>
        {/if}
        TOTAL
      </span>
    </div>

    <div class="header" class:selected="{currentSortingHeader === 'EconomicLossesGDP'}"
      on:click={() => reorder('EconomicLossesGDP')}
      style="text-align:right;">
      <span>
        {#if currentSortingHeader === 'EconomicLossesGDP'}
          <i class="arrow-down" class:arrow-up="{sortingMethod === 'Ascending'}"></i>
        {/if}
        AS GDP PCT.
      </span>
    </div>


    {#each results as row}
      <span>
        <div class="country-name">
          {row.name}
        </div>
      </span>

      <span class="country-span">
        <div class="country-column">

          <div class="distribution-chart">
            <span bind:clientWidth={widthLineChart}>
              <DistributionTiles
                data = {climateRiskIndexData}
                selectedCountry = {row.id}
                selectedDataset = "ClimateRiskIndex"
                width2 = {widthLineChart}
                height2 = {heightLineChart}
              />
            </span>
          </div>

          <div class="climate-risk-number">
            {row.climateRiskIndex}
          </div>

        </div>
      </span>



      <span class="row-number">
        {row.emissions2015}
        <p class="number-descriptor">{emissions2015Comment}</p>
      </span>
      <span class="row-number">
        {row.globalPCT}{@html globalPCTComment}
      </span>
      <span class="row-number">
        {row.perCapita}
        <p class="number-descriptor">{@html perCapitaComment}</p>
      </span>
    {/each}
  </div>  

  {/if}

  {#if buttonMode !== "Search"}
    <button 
      class="show-more-button"
      on:click="{howManyButtonClicked}">
      <b>{buttonText}</b>
    </button>
  {/if}

  <div style="padding-bottom:60px"></div>

<style>


.arrow-down {
  border: solid black;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 5px;
  margin-bottom: 3px;
  margin-left: 6px;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}

.arrow-up {
  border: solid black;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 5px;
  margin-bottom: -3px;
  margin-left: 6px;
  transform: rotate(-135deg);
  -webkit-transform: rotate(-135deg);
}

.country-span {
  width: 100%;
  display: table;
}

.country-column{
  display: table-row;
}

.country-name {
  width: 35%; 
  display: table-cell; 
  font-size: 24px;
  font-weight: bold;
}

.distribution-chart {
  width: 55%; 
  display: table-cell;
}

.climate-risk-number{
  width: 22.5%; 
  display: table-cell;
}

.country-description {
  display: table-cell;
  font-weight: 100; 
  font-size: 16px;
}

.row-number {
  font-weight: 100;
  font-size: 24px;
  text-align: right;
}

.number-descriptor {
  color: #818181;
  font-weight: 500;
  text-align: right;
  font-size: 16px;
  margin: 0%;
  padding: 0;
  padding-left: 18px;
}

.show-more-button {
  background-color: #111111;
  font-size: 16px;
  color: white;
  border: none;
  padding: 10px 20px 10px 20px;
  margin-top: 30px;
  cursor: pointer;
}

.selected {
  border-color: black !important;
  font-weight: 700;
}

.header {
  border-bottom: 2px solid #cccccc;
  padding-bottom: 10px;
  cursor: pointer;
}

.search-bar :global([data-svelte-typeahead] mark){
  background-color: aqua;
}

.search-bar :global([data-svelte-typeahead]) {
    margin: 0rem;
    width: 50%;
    margin-top: 30px;
    background-color: #f9f9f9;
  }

  .search-bar :global([data-svelte-typeahead] ul) {
    visibility: hidden;
  }

  .search-bar :global([data-svelte-search] input:focus) {
    outline-width: 0px;
    background-color: #f9f9f9;
  }

  .search-bar :global([data-svelte-search] input) {
    width: 100%;
    padding: 0.5rem 0rem;
    background: #f9f9f9;
    font-size: 2rem;
    border: 0;
    border-radius: 0;
    border: 0px solid #cccccc;
    border-bottom-width: 2px;
    font-family: Roboto;
    font-weight: lighter;
  }

  .search-bar :global([data-svelte-search] label) {
    margin-bottom: 0.25rem;
    display: inline-flex;
    font-size: 0.875rem;
  }

  .search-bar {
    padding-bottom: 50px;
  }

  .grid-ghg {
    display: grid;
    grid-template-columns: 50% 20% 10% 10% 10%;
    border-top: 0px solid black;
    border-bottom: 0px solid #e5e5e5;
    border-right: 0px solid black;
  }

  .grid-ghg > span {
    margin-top: 15px;
    padding-bottom: 15px;
    border-left: 0px solid black;
    border-bottom: 1px solid #cccccc;
  }

  .grid-climate-risk {
    display: grid;
    grid-template-columns: 20% 30% 12.5% 12.5% 12.5% 12.5%;
    border-top: 0px solid black;
    border-bottom: 0px solid #e5e5e5;
    border-right: 0px solid black;
  }

  .grid-climate-risk > span {
    margin-top: 15px;
    padding-bottom: 15px;
    border-left: 0px solid black;
    border-bottom: 1px solid #cccccc;
  }

</style>