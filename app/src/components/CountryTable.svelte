<script lang="ts" context="module">

  export interface CountryDataSquare {
      id: string,
      value: number
  }
</script>

<script lang="ts">
  import datasets from 'src/data';
  import type { Unpacked } from 'src/util';
  import type { Content } from 'src/types';
  import { displayVal } from 'src/util';
  import { createLookup } from 'src/util';
  import MiniLineChart from "src/components/charts/MiniLineChart.svelte";
  import SectionTitle from './SectionTitle.svelte';
  import Icon from './Icon.svelte';
  import { colorGHG } from 'src/colors';

  export let head: string;
  export let block: Content;
  export var id: string;

  const data = datasets.co2latest.filter(d => datasets.lookups.trends[d.id]);

  const top10Emissons = new Set(
    data
      .sort((a,b) => b.emissions2018 - a.emissions2018)
      .slice(0, 10)
      .map(d => d.id)
  );

  const ROW_LIMIT = 6;

  type RowData = Unpacked<typeof data>;

  let sortedData = data;

  let showAll = false;

  const formattedTrendsData = datasets.co2trends.map(d => ({
    id: d.id,
    category: datasets.ghgCategories[d.id],
    emissions: Object.entries(d.emissions)
      .map(([year, value]) => ({year: parseInt(year), value})),

  }));

  const formattedTrendsDataLookup = createLookup(formattedTrendsData, c => c.id, c => c);

  function getChartText(data: RowData) {
    if (top10Emissons.has(data.id)) {
      const latestEmissions = data.emissions2018;
      return `<b>${data.name}</b> is one of the top emitters accounting for ${data.globalPct}%
        of global GHG emissions. In 2018, it emitted ${latestEmissions} million tonnes.`;
    }
    else {
      const trends = datasets.lookups.trends[data.id];
      const change = data.emissions2018 / trends.emissions['1990'];
      const fallen = change <= 1;
      const relChange = fallen ? 1 - change : change - 1;
      const percStr = Math.round(relChange * 100).toFixed(0);
      return `<b>${data.name}</b> has had one of the biggest
        ${fallen ? 'drops' : 'increases'} in GHG emissions — ${percStr}% since 1990. `
        + `Today, it accounts for ${data.globalPct}% of global emissions.`;
    }
  }

  type Header = { name: string, sortable: boolean, defaultSort?: 'asc' | 'desc' };

  const headers: Header[] = [
    { name: 'Country', sortable: true, defaultSort: 'asc' },
    { name: '', sortable: false },
    { name: 'Trend', sortable: false },
    { name: '2018 emissions', sortable: true },
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
      return [...data].sort((a,b) => a.name > b.name ? 1 : -1);
    }
    else if (column === '2018 emissions') {
      return [...data].sort((a,b) => a.emissions2018 - b.emissions2018);
    }
    else if (column === 'As pct of global') {
      return [...data].sort((a,b) => a.globalPct - b.globalPct);
    }
    else if (column === 'Per capita') {
      return [...data].sort((a,b) => a.percapita2018 - b.percapita2018);
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

</script>

<section {id} class="container table">

  <SectionTitle {block} />

  <h2 class='narrow'>{@html head}</h2>

  <div class="search-bar">
    <input bind:value={searchText} placeholder='Search a country' />
  </div>

  <div class="grid-table">

    {#each headers as h}
      <div class="header"
        class:selected="{sort && sort.column === h.name}"
        class:sortable={h.sortable}
        data-name={h.name}
        on:click={() => h.sortable && onClickHeader(h)}
      >
        <span>{h.name}</span>
        {#if sort && sort.column === h.name}
          <div class="sort-arrow" class:sort-arrow--asc={sort.asc}>
            <Icon name='arrows.down' />
          </div>
        {/if}
      </div>
    {/each}

    {#each sortedData as row, i}
      <div class="row" style={!displayRow(row, i) ? 'display: none' : ''}>

        <div class="cell-name">{row.name}</div>

        <div class="cell-description">
          <div class="cell-description-text">
            {@html getChartText(row)}
          </div>
        </div>

        <div class="cell-chart">
          <MiniLineChart
            data={formattedTrendsDataLookup[row.id].emissions}
            stroke={colorGHG(formattedTrendsDataLookup[row.id].category)}
          />
        </div>

        <div class="cell-number cell-ghg">
          {displayVal(row.emissions2018, 2)} <span>million tonnes of GHG</span>
        </div>

        <div class="cell-number cell-perc">
          {row.globalPct < 0.1 ? '<0.1' : row.globalPct.toFixed(1)}<span>%</span>
        </div>

        <div class="cell-number cell-pcap">
          {row.percapita2018} <span>tonnes of GHG</span>
        </div>

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

<style type="text/scss">

  .container {
    margin-bottom: 60px;
  }

  .grid-table {
    display: grid;
    grid-template-columns: 200px 1fr 180px 110px 110px 90px;
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

  .cell-name, .cell-description {
    padding-right: 10px;
  }

  .cell-name {
    font-size: 1.2rem;
    font-weight: bold;
  }

  .cell-description {
    font-weight: 100;
    font-size: 16px;
    line-height: 1.6;
  }

  .cell-description-text {
    max-width: 400px;
  }

  .cell-number {
    font-weight: 100;
    font-size: 1.2rem;
    text-align: right;
    padding-left: 10px;
    span {
      color: #818181;
      font-weight: 500;
      text-align: right;
      font-size: .9rem;
      margin: 0%;
    }
  }

  .cell-pcap, .cell-ghg {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    row-gap: 2px;

    span {
      font-size: .9rem;
      display: block;
      line-height: 1.6;
      width: 90px;
    }
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
    text-transform: uppercase;
    position: relative;

    &.sortable {
      cursor: pointer;
    }

    &.selected {
      border-color: black !important;
      font-weight: 700;
    }

    &[data-name="2018 emissions"],
    &[data-name="As pct of global"],
    &[data-name="Per capita"] {
      text-align: right;
      flex-direction: row-reverse;
    }

    &[data-name="Per capita"] span {
      width: 60px;
    }

    &[data-name="As pct of global"] span {
      width: 80px;
    }

    &[data-name="2018 emissions"] span {
      width: 88px;
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

  // RESPONSIVELY DROP COLUMNS
  // original column template is:
  // grid-template-columns: 200px 1fr 180px 110px 110px 90px;

  @media (max-width: 1250px) {
    .header[data-name='As pct of global'], .cell-perc {
      display: none;
    }
    .grid-table {
      grid-template-columns: 200px 1fr 180px 110px 90px;
    }
  }

  @media (max-width: 950px) {
    .header[data-name=''], .cell-description {
      display: none;
    }
    .grid-table {
      grid-template-columns: 200px 180px 110px 90px;
    }
  }

  @media (max-width: 700px) {
    .header[data-name='Per capita'], .cell-pcap {
      display: none;
    }
    .grid-table {
      grid-template-columns: 40% 35% 25%;
    }

    .cell-name {
      font-size: 1rem;
    }

    .cell-ghg span{
      font-size:  10px;
    }
  }
</style>