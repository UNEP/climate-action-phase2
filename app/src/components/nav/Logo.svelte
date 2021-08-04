<script>
	import UNEPLogoBlue from '../assets/unep50.svg'
	import UNEPLogoWhite from '../assets/unep50white.svg'
  export let color;
</script>

<div class="logo">
	{#if color === 'white'}
	{@html UNEPLogoWhite}
	{:else}
	{@html UNEPLogoBlue}
	{/if}
</div>

<style>

	.logo {
		width: 11rem;
		transition: height .5s;
	}

</style>