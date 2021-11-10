<script lang="ts" context="module">
  export interface CountryDataSquare {
      id: string,
      value: number
  }
</script>

<script lang="ts">
  import CRIdata from 'src/data/cri.json';
  import type { Unpacked } from 'src/util';
  import DistributionTiles from 'src/components/charts/DistributionTiles.svelte';
  import type { Content } from 'src/types';
  import SectionTitle from './SectionTitle.svelte';
  import Icon from './Icon.svelte';

  export let head:string;
  export let block: Content;
  export var id: string;

  const ROW_LIMIT = 6;

  type RowData = Unpacked<typeof CRIdata>;

  let sortedData = CRIdata;

  let showAll = false;

  let widthDistributionChart = 140;
  let heightDistributionChart = 45;

  let climateRiskIndexData: CountryDataSquare[] = CRIdata
    .map(d => {
      return { id: d.id, value: d.cri_score};
    });

  type Header = { name: string, index: number, sortable: boolean, defaultSort?: 'asc' | 'desc' };

  const headers: Header[] = [
    { name: 'country', index: 0,sortable: true, defaultSort: 'asc' },
    { name: 'chart', index: 1,sortable: false},
    { name: 'criIndex', index: 2,sortable: true },
    { name: 'criRank', index: 3,sortable: true },
    { name: 'totalDeaths', index: 4,sortable: true },
    { name: 'popAdjDeaths', index: 5,sortable: true },
    { name: 'totalLosses', index: 6,sortable: true },
    { name: 'gdpPctLosses', index: 7,sortable: true },
  ];

  const columnNames = ['COUNTRY','(A low value indicates most at risk)', 'INDEX', 'RANK', 'TOTAL',
    'POPULATION ADJUSTED', 'TOTAL', 'AS GDP PER CENT'];

  let sort: {column: string, asc: boolean} = {column: 'criRank', asc: true};

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
    if (column === 'country') {
      return [...CRIdata].sort((a,b) => a.country > b.country ? 1 : -1);
    }
    else if (column === 'criIndex') {
      return [...CRIdata].sort((a,b) => a.cri_score - b.cri_score);
    }
    else if (column === 'criRank') {
      return [...CRIdata].sort((a,b) => a.cri_rank - b.cri_rank);
    }
    else if (column === 'totalDeaths') {
      return [...CRIdata].sort((a,b) => a.fatalities_in_2019 - b.fatalities_in_2019);
    }
    else if (column === 'popAdjDeaths') {
      return [...CRIdata].sort((a,b) => a.fatalities_per_100000_inhabitants -
        b.fatalities_per_100000_inhabitants);
    }
    else if (column === 'totalLosses') {
      return [...CRIdata].sort((a,b) => a.losses_in_millions_usd - b.losses_in_millions_usd);
    }
    else if (column === 'gdpPctLosses') {
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

  $: innerWidth = 0;


</script>

<svelte:window bind:innerWidth/>

<section {id} class="container table">

  <SectionTitle {block} />

  <h2 class='narrow'>{@html head}</h2>

  <div class="search-bar">
    <input bind:value={searchText} placeholder='Search a country' />
  </div>

  <div id="grid">
    <div id="item1" class="header-title">CLIMATE<br>RISK</div>
    <div id="item2" class="header-title">CLIMATE-RELATED<br>DEATHS</div>
    <div id="item3" class="header-title">CLIMATE-RELATED<br>ECONOMIC LOSSES</div>
  </div>

  <div style="padding-bottom:5px"></div>

  <div class="grid-table">

    {#each headers as h}
      <div class="header"
        class:selected="{sort && sort.column === h.name}"
        class:sortable={h.sortable}
        data-name={h.name}
        on:click={() => h.sortable && onClickHeader(h)}
      >
        <span>{columnNames[h.index]}</span>
        {#if sort && sort.column === h.name}
          <div class="sort-arrow" class:sort-arrow--asc={sort.asc}>
            <Icon name='arrows.down' />
          </div>
        {/if}
      </div>
    {/each}

    {#each sortedData as row, i}
      <div class="row" style={!displayRow(row, i) && 'display: none'}>

        <div class="cell-name">
          {row.country}
        </div>

        <div class="cell-distribution">
                <DistributionTiles
                  data={climateRiskIndexData}
                  selectedCountry={row.id}
                  width={widthDistributionChart}
                  height={heightDistributionChart}
                />
        </div>

        <div class="cell-permanent-number">{row.cri_score}</div>

        <div class="cell-permanent-number">{row.cri_rank}</div>

        <div class="cell-number">{row.fatalities_in_2019}</div>

        <div class="cell-number">{row.fatalities_per_100000_inhabitants}</div>

        <div class="cell-number">{row.losses_in_millions_usd}</div>

        <div class="cell-number">{row.losses_per_unit_gdp_percentage}</div>

      </div>
    {/each}
  </div>

  {#if searchText === ''}
    <button
      class="show-more-button"
      on:click={onClickShowButton}>
      <b>{showAll ? 'Show fewer' : 'Show all countries'}</b>
    </button>
  {/if}


  </section>


<style lang="scss">

  .container {
    margin-bottom: 60px;
  }

  .grid-table {
    display: grid;
    grid-template-columns: 25% 15% 10% 10% 10% 10% 10% 10%;
    row-gap: 10px;
    border-top: 0px solid black;
    border-bottom: 0px solid #e5e5e5;
    border-right: 0px solid black;
  }

  .cell-distribution{
    padding-top: 10px;
  }

  .sort-arrow {
    width: 24px;
    flex-shrink: 0;
    position: relative;
    top: 1px;

    &.sort-arrow--asc {
      transform-origin: 50% 42%;
      transform: rotate(180deg);
    }
  }

  .row {
    display: contents;
    column-gap: 10px;

    > * {
      box-sizing: border-box;
      border-bottom: 1px solid #e0e0e0;
    }
  }

  .cell-name {
    font-size: 1.2rem;
    font-weight: bold;
    padding-right: 10px;
    display: flex;
    align-items:center;
  }

  .cell-permanent-number {
    font-weight: 100;
    font-size: 1.2rem;
    text-align: right;
    padding-left: 10px;
    display: flex;
    align-items:center;
    justify-content: right;
  }

  .cell-number {
    font-weight: 100;
    font-size: 1.2rem;
    text-align: right;
    padding-left: 10px;
    display: flex;
    align-items:center;
    justify-content: right;
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

  .header {
    display: flex;
    border-bottom: 2px solid #cccccc;
    padding-bottom: 10px;
    align-items: flex-end;
    position: relative;

    &.sortable {
      cursor: pointer;
    }

    &.selected {
      border-color: black !important;
      font-weight: 700;
    }

    &[data-name="criIndex"],
    &[data-name="criRank"],
    &[data-name="totalDeaths"],
    &[data-name="popAdjDeaths"],
    &[data-name="gdpPctLosses"],
    &[data-name="totalLosses"] {
      text-align: right;
      flex-direction: row-reverse;
    }
  }

  .search-bar {
    padding-bottom: 50px;

    input {
      width: 50%;
      padding: 0.5rem 0rem;
      background: #f9f9f9;
      font-size: 1.5rem;
      border: 0;
      border-radius: 0;
      border: 0px solid #cccccc;
      border-bottom-width: 2px;
      font-family: Roboto;
      font-weight: lighter;
      &:focus {
        outline-width: 0px;
        background-color: #f9f9f9;
      }
    }
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

  // RESPONSIVELY DROP COLUMNS
  // original column template is:
  // grid-template-columns: 25% 15% 10% 10% 10% 10% 10% 10%;

  @media (max-width: 1250px) {
    .header[data-name='totalLosses'],
    .header[data-name='popAdjDeaths'],
    .header[data-name='totalDeaths'],
    .header[data-name='gdpPctLosses'],
    .cell-number {
      display: none;
    }

    .cell-permanent-number{
      font-size: 1rem;
    }

    #item2, #item3{
      display:none;
    }

    #item1{
      grid-column: 5/5;
    }

    .grid-table {
      grid-template-columns: 35% 35% 15% 15%;
    }
  }

  @media (max-width: 950px) {
    .cell-name {
      font-size: 1rem;
    }
  }


</style>