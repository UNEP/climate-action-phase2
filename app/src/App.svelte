<script>
	import CartoWorld from './components/CartoWorld.svelte';
	import CartoRegion from './components/CartoRegion.svelte';
	import Intro from './components/text/Intro.svelte';
	import Text from './components/text/Text.svelte';
	import TopNav from './components/nav/TopNav.svelte';
  import type { Content } from 'src/types';
  import text from './text.json';

  const content: Content[] = text.article;

  const components = {
    'carto-world': CartoWorld,
    'carto-region': CartoRegion,
    'intro': Intro,
    'text': Text,
  };

</script>

<TopNav />
<main>
  <article>
    {#each content as block}
      {#if components[block.type]}
        <svelte:component this={components[block.type]} {...block} />
      {:else}
        <div>Missing component for '{block.type}'</div>
      {/if}
    {/each}
  </article>
</main>

<style>

</style>
