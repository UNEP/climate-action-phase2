<script lang="ts">
  import type { CartogramDataPoint } from "./CartogramTypes";
  export let d: CartogramDataPoint<any,any>;
</script>

<div
  class="country {d.classes}"
  style={d.style}
  data-code={d.id}
  tabindex="0"
  on:mouseenter
  on:mouseleave
  on:focus
  on:blur
>
  {#if d.width > 100}
    <span class="country-text">{d.short}</span>
  {/if}
</div>

<style lang="scss">
  .country {
    position: absolute;
    border-radius: 4px;
    cursor: pointer;
    opacity: 1;
    z-index: 2;
    transition: top 0.2s, left 0.2s, width 0.2s, height 0.2s, background-color 0.2s, opacity 0.45s ease 0.15s;
    will-change: opacity, background-color, border-radius;
    background: grey;
    outline-color: black;
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
  }

  .country--hide {
    opacity: 0.5;
  }

  .country--shadow {
    box-shadow: 0 3px 10px rgb(0 0 0 / 0.4);
  }

  :global(.cartogram-resizing) .country {
    transition: none;
  }

  :global(.cartogram-country-hover) .country:not(:hover) {
    opacity: 0.65;
    transition: opacity 0.05s;
  }

  :global(.cartogram-country-hover) .country:hover {
    opacity: 0.999;
    transition: opacity 0s;
    z-index: 3;
  }

</style>