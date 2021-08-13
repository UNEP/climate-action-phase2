<script lang="ts" context="module">
    import Annotation from 'src/components/maps/Annotation.svelte';
</script>

<script lang="ts">
    import * as d3 from 'src/d3';
    let chartWidth = 350;
    let chartHeight = 200;

    const tile1 = {
        value: 100,
        name: "One",
        color: "#dc8ea5",
        x: 0,
        center: 0
    }

    const tile2 = {
        value: 50,
        name: "Two",
        color: "#62b048",
        x: 0,
        center: 0
    }

    const tile3 = {
        value: 200,
        name: "Three",
        color: "#dc8ea5",
        x: 0,
        center: 0
    }

    const tiles = [];
    tiles.push(tile1);
    tiles.push(tile2);
    tiles.push(tile3);

    let variable = 0;
    let showInformation = false;
    let currentCategory = null;

    tiles.forEach(t => {
        t.x = calculateX(t);
        t.center = t.x + (t.value/2);
    });

    function calculateX(tile){
        let pastVariable = variable;
        variable += tile.value; 
        return pastVariable;
    }

</script>



<div class="svg" width="{chartWidth}" height="{chartHeight}">

    <div class="text"  width="{chartWidth}" height="{chartHeight}">
        {#if showInformation}
          <Annotation
            x={currentCategory.center}
            y={40}
            text= "AIDS: {currentCategory.value} deaths"
            radius={0}
            forceTopWherePossible={true}
            canvasWidth= {chartWidth}
            canvasHeight={chartHeight}
          />
        {/if}
    </div>

    <svg id="barchart" width="{chartWidth}" height="{chartHeight}">
        {#each tiles as tile}
            <g id="ID" class="region">
            <rect
                id = {tile.name}
                class="tile"
                width= {tile.value}
                height= 75
                x={tile.x}
                y=100
                rx="1"
                ry="1"
                filter="none"
                style= "fill: {tile.color}"
                on:mouseenter={()=>{showInformation = true; currentCategory = tile;}}
                on:mouseout={()=>{showInformation = false}}
                on:blur={()=>{showInformation = false}}
            />
            </g>
        {/each}
    </svg>
</div>

<style>

</style>