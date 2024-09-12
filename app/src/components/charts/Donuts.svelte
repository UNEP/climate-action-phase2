<script>
  import * as d3 from "src/d3";

  export let selectedData;

  let width = 220,
    height = 220,
    margin = 0,
    color,
    arc,
    data_ready;

  const dataContinentals = {
    agriculture: "Agriculture",
    water: "Water",
    infrastructure: "Infrastructure and settlement",
    forest: "Forests and ecosystems",
    climate: "Climate-induced disaster",
    health: "Human health",
    energy: "Energy",
    coastal: "Coastal and marine resources",
    tourism: "Tourism",
    other: "Other sectors",
  };

  $: {
    const data = selectedData.chartData;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    let radius = Math.min(width, height) / 2 - margin;

    // const sortable = Object.entries(data)
    // .sort(([,a],[,b]) => a - b)
    // .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

    // Create dummy data
    // const data = { aagriculture: 9, water: 20, infrastructure: 30, forest: 8, climate: 12, health: 3, energy: 7, coastal: 14 };

    const sortable = Object.entries(data)
      .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]))
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

    // console.log(sortable);
    // set the color scale
    color = d3
      .scaleOrdinal()
      .domain([
        "agriculture",
        "water",
        "infrastructure",
        "forest",
        "climate",
        "health",
        "energy",
        "coastal",
        "tourism",
        "other",
      ])
      .range([
        "#F9B800",
        "#009FE3",
        "#A02C93",
        "#579A46",
        "#ED6B08",
        "#E12624",
        "#a6761d",
        "#5F348B",
        "#1C4DAB",
        "#49A6B2",
        "#878786",
      ]);

    // Compute the position of each group on the pie:
    const pie = d3
      .pie()
      .sort(null) // Do not sort group by size
      .value((d) => d[1]);

    data_ready = pie(Object.entries(sortable));

    // console.log(data_ready);
    // The arc generator
    arc = d3
      .arc()
      .innerRadius(radius * 0.6) // This is the size of the donut hole
      .outerRadius(radius * 0.8);

    // Another arc that won't be drawn. Just for labels positioning
    const outerArc = d3
      .arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);
  }

  let isSelect = true;
  let selected = 0;

  const MouseEventHandler = (s) => {
    selected = s;
    isSelect = s !== null ? true : false;
  };
</script>

<div class="donut">
  <div class="chart-area">
    <svg
      viewBox="{-width / 2}, {-height / 2}, {width}, {height}"
      style:max-width="100%"
      style:height="auto"
    >
      <g class="chart-inner" on:mouseleave={() => (isSelect = false)}>
        {#each data_ready as slice}
          <path
            class:unselect={selected !== slice.index}
            class:selected={selected === slice.index}
            on:mouseenter={() => MouseEventHandler(slice.index)}
            d={arc(slice)}
            fill={color(slice.data[0])}
          />
        {/each}
      </g>
    </svg>
    <div class="text-area">
      {#each data_ready as slice}
        {#if slice.index === selected}
          <div class="percentage">{slice.data[1]}%</div>
          <div>{dataContinentals[slice.data[0]]}</div>
        {/if}
      {/each}
    </div>
  </div>
</div>

<div class="legend-area">
  {#each data_ready as slice}
    <div
      class="percentage"
      class:active={selected === slice.index}
      on:mouseenter={() => MouseEventHandler(slice.index)}
    >
      <div
        class="color"
        style="background-color: {color(slice.data[0])};"
      ></div>
      <div class="text">{dataContinentals[slice.data[0]]}</div>
    </div>
  {/each}
</div>
<div class="note">
  Move your cursor over the pie chart or sectoral legends to see the proportion
</div>

<style>
  :global(body) {
    margin: 0;
  }

  .donut {
    width: 220px;
    margin: -17px 0;
  }
  .chart-area {
    position: relative;
  }

  .text-area {
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .text-area div {
    max-width: 105px;
    color: #1e1e1e;
    text-align: center;
    font-family: Roboto;
    font-size: 12px;
    font-style: normal;
    font-weight: 300;
    line-height: 14.4px;
  }

  .text-area div.percentage {
    color: #1e1e1e;
    font-size: 24px;
    font-weight: 700;
    line-height: 23px;
    cursor: pointer;
    margin-bottom: 4px;
  }

  .chart-inner path {
    cursor: pointer;
    transition: all ease-in-out 0.15s;
  }

  .chart-inner path:hover {
    filter: drop-shadow(0px 0px 7.7px rgba(31, 31, 31, 0.62));
  }

  .chart-inner path.selected {
    filter: drop-shadow(0px 0px 7.7px rgba(31, 31, 31, 0.62));
  }

  .chart-inner path.unselect {
    opacity: 0.5;
  }

  .legend-area {
    display: flex;
    column-gap: 2px;
    row-gap: 6px;
    flex-wrap: wrap;
  }

  .legend-area .percentage {
    display: flex;
    flex-wrap: nowrap;
    padding: 2px 3px;
    gap: 2px;
    border-radius: 4px;
    cursor: pointer;
    transition: all ease-in-out 0.15s;
  }

  .legend-area .percentage.active,
  .legend-area .percentage:hover {
    background: #fff;
    box-shadow: 0px 0px 8.3px 0px rgba(0, 0, 0, 0.3);
  }

  .legend-area .percentage .color {
    width: 12px;
    height: 12px;
    border-radius: 3px;
  }

  .legend-area .percentage .text {
    color: #1e1e1e;
    font-size: 12px;
    white-space: nowrap;
    font-style: normal;
    font-weight: 400;
    line-height: 12px;
  }

  .note {
    color: #1e1e1e;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 12px;
  }
</style>
