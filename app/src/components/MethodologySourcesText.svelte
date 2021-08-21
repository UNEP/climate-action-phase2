<script lang="ts">
    import type { TextBlock } from 'src/types';
    export var head: string;
    export var text: TextBlock[];
    console.log("IM HERE");
</script>

<div class="infoSquare">
    <h2 class='narrow'>{@html head}</h2>

    {#each text as t}
        <p class='col-text'>{t.p}</p>
	{/each}
</div>

<style>
 
    .infoSquare {
        background-color: #e0e0e0;
        width: 500px;
        height: 300px;
    }
    
</style>