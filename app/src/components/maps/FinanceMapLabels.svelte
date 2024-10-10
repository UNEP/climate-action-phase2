<script lang="ts">
  export let data: any;
  export let currency;

</script>


<div class="label-area">
  {#each data as dt}
    <div class="label" data-region={dt.region}>{currency === `usd` ? `US$${dt.usd}` : `${dt.gdp}% of GDP`}</div>
  {/each}
</div>


<style>
  
  .label-area {
    width: 957px;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }

  .label {
    position: absolute;
    text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.58);
    font-family: Roboto;
    font-size: 12px;
    font-style: normal;
    font-weight: 300;
    line-height: 18px;
    color: white;
    pointer-events: none;
    text-align: center;
    width: 100px;
  }

  .label[data-region='South Asia'] {
    right: 23%;
    top: 35%;
  }
  .label[data-region='Europe and Central Asia'] {
    right: 27%;
    top: 25%;
  }
  .label[data-region='Latin America and the Caribbean'] {
    left: 29%;
    top: 55%;
  }
  .label[data-region='Sub-Saharan Africa'] {
    left: 52%;
    top: 46%;
  }
  .label[data-region='East Asia and the Pacific'] {
    right: 17%;
    top: 28%;
  }
  .label[data-region='Middle East and North Africa'] {
    right: 42%;
    top: 34%;
  }
</style>