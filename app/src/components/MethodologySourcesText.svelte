<script lang="ts">
  import type { TextBlock } from 'src/types';
  import SectionTitle from "src/components/SectionTitle.svelte";

  export var head: string;
  export var anchor: string;
  export var text: TextBlock[];
</script>

<section class="infoSquare" id={anchor}>
  <SectionTitle sectionTitle="sources"/>
  {#each text as t}
    <p class='info-text'>{@html t.p}</p>
  {/each}
</section>

<style>
  .infoSquare {
    margin: 0 -2rem;
    padding: 1rem 2rem;
    background-color:#E8E8E8;
    overflow: auto;
    max-width: 800px;
  }

  .info-text {
    color:#505050;
  }

  h2 {
    font-size: 1.15rem;
    font-weight: 600;
  }

  @media (min-width: 58rem) {
    .infoSquare {
      margin: 1rem 0 0;
      padding: 3.6rem;
    }
  }
</style>