<script lang="ts" context="module">
  export interface CountryDataSquare {
      id: string,
      value: number
  }
</script>

<script lang="ts">
  import climateActionData from 'src/data/climateAction-countryTable-data.json';
  import type { Unpacked } from 'src/util';
  import type { Content } from 'src/types';
  import SectionTitle from './SectionTitle.svelte';
  import Icon from './Icon.svelte';

  export let head:string;
  export let block: Content;
  export var id: string;

  const ROW_LIMIT = 6;

  type RowData = Unpacked<typeof climateActionData>;

  let sortedData = climateActionData;

  let showAll = false;

  type Header = { name: string, index: number, sortable: boolean, defaultSort?: 'asc' | 'desc' };

  const headers: Header[] = [
    { name: 'country', index: 0, sortable: true, defaultSort: 'asc' },
    { name: 'description', index: 1, sortable: false},
    { name: 'ndcStatus', index: 2, sortable: true },
    { name: 'ntzStatus', index: 3, sortable: true },
    { name: 'year', index: 4, sortable: true },
  ];

  const columnNames = ['COUNTRY','', 'NDC STATUS', 'NTZ STATUS', 'YEAR'];

  const rankingNTZstatus = {
    'Proposed / in discussion': 1,
    'Declaration / pledge': 2,
    'Achieved (self-declared)': 3,
    'In policy document': 4,
    'In law': 5
  };

  const rankingNDCstatus = {
    'First 2020 NDC': 5,
    'Second 2020 NDC': 4,
    'Only First NDC': 3,
    'Only INDC': 2,
    'Nothing submitted': 1
  };

  let sort: {column: string, asc: boolean} = {column: 'country', asc: true};

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
      return [...climateActionData].sort((a,b) => a.name > b.name ? 1 : -1);
    }
    else if (column === 'ndcStatus') {
      return [...climateActionData].sort(function(a, b){
        if (rankingNDCstatus[a.ndcStatus] < rankingNDCstatus[b.ndcStatus]){
          return -1;
        }
        else{
          return 1;
        }
      });
    }
    else if (column === 'ntzStatus') {
      return [...climateActionData].sort(function(a, b){
        if (rankingNTZstatus[a.status] < rankingNTZstatus[b.status] || !rankingNTZstatus[a.status]){
          return -1;
        }
        else{
          return 1;
        }
      });
    }
    else if (column === 'year') {
      return [...climateActionData].sort((a,b) => a.year - b.year);
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

        <div class="cell-name">{row.name}</div>

        <div class="cell-description">
          <div class="cell-description-text">
            {@html row.description}
          </div>
        </div>

        <div class="cell-number">{row.ndcStatus}</div>

        <div class="cell-number">{row.status ? row.status : '—'}</div>

        <div class="cell-number">{row.year ? row.year : '—'}</div>

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


  </section>


<style lang="scss">

  .container {
    margin-bottom: 60px;
  }

  .grid-table {
    display: grid;
    grid-template-columns: 20% 40% 15% 15% 10%;
    row-gap: 10px;
    border-top: 0px solid black;
    border-bottom: 0px solid #e5e5e5;
    border-right: 0px solid black;
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

  .cell-description {
    font-weight: 100;
    font-size: 16px;
    line-height: 1.6;
    padding-right: 10px;
  }

  .cell-description-text {
    max-width: 400px;
    padding-bottom: 10px;
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

    &[data-name="ndcStatus"],
    &[data-name="ntzStatus"],
    &[data-name="year"] {
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

  // RESPONSIVELY DROP COLUMNS
  // original column template is:
  // grid-template-columns:;

  @media (max-width: 1250px) {
    .header[data-name='totalLosses'],
    .header[data-name='popAdjDeaths'],
    .header[data-name='totalDeaths'],
    .header[data-name='gdpPctLosses'],
    .cell-number {
      display: none;
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