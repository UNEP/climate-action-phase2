<script lang="ts">

  import Typeahead from "svelte-typeahead";

  export var data : "GHG" | "Risk";

  var desc = "It has had one of the biggest increases in GHG \
    emissions -422% since 1990. Today, it accounts for 0.33% of global emissions.";

  var country = "Brazil";
  var emissions2015 = 164;
  var asPctOfGlobal = 2.18;
  var perCapita = 23.45;

  function click(){
    console.log("Header clicked");
  }

</script>

<div class="searchBar">
  <Typeahead 
    placeholder={ `Search a country`}
    hideLabel>
  </Typeahead>
</div>


<div class="grid">
  <div class="header" on:click={click}>
    <span>
      <strong>COUNTRY</strong>
    </span>
  </div>

  <div class="header">
    <span></span>
  </div>

  <div class="header">
    <span>
      <strong>TREND</strong>
    </span>
  </div>

  <div class="header">
    <span>
      <strong>2015 EMISSIONS</strong>
    </span>
  </div>

  <div class="header">
    <span>
      <strong>AS PCT OF GLOBAL</strong>
    </span>
  </div>

  <div class="header">
    <span>
      <strong>PER CAPITA</strong>
    </span>
  </div>


  <span>
    <b>{country}</b>
  </span>
  <span>
    {desc}
  </span>
  <span>
    {country}
  </span>
  <span>
    {emissions2015}
  </span>
  <span>
    {asPctOfGlobal}
  </span>
  <span>
    {perCapita}
  </span>
</div>

<style>

.header {
  border-bottom: 2px solid #e5e5e5;
  padding-bottom: 10px;
  cursor: pointer;
}

.searchBar :global([data-svelte-typeahead]) {
    margin: 0rem;
    width: 450px;
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
    font-size: 1.25rem;
    border: 0;
    border-radius: 0;
    border: 0px solid #e5e5e5;
    border-bottom-width: 2px;
    font-family: Roboto;
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
    grid-template-columns: 1fr 30% 2fr 1fr 1fr 1fr;
    border-top: 0px solid black;
    border-bottom: 0px solid #e5e5e5;
    border-right: 0px solid black;
  }

  .grid > span {
    margin-top: 20px;
    padding-bottom: 20px;
    border-left: 0px solid black;
    border-bottom: 1.5px solid #e5e5e5;
  }

</style>