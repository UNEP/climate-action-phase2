<script lang="ts">
  import type { Content } from "src/types";
  import SectionTitle from "../SectionTitle.svelte";

  export let block: Content;

</script>

<div class="container">

  <div>
    <SectionTitle {block} />
    <h2>{@html block.head}</h2>
  </div>

  <div>
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
    z-index: 10;
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
