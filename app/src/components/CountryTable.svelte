<script lang="ts">

  import Typeahead from "svelte-typeahead";
  import countries from 'src/data/countryDictionary.json';
  import TimeseriesDataPoint from 'src/data';
  import countryTableData from 'src/data/countryTableData.json';
  import trendsData from 'src/data/trends.carto.json';
  import { createLookup } from 'src/util';
  import MiniLineChart from "src/components/charts/MiniLineChart.svelte";


  export var data : "GHG" | "Risk";

  const countryTableLookUp = createLookup(countryTableData, d => d.id, d => d);
  const numMainCountriesTable = 6;
  const maxNumSearchResults = 6;
  const extract = (item) => item.name;
  const head = `Lorem <b>ipsum dolor sit amet</b>, consectetur adipiscing elit.
    Mauris mattis posuere faucibus.`;
  const emissions2015Comment = 'million tonnes of GHG';
  const globalPCTComment = `<t style="font-size:16px;">%</t>`;
  const perCapitaComment = `tonnes<br> of GHG`;

  var selectedDatabase = data === "GHG" ? countryTableData : null;

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

  var trendData = trendsData.data.find(e => e.id === "ESP").emissions;
  var trendData2 = [];

  var objectArray = Object.entries(trendData);
  objectArray.forEach(([key, value]) => {
    var newEntry = {"year": key, value: value};
    trendData2.push(newEntry);
  });

  var category = "climbing-fast";


  var trendData3 = [
    {
      "year": 1970,
      "value": 0
    },
    {
      "year": 1971,
      "value": 0.01
    },
    {
      "year": 1972,
      "value": 0.01
    },
    {
      "year": 1973,
      "value": 0.01
    },
    {
      "year": 1974,
      "value": 0.01
    },
    {
      "year": 1975,
      "value": 0.01
    },
    {
      "year": 1976,
      "value": 0.01
    },
    {
      "year": 1977,
      "value": 0.01
    },
    {
      "year": 1978,
      "value": 0.01
    },
    {
      "year": 1979,
      "value": 0.01
    },
    {
      "year": 1980,
      "value": 0.01
    },
    {
      "year": 1981,
      "value": 0.01
    },
    {
      "year": 1982,
      "value": 0.01
    },
    {
      "year": 1983,
      "value": 0.01
    },
    {
      "year": 1984,
      "value": 0.01
    },
    {
      "year": 1985,
      "value": 0.01
    },
    {
      "year": 1986,
      "value": 0.01
    },
    {
      "year": 1987,
      "value": 0.01
    },
    {
      "year": 1988,
      "value": 0.01
    },
    {
      "year": 1989,
      "value": 0.01
    },
    {
      "year": 1990,
      "value": 0.01
    },
    {
      "year": 1991,
      "value": 0.01
    },
    {
      "year": 1992,
      "value": 0.01
    },
    {
      "year": 1993,
      "value": 0.01
    },
    {
      "year": 1994,
      "value": 0.01
    },
    {
      "year": 1995,
      "value": 0.01
    },
    {
      "year": 1996,
      "value": 0.01
    },
    {
      "year": 1997,
      "value": 0.01
    },
    {
      "year": 1998,
      "value": 0.01
    },
    {
      "year": 1999,
      "value": 0.01
    },
    {
      "year": 2000,
      "value": 0.02
    },
    {
      "year": 2001,
      "value": 0.02
    },
    {
      "year": 2002,
      "value": 0.02
    },
    {
      "year": 2003,
      "value": 0.02
    },
    {
      "year": 2004,
      "value": 0.02
    },
    {
      "year": 2005,
      "value": 0.01
    },
    {
      "year": 2006,
      "value": 0.01
    },
    {
      "year": 2007,
      "value": 0.04
    },
    {
      "year": 2008,
      "value": 0.07
    },
    {
      "year": 2009,
      "value": 0.08
    },
    {
      "year": 2010,
      "value": 0.12
    },
    {
      "year": 2011,
      "value": 0.12
    },
    {
      "year": 2012,
      "value": 0.2
    },
    {
      "year": 2013,
      "value": 0.2
    },
    {
      "year": 2014,
      "value": 0.18
    },
    {
      "year": 2015,
      "value": 0.18
    }
];






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
    sortByHeader(currentSortingHeader);
  }


