<script lang="ts">
  interface MenuNav {
    a: string;
    label: string;
  }

  export let options: MenuNav[];

  const hasValidOptions = options instanceof Array;

</script>

<nav class="sections-menu" role="navigation">
  {#if hasValidOptions}
    <ul class='menu sections'>
      {#each options as i}
        <li><a href={i.a}>{@html i.label}</a></li>
      {/each}
    </ul>
  {:else}
    <div>Menu: Invalid options</div>
  {/if}
</nav>

<style>
  .sections-menu {
    position: sticky;
    margin:0;
    max-width: 10rem;
    top:0;
    right: 100%;
  }
</style>