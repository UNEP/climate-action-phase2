<script lang="ts">

  import Typeahead from "svelte-typeahead";
  import countries from 'src/data/countryDictionary.json';

  export var data : "GHG" | "Risk";

  const head = `Lorem <b>ipsum dolor sit amet</b>, consectetur adipiscing elit.
    Mauris mattis posuere faucibus.`;

  var row = [];
  $: row.push(r);
  $: row.push(r2);
  $: row.push(r3);
  $: row.push(r4);
  $: row.push(r5);
  $: row.push(r6);


  var r = {
    desc: "It has had one of the biggest increases in GHG \
    emissions -422% since 1990. Today, it accounts for 0.33% of global emissions.",
    country: "Brazil",
    emissions2015: 164,
    asPctOfGlobal: 2.18,
    perCapita: 23.45
  };

  var r2 = {
    desc: "It has had one of the biggest increases in GHG \
    emissions -422% since 1990. Today, it accounts for 0.33% of global emissions.",
    country: "Spain",
    emissions2015: 164,
    asPctOfGlobal: 2.18,
    perCapita: 23.45
  };

  var r3 = {
    desc: "It has had one of the biggest increases in GHG \
    emissions -422% since 1990. Today, it accounts for 0.33% of global emissions.",
    country: "United Kingdom",
    emissions2015: 164,
    asPctOfGlobal: 2.18,
    perCapita: 23.45
  };

  var r4 = {
    desc: "It has had one of the biggest increases in GHG \
    emissions -422% since 1990. Today, it accounts for 0.33% of global emissions.",
    country: "France",
    emissions2015: 164,
    asPctOfGlobal: 2.18,
    perCapita: 23.45
  };

  var r5 = {
    desc: "It has had one of the biggest increases in GHG \
    emissions -422% since 1990. Today, it accounts for 0.33% of global emissions.",
    country: "Germany",
    emissions2015: 164,
    asPctOfGlobal: 2.18,
    perCapita: 23.45
  };

  var r6 = {
    desc: "It has had one of the biggest increases in GHG \
    emissions -422% since 1990. Today, it accounts for 0.33% of global emissions.",
    country: "Italy",
    emissions2015: 164,
    asPctOfGlobal: 2.18,
    perCapita: 23.45
  };


  var current = 'country';

  function showMoreButtonClicked(){
    console.log("SHOW MORE BUTTON CLICKED!");
  }


  const maxNumSearchResults = 5;

  const extract = (item) => item.name;

</script>

<h2 class='narrow'>{@html head}</h2>

<div class="searchBar">
  <Typeahead 
    data={countries} 
    {extract}
    limit={maxNumSearchResults}
    placeholder={ `Search a country`}
    hideLabel>
  </Typeahead>
</div>


<div class="grid">
  <div class="header" class:selected="{current === 'country'}"
      on:click={() => current = 'country'}>
    <span>
      <strong>COUNTRY</strong>
    </span>
  </div>

  <div class="header" class:selected="{current === 'description'}"
    on:click={() => current = 'description'}>
    <span></span>
  </div>

  <div class="header" class:selected="{current === 'trend'}"
    on:click={() => current = 'trend'}>
    <span>
      <strong>TREND</strong>
    </span>
  </div>

  <div class="header" class:selected="{current === 'emissions2015'}"
    on:click={() => current = 'emissions2015'}
    style="text-align:right;">
    <span>
      <strong>2015 EMISSIONS</strong>
    </span>
  </div>

  
  <div class="header" class:selected="{current === 'globalpct'}"
    on:click={() => current = 'globalpct'}
    style="text-align:right;">
    <span>
      <strong>AS PCT OF GLOBAL</strong>
    </span>
  </div>

  <div class="header" class:selected="{current === 'percapita'}"
    on:click={() => current = 'percapita'}
    style="text-align:right;">
    <span>
      <strong>PER CAPITA</strong>
    </span>
  </div>

  {#each row as loco, i (loco)}
    <span>
      <b>{loco.country}</b>
    </span>
    <span>
      {loco.desc}
    </span>
    <span>
      {loco.country}
    </span>
    <span style="text-align:right;">
      {loco.emissions2015}
    </span>
    <span style="text-align:right;">
      {loco.asPctOfGlobal}
    </span>
    <span style="text-align:right;">
      {loco.perCapita}
    </span>
  {/each}
</div>

  <button 
    class="showMoreButton"
    on:click="{showMoreButtonClicked}">
    <b>Show all countries</b>
  </button>


<style>

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
    margin-top: 20px;
    padding-bottom: 20px;
    border-left: 0px solid black;
    border-bottom: 1px solid #cccccc;
  }

</style>