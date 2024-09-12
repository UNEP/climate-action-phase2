<script lang="ts">
  import type { Content } from "src/types";
  import SectionTitle from "../SectionTitle.svelte";

  export let block: Content;

</script>

<div class="container">

  <div class="copy">
    <SectionTitle {block} />
    <h2>{@html block.head}</h2>
    <slot name="search" />
  </div>

  <div class="legend">
    <slot name="legend" />
  </div>
</div>

<style lang="scss">
  .container {
    display: flex;
    column-gap: 20px;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 100000;
    > :global(.legend-container) {
      max-width: 500px;
    }

    > * {
      flex: 1;
    }
  }


  @media screen and (max-width: 800px) {
    .container {
      display: block;
      margin-bottom: 20px;
    }
  }

</style>
