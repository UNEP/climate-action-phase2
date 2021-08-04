<script>
	import CartoWorld from './components/CartoWorld.svelte';
	import CartoRegion from './components/CartoRegion.svelte';
	import Intro from './components/text/Intro.svelte';
	import Text from './components/text/Text.svelte';
	import TopNav from './components/nav/TopNav.svelte';

  import type { Content, Footer, Meta } from 'src/types';

  export let content: Content[];
  export let meta: Meta;
  export let footer: Footer;

</script>

<TopNav />
<main>
  <article>
    {#each content as block}
		{#if block.type === 'carto-world'}
		<CartoWorld {...block} />
		{:else if block.type === 'carto-region'}
		<CartoRegion {...block}/>
		{:else if block.type === 'intro'}
		<Intro {...block} />
    	{:else}
    	  <Text {...block} />
    	{/if}
    {/each}
  </article>
</main>

<style>

</style>
