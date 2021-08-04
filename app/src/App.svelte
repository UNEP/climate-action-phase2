<script lang="ts">
	import CartoWorld from 'src/components/CartoWorld.svelte';
	import CartoRegion from 'src/components/CartoRegion.svelte';
	import Intro from 'src/components/text/Intro.svelte';
	import Text from 'src/components/text/Text.svelte';
	import TopNav from 'src/components/nav/TopNav.svelte';
	import Footer from './components/nav/Footer.svelte';
	import type { Content } from 'src/types';
	import text from 'src/text.json';

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
<Footer />
<style>

</style>
