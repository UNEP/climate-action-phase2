<script lang="ts" context="module">
  export interface CountryDataSquare {
      id: string,
      value: number
  }
</script>

<script lang="ts">
  import CRIdata from 'src/data/cri.json';
  import type { Unpacked } from 'src/util';
  import { createLookup } from 'src/util';
  import DistributionTiles from 'src/components/charts/DistributionTiles.svelte';


  const head = `Lorem <b>ipsum dolor sit amet</b>, consectetur adipiscing elit.
    Mauris mattis posuere faucibus.`;

  const ROW_LIMIT = 6;

  type RowData = Unpacked<typeof CRIdata>;

  let sortedData = CRIdata;

  let showAll = false;

  let widthDistributionChart = 120;
  let heightDistributionChart = 45;

  let climateRiskIndexData: CountryDataSquare[] = CRIdata
    .map(d => {
      return { id: d.id, value: d.cri_score};
    });

  type Header = { name: string, sortable: boolean, defaultSort?: 'asc' | 'desc' };

  const headers: Header[] = [
    { name: 'COUNTRY', sortable: true, defaultSort: 'asc' },
    { name: 'CHART', sortable: false},
    { name: 'INDEX', sortable: true },
    { name: 'RANK', sortable: true },
    { name: 'TOTAL', sortable: true },
    { name: 'POP.ADJ.', sortable: true },
    { name: 'TOTAL2', sortable: true },
    { name: 'AS GDP PCT.', sortable: true },
  ];

  let sort: {column: string, asc: boolean} = {column: 'COUNTRY', asc: true};

  const onClickHeader = (header: Header) => {
    if (header.name === sort.column) {
      sort.asc = !sort.asc;
    } else {
      sort = {
        column: header.name,
        asc: header.defaultSort === 'asc'
      };
    }
  };

  const getSortAsc = ({column}: typeof sort): RowData[] => {
    if (column === 'COUNTRY') {
      return [...CRIdata].sort((a,b) => a.country > b.country ? 1 : -1);
    }
    else if (column === 'INDEX') {
      return [...CRIdata].sort((a,b) => a.cri_score - b.cri_score);
    }
    else if (column === 'RANK') {
      return [...CRIdata].sort((a,b) => a.cri_rank - b.cri_rank);
    }
    else if (column === 'TOTAL') {
      return [...CRIdata].sort((a,b) => a.fatalities_in_2019 - b.fatalities_in_2019);
    }
    else if (column === 'POP.ADJ.') {
      return [...CRIdata].sort((a,b) => a.fatalities_per_100000_inhabitants - 
        b.fatalities_per_100000_inhabitants);
    }
    else if (column === 'TOTAL2') {
      return [...CRIdata].sort((a,b) => a.losses_in_millions_usd - b.losses_in_millions_usd);
    }
    else if (column === 'AS GDP PCT.') {
      return [...CRIdata].sort((a,b) => a.losses_per_unit_gdp_percentage -
       b.losses_per_unit_gdp_percentage);
    }
  };

  $: {
    sortedData = getSortAsc(sort);
    if (!sort.asc) sortedData.reverse();
  }

  let searchText: string = '';

  let searchResults: string[];
  function getSearchResults(text: string): string[] {
    const re = new RegExp(text, 'i');
    return sortedData
      .map(d => ({
        id: d.id,
        searchIndex: re.exec(d.country)?.index
      }))
      .filter(d => d.searchIndex !== undefined)
      .sort((a, b) => a.searchIndex - b.searchIndex)
      .map(d => d.id);
  }

  const rerender = () => sortedData = sortedData;

  $: {
    searchResults = getSearchResults(searchText);
    rerender();
  }

  const displayRow = (row: RowData, i: number) => {
    if (searchText === '') {
      return showAll ? true : i < ROW_LIMIT;
    }
    else {
      const searchRank = searchResults.indexOf(row.id);
      return searchRank !== -1 ? (showAll || searchRank < ROW_LIMIT) : false;
    }
  };

  const onClickShowButton = () => {
    showAll = !showAll;
    rerender();
  };

</script>


<h2 class='narrow'>{@html head}</h2>

<div class="search-bar">
  <input bind:value={searchText} placeholder='Search a country' />
</div>


<div id="grid">
  <div id="item1">CLIMATE<br>RISK</div>
  <div id="item2">CLIMATE-RELATED<br>DEATHS</div>
  <div id="item3">CLIMATE-RELATED<br>ECONOMIC LOSSES</div>
</div>

<div style="padding-bottom:5px"></div>

<div class="grid-ghg">

  {#each headers as h}
    <div class="header" class:selected="{sort && sort.column === h.name}"
        on:click={() => h.sortable && onClickHeader(h)}
        data-name={h.name}>
      <span >
        {h.name}
        {#if sort && sort.column === h.name}
          <i class="arrow-down" class:arrow-up={sort.asc}></i>
        {/if}
      </span>
    </div>
  {/each}

  {#each sortedData as row, i}
    <div class="row" style={!displayRow(row, i) && 'display: none'}>
      <span class="country-name">
        {row.country}
      </span>

      <span class="country-distribution">
              <DistributionTiles
              data={climateRiskIndexData}
              selectedCountry={row.id}
              selectedDataset="ClimateRiskIndex"
              width2={widthDistributionChart}
              height2={heightDistributionChart}
            />
      </span>

      <span class="country-index">
        {row.cri_score}
      </span>

      <span class="row-number">
        {row.cri_rank}
      </span>
      <span class="row-number">
        {row.fatalities_in_2019}
      </span>
      <span class="row-number">
        {row.fatalities_per_100000_inhabitants}
      </span>
      <span class="row-number">
        {row.losses_in_millions_usd}
      </span>
      <span class="row-number">
        {row.losses_per_unit_gdp_percentage}
      </span>
    </div>
  {/each}
</div>

{#if searchText === ''}
  <button
    class="show-more-button"
    on:click={onClickShowButton}>
    <b>{showAll ? 'Show only main' : 'Show all countries'}</b>
  </button>
{/if}

<div style="padding-bottom:60px"></div>

<style>


&[data-name="COUNTRY"]{
  text-align: left;
}

#grid {
  display: grid;
  height: 45px;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 10px;
}

#item1 {
  grid-column: 3/3;
  text-align: right;
}

#item2 {
  grid-column: 4/5;
  text-align: right;
}

#item3 {
  grid-column: 5/5;
  text-align: right;
}

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

.row {
  display: contents;
}

.country-name {
  font-size: 24px;
  font-weight: bold;
}

.country-distribution{
  width: 70%;
  display:table-cell;
}

.country-index {
  display: table-cell;
  text-align: right;
  font-weight: 100;
}

.row-number {
  font-weight: 100;
  font-size: 24px;
  text-align: right;
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
  text-align: right;
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
  grid-template-columns: 25% 15% 10% 10% 10% 10% 10% 10%;
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

</style>