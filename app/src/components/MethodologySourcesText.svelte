<script lang="ts">
    import type { TextBlock } from 'src/types';
    export var head: string;
    export var text: TextBlock[];

    var height = 500;
    var width = 500;

    console.log("IM HERE");

</script>

<div class="infoSquare" style="width:{width}px; height:{height}px">
    <h2 class='narrow'>{@html head}</h2>

    {#each text as t}
        <p class='info-text'>{@html t.p}</p>
        <svg height="5" width="500">
            <line x1="50" y1="0" x2="450" y2="0" style="stroke:#BEBEBE;stroke-width:2.5" />
        </svg>
	{/each}
</div>

<style>
 
    .infoSquare {
        padding:.8rem 2rem;
        margin-bottom: 2rem;
        margin-top:2rem;
        background-color:#E8E8E8;
        overflow: auto;
    }

    .info-text {
        color:#505050;
    }

    h2 { 
        font-size: 1.15rem;
        font-weight: 600;
    }
</style>