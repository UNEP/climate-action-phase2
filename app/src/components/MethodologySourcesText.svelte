<script lang="ts">
  import type { TextBlock } from 'src/types';
  import ScrollableX from 'src/components/common/ScrollableX.svelte';
  export var head: string;
  export var text: TextBlock[];

  const width = 800;
  const numTexts = text.length;
</script>

<div class="infoSquare">
  <ScrollableX>
    <h2 class='narrow'>{@html head}</h2>

    {#each text as t}
      <p class='info-text'>{@html t.p}</p>
      {#if t !== text[numTexts - 1]}
        <svg height="5" width={width}>
          <line x1="50" y1="0" x2={width - 50} y2="0" style="stroke:#BEBEBE;stroke-width:2.5" />
        </svg>
      {/if}
    {/each}
  </ScrollableX>
</div>

<style>
  .infoSquare {
    padding:1rem 7rem;
    margin-top:2rem;
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
</style>