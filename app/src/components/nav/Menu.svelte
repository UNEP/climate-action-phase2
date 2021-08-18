<script lang="ts">
  interface MenuNav {
    a: string;
    label: string;
  }

  export let menu: MenuNav[];
</script>

<nav class="sections-menu" role="navigation">
  <ul class='menu sections'>
    {#each menu as i}
      <li>{@html i.label}</li>
    {/each}
  </ul>
</nav>

<style>
  .sections-menu {
    position: sticky;
    margin:0;
    max-width: 10rem;
    top:0;
  }
</style>