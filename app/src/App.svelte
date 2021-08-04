<script>
	import CartoWorld from './components/CartoWorld.svelte'
	import CartoRegion from './components/CartoRegion.svelte'
	import Intro from './components/text/Intro.svelte'
	import Text from './components/text/Text.svelte'
	import TopNav from './components/nav/TopNav.svelte';
  	export let content, meta, footer;

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