</script>


<h2 class='narrow'>{@html head}</h2>

<div class="searchBar">
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


<div class="grid">
  <div class="header" class:selected="{currentSortingHeader === 'country'}"
      on:click={() => reorder('country')}>
    <span>
      <br>COUNTRY
    </span>
  </div>

  <div class="header" class:selected="{currentSortingHeader === 'trend'}"
    on:click={() => currentSortingHeader = 'trend'}>
    <span>
      <br>TREND
    </span>
  </div>

  <div class="header" class:selected="{currentSortingHeader === 'emissions2015'}"
    on:click={() => reorder('emissions2015')}
    style="text-align:right;">
    <span>
      2015 EMISSIONS
    </span>
  </div>

  
  <div class="header" class:selected="{currentSortingHeader === 'globalpct'}"
    on:click={() => reorder('globalpct')}
    style="text-align:right;">
    <span>
      AS PCT OF GLOBAL
    </span>
  </div>

  <div class="header" class:selected="{currentSortingHeader === 'percapita'}"
    on:click={() => reorder('percapita')}
    style="text-align:right;">
    <span>
      PER<br>CAPITA
    </span>
  </div>

  {#each results as row}
    <span style="font-size: 24px;">
      <div id="a">
        <b>{row.name}</b>
      </div>

      <div id="b">
       {row.desc}
      </div>

    </span>
    <span>
      <MiniLineChart data={trendData2} {category}/>
    </span>
    <span class="rowNumber">
      {row.emissions2015}
      <p class="numberDescriptor">{emissions2015Comment}</p>
    </span>
    <span class="rowNumber">
      {row.globalPCT}{@html globalPCTComment}
    </span>
    <span class="rowNumber">
      {row.perCapita}
      <p class="numberDescriptor">{@html perCapitaComment}</p>
    </span>
  {/each}
</div>

  {#if buttonMode !== "Search"}
    <button 
      class="showMoreButton"
      on:click="{howManyButtonClicked}">
      <b>{buttonText}</b>
    </button>
  {/if}

<style>

#a {
  width: 35%;
}

#b{
  width: 65%;
}

.description {
  font-weight: 100;
}

.rowNumber {
  font-weight: 100;
  font-size: 24px;
  text-align: right;
}

.numberDescriptor {
  color: #818181;
  font-weight: 500;
  text-align: right;
  font-size: 16px;
  margin: 0%;
  padding: 0;
  padding-left: 18px;
}

.showMoreButton {
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

.searchBar :global([data-svelte-typeahead] mark){
  background-color: aqua;
}

.searchBar :global([data-svelte-typeahead]) {
    margin: 0rem;
    width: 50%;
    margin-top: 30px;
    z-index: 1000;
    background-color: #f9f9f9;
  }

  .searchBar :global([data-svelte-typeahead] ul) {
    visibility: hidden;
  }

  .searchBar :global([data-svelte-search] input:focus) {
    outline-width: 0px;
    background-color: #f9f9f9;
  }

  .searchBar :global([data-svelte-search] input) {
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

  .searchBar :global([data-svelte-search] label) {
    margin-bottom: 0.25rem;
    display: inline-flex;
    font-size: 0.875rem;
  }

  .searchBar {
    padding-bottom: 50px;
  }

  .grid {
    display: grid;
    grid-template-columns: 50% 20% 10% 10% 10%;
    border-top: 0px solid black;
    border-bottom: 0px solid #e5e5e5;
    border-right: 0px solid black;
  }

  .grid > span {
    margin-top: 15px;
    padding-bottom: 15px;
    border-left: 0px solid black;
    border-bottom: 1px solid #cccccc;
  }

</style>