<script lang="ts" context="module">
  export interface CountryDataSquare {
      id: string,
      value: number
  }
</script>

<script lang="ts">
  import co2trends from 'src/data/co2trends.json';
  import co2data from 'src/data/co2data.json';
  import type { Unpacked } from 'src/util';
  import { createLookup } from 'src/util';
  import MiniLineChart from "src/components/charts/MiniLineChart.svelte";

  const description = "It has had one of the biggest increases in GHG emissions\
   -422% since 1990. Today, it accounts for 0.33% of global emissions.";

  const head = `Lorem <b>ipsum dolor sit amet</b>, consectetur adipiscing elit.
    Mauris mattis posuere faucibus.`;
  const emissions2015Comment = 'million tonnes of GHG';
  const globalPCTComment = `<t style="font-size:16px;">%</t>`;
  const perCapitaComment = `tonnes<br> of GHG`;

  const ROW_LIMIT = 6;

  type RowData = Unpacked<typeof co2data>;

  let sortedData = co2data;

  let showAll = false;

  let widthLineChart = 225;
  // let heightLineChart = 100;
  // let widthDistribution = 10;

  let countryEmissions = [];
  let countryDataArray = co2trends;

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
      else if (yearEntry.year === 2019){
        lastValue = value;
      }
      entries.push(yearEntry);
    });
    let cat = getCategory(baseValue, lastValue);
    const newCountry = {id:countryDataArray[i].code, emissions: entries, category: cat};
    countryEmissions.push(newCountry);
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

  type Header = { name: string, sortable: boolean, defaultSort?: 'asc' | 'desc' };

  const headers: Header[] = [
    { name: 'Country', sortable: true, defaultSort: 'asc' },
    { name: 'Trend', sortable: false },
    { name: '2019 emissions', sortable: true },
    { name: 'As pct of global', sortable: true },
    { name: 'Per capita', sortable: true },
  ];

  let sort: {column: string, asc: boolean} = {column: 'Country', asc: true};

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
    if (column === 'Country') {
      return [...co2data].sort((a,b) => a.name > b.name ? 1 : -1);
    }
    else if (column === '2019 emissions') {
      return [...co2data].sort((a,b) => a.emissions2019 - b.emissions2019);
    }
    else if (column === 'As pct of global') {
      return [...co2data].sort((a,b) => a.globalPct - b.globalPct);
    }
    else if (column === 'Per capita') {
      return [...co2data].sort((a,b) => a.percapita - b.percapita);
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
        searchIndex: re.exec(d.name)?.index
      }))
      .filter(d => d.searchIndex !== undefined)
      .sort((a, b) => a.searchIndex - b.searchIndex)
      .map(d => d.id);
  }

  $: {
    searchResults = getSearchResults(searchText);
    sortedData = sortedData;
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

</script>


<h2 class='narrow'>{@html head}</h2>

<div class="search-bar">
  <input bind:value={searchText} placeholder='Search a country' />
</div>

<div class="grid-ghg">

  {#each headers as h}
    <div class="header" class:selected="{sort && sort.column === h.name}"
        on:click={() => h.sortable && onClickHeader(h)}>
      <span>
        {h.name}
        {#if sort && sort.column === h.name}
          <i class="arrow-down" class:arrow-up={sort.asc}></i>
        {/if}
      </span>
    </div>
  {/each}

  {#each sortedData as row, i}
    <div class="row" style={!displayRow(row, i) && 'display: none'}>
      <span class="country-span">
        <div class="country-column">

          <div class="country-name">
            {row.name}
          </div>

          <div class="country-description">
            {description}
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
        {row.emissions2019}
        <p class="number-descriptor">{emissions2015Comment}</p>
      </span>
      <span class="row-number">
        {row.globalPct}{@html globalPCTComment}
      </span>
      <span class="row-number">
        {row.percapita}
        <p class="number-descriptor">{@html perCapitaComment}</p>
      </span>
    </div>
  {/each}
</div>

{#if searchText === ''}
  <button
    class="show-more-button"
    on:click={() => showAll = !showAll}>
    <b>{showAll ? 'Show only main' : 'Show all countries'}</b>
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

.row {
  display: contents;
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

</style>