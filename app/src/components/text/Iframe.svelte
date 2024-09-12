<script>
export let iframes;
export let head;
</script>
<section class='col-text'>
  {#if head}
  <h2>{@html head}</h2>
  {/if}
  {#if iframes}
    {#each iframes as i}
      <iframe frameborder="0" height="576" src="{i.src}" title={i.title} width="100%"></iframe>
    {/each}
  {/if}
</section>