<script>
export let text;
export let head;
</script>
<section class='col-text'>
  {#if head}
  <h1>{@html head}</h1>
  {/if}
  {#if text}
  {#each text as p,i}
      <p>{@html p.p}</p>
  {/each}
  {/if}
</section>