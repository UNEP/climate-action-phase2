<script lang="ts">
    import type { MenuNav } from "src/types";
    export let menu: MenuNav[];

    // const sectionsMenu = [
    //     {label: 'PM2.5 pollution', a: '#'},
    //     {label: 'Where it comes from', a: '#'},
    //     {label: 'Fuel sources', a: '#'},
    //     {label: 'Report a project concern', a: '#'},
    // ];
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