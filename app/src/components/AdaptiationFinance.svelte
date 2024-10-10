<script lang="ts">
  import type { Content, TextBlock } from "src/types";
  import ScrollableX from "./common/ScrollableX.svelte";
  import CartogramHeader from "./maps/CartogramHeader.svelte";
  import VizSection from "./common/VizSection.svelte";
  import FinanceMap from "./maps/FinanceMap.svelte";
  import AdaptationFinancePopup from "./AdaptationFinancePopup.svelte";
  import FinanceMapLabels from "./maps/FinanceMapLabels.svelte";
  import AdaptationFinance from 'src/data/adaptation-finance.json';
  import data from "src/data";


  export var isEmbed = false;
  export var block: Content.AnnotatedImage;
  export var id: string;
  export var text: TextBlock[];

  let selectedContinent = 0;

  let currency = 'usd';
  let selectedData;
  $: if (selectedContinent) {
      selectedData = AdaptationFinance.filter(c => c.id === selectedContinent)[0];
      console.log(selectedContinent);
      console.log(selectedData);
  }

</script>

<VizSection {id}>
  <CartogramHeader {block}>

    <div slot="legend">
      <div class="button-area">
        <button class:active={currency === `usd`}  on:click={() => currency = `usd`}>US$ billion</button>
        <button class:active={currency === `gdp`} on:click={() => currency = `gdp`}>% GDP</button>
      </div>
    </div>
  </CartogramHeader>
  <p class="help-text note" style="margin: 0; margin-top: -20px;">Click the map for more details</p>
  <div class="margin-breakout-mobile">
    <ScrollableX>
      <div class="container">
        <div>
          <FinanceMap bind:selectedContinent data={AdaptationFinance} bind:currency />
        </div>
        {#if selectedContinent !== 0}
          <AdaptationFinancePopup currency={currency} bind:selectedData bind:selectedContinent />
        {/if} 
      </div>
    </ScrollableX>
  </div>

  {#if !isEmbed}
    {#each text as t}
      <p class="col-text">{@html t.p}</p>
    {/each}
  {/if}
</VizSection>

<style lang="scss">
  .container {
    width: 100%;
  }
  .title {
    font-size: 14px;
    padding-left: 12px;
    margin: 10px 0 12px 0;
  }
  .aimg-container {
    flex: 1;
    position: relative;
    overflow: hidden;
  }
  .inline-annotation {
    font-size: 14px;
    line-height: 1.5;
    padding: 0 10px;
    margin-top: 10px;
    display: grid;
    div {
      grid-column: 1;
      grid-row: 1;
      visibility: hidden;
      &.visible {
        visibility: visible;
      }
    }
  }

  .legend {
    display: flex;
    align-items: center;
    column-gap: 5px;
    flex: 0;
    padding-left: 10px;
    min-width: 380px;
  }
  .legend-scale {
    max-width: 270px;
    min-width: 200px;
    flex: 1;
    font-size: 0;
    > :global(svg) {
      width: 100%;
    }
  }
  .legend-text {
    font-size: 14px;
    line-height: 1.3;
    margin: 0;
    padding: 0;
    > span {
      display: inline-block;
    }
  }

  .button-area {
    display: flex;
    justify-content: center;
    max-width: 300px;
    margin: 0 auto;
    border: 1px solid #DCDCDC;
    background: #F9F9F9;
  }

  .button-area button {
      text-align: center;
      font-family: Roboto;
      font-size: 14.4px;
      font-style: normal;
      font-weight: 300;
      line-height: 14.4px; 
      padding: 16px 0;
      width: 100%;
      border: none;
      background: none;
      cursor: pointer;
  }

  .button-area button:hover {
    background-color: #555;
    color: #fff;
  }

  .button-area button.active {
    background-color: #000;
    color: #fff;
  }

  @media (max-width: 600px) {
    .container :global(.aimg .annotation) {
      display: none;
    }
    .legend-text {
      display: none;
    }
    .legend {
      top: 25px;
    }
    .aimg-container {
      margin-top: 45px;
    }
  }
  
  @media (min-width: 600px) {
    .inline-annotation {
      display: none;
    }
  }
  @media (min-width: 600px) {
    .title {
      position: absolute;
      top: 35%;
      left: 2rem;
      max-width: 120px;
      font-size: 14px;
      line-height: 1.3;
      color: #808080;
      z-index: 5;
    }
    .white {
      color: #fff;
    }
  }
</style>
