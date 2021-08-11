<script lang='ts'>
	export let title = '';
	export let colors: string[];
	export let labels: string[];
	export let type = 'sequential';
</script>

<h3 class="note title">{@html title}</h3>

{#if type === 'sequential'}
<ol class='seq info'>
	{#each colors as c,i}
	<li style='width: { 100 / colors.length }%; background-color: {c};'>
		{#if labels[i] !== undefined}
			<p class='note'>{labels[i]}</p>
		{/if}
	</li>
	{/each}
</ol>

{:else if type === 'categorical'}
<ul class='cat info'>
	{#each colors as c,i}
    <li class='cat-item note'>
      <div class='cat-symbol' style='background-color: {c};'/>{labels[i]}
    </li>
	{/each}
</ul>
{/if}

<style>
	.title {
		margin:0;
		padding:0;
  }
	.seq, .cat {
		list-style-type: none;
		margin:0;
		padding:0;
  }
	.seq {
		height:3rem;
	}
  li {
		display: inline-block;
		position:relative;
		line-height: 1;
	}
	.seq li {
		height: .7rem;
		box-sizing: border-box;
		border-left:1px solid #f9f9f9;
	}
	li p {
		position:absolute;
		left:50%;
		width:100%;
		text-align: center;
		margin: .7rem 0 0 0;
		padding: 0;
	}
	.cat-symbol {
		width: .9rem;
		height: .9rem;
		border-radius: .2rem;
		display: inline-block;
		margin-right: .4rem;
		vertical-align:-0.1rem;
	}
	.cat-item {
    margin-right: 1.25rem;
  }
</style>
