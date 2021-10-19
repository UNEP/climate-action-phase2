<script lang="ts">

  import Typeahead from "svelte-typeahead";
  import countries from 'src/data/countryDictionary.json';
  import countryTableData from 'src/data/countryTableData.json';
  import { createLookup } from 'src/util';

  export var data : "GHG" | "Risk";


  const countryTableLookUp = createLookup(countryTableData, d => d.id, d => d);

  var selectedDatabase = data === "GHG" ? countryTableData : null;

  const head = `Lorem <b>ipsum dolor sit amet</b>, consectetur adipiscing elit.
    Mauris mattis posuere faucibus.`;

  var currentSortingHeader = 'country';

  function showMoreButtonClicked(){
    console.log("SHOW MORE BUTTON CLICKED!");
  }


  const maxNumSearchResults = 6;
  const extract = (item) => item.name;
  var events = [];

  function updateSelectedCountry(event, detail){
    events = [...events, { event, detail }];
    if (event === "select"){
      let newID = detail.original.id;
      console.log(newID);
    }
  }


  const emissions2015Comment = 'million tonnes of GHG';
  const globalPCTComment = `<t style="font-size:16px;">%</t>`;
  const perCapitaComment = `tonnes<br> of GHG`;

  let results = [];

  function change(e, result, index){
    if (index === 0){
      results = [];
      var loco = countryTableLookUp[result.id];
      console.log(countryTableLookUp[result.id]);
      if (loco !== undefined){
        results.push(countryTableLookUp[result.id]);
      }
    }

    else {
      var loco2 = countryTableLookUp[result.id];
      console.log(countryTableLookUp[result.id]);
      if (loco2 !== undefined){
        results.push(countryTableLookUp[result.id]);
      }
    }

    console.log(result, index);
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
    on:select={(e) => updateSelectedCountry("select", e.detail)}
    on:clear={(e) => updateSelectedCountry("clear", e.detail)}
    on:keydown
    >
    {change("noth", result.original, index)}
  </Typeahead>
</div>


<div class="grid">
  <div class="header" class:selected="{currentSortingHeader === 'country'}"
      on:click={() => currentSortingHeader = 'country'}>
    <span>
      <br>COUNTRY
    </span>
  </div>

  <div class="header" class:selected="{currentSortingHeader === 'description'}"
    on:click={() => currentSortingHeader = 'description'}>
    <span></span>
  </div>

  <div class="header" class:selected="{currentSortingHeader === 'trend'}"
    on:click={() => currentSortingHeader = 'trend'}>
    <span>
      <br>TREND
    </span>
  </div>

  <div class="header" class:selected="{currentSortingHeader === 'emissions2015'}"
    on:click={() => currentSortingHeader = 'emissions2015'}
    style="text-align:right;">
    <span>
      2015 EMISSIONS
    </span>
  </div>

  
  <div class="header" class:selected="{currentSortingHeader === 'globalpct'}"
    on:click={() => currentSortingHeader = 'globalpct'}
    style="text-align:right;">
    <span>
      AS PCT OF GLOBAL
    </span>
  </div>

  <div class="header" class:selected="{currentSortingHeader === 'percapita'}"
    on:click={() => currentSortingHeader = 'percapita'}
    style="text-align:right;">
    <span>
      PER<br>CAPITA
    </span>
  </div>

  {#each results as row}
    <span style="font-size: 24px;">
      <b>{row.name}</b>
    </span>
    <span class="description">
      {row.desc}
    </span>
    <span>
      {row.name}
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

  <button 
    class="showMoreButton"
    on:click="{showMoreButtonClicked}">
    <b>Show all countries</b>
  </button>

<style>


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
    grid-template-columns: 20% 30% 20% 10% 10% 10%;
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