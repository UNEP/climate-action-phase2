<script lang="ts">
  import type { CartogramDataPoint } from "./CartogramTypes";
  export let d: CartogramDataPoint<any,any>;
  export let canvasWidth: number = null;
  export let canvasHeight: number = null;
  export let datasetSelected = true;
  export let transitioning = false;

</script>

<div
  class="country {d.classes.join(' ')}"
  style="background-color: {d.color};"
  class:active={datasetSelected || transitioning}
  tabindex="0"
  on:mouseenter
  on:mouseleave
  on:focus
  on:blur
>
  {#if d.width > 80}
    <span class="country-text" class:showtext={datasetSelected && !transitioning}>{d.name}</span>
  {/if}
</div>

<style lang="scss">
  .country {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    cursor: pointer;
    opacity: 1;
    z-index: 2;
    background: grey;

    &:not(.active) {
      opacity: 0;
      transition: opacity 100ms linear 100ms;
    }

    &.fade {
      opacity: 0.1;
      transition: opacity 100ms ease-in;
    }

    &:focus {
      outline: black solid 1px;
    }


  }

  .country-text {
    color: white;
    font-weight: 400;
    font-size: .85rem;
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    width: min(100%, 50px);
    margin: auto;
    transform: translateY(-50%);
    text-align: center;
    opacity: 1;
    transition: opacity 100ms;

    &:not(.showtext) {
      opacity: 0;
    }
  }

  .country--hide.active {
    opacity: 0.5;
  }

  .country--shadow {
    box-shadow: 0 3px 10px rgb(0 0 0 / 0.4);
  }

  :global(.cartogram-resizing) .country {
    transition: none;
  }

  :global(.cartogram-country-hover) .country.active {
    &:not(:hover):not(.fade) {
      opacity: 0.65;
      transition: opacity 0.05s;
    }

    &:hover {
      opacity: 0.999;
      transition: opacity 0s;
      z-index: 3;
    }
  }

</style>