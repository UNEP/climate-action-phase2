<script lang="ts">
    import * as d3 from 'src/d3';
import { trailingDebounce } from 'src/util';
    let chartWidth = 600;
    let chartHeight = 300;

    const tile1 = {
        value: 20,
        name: "Pito",
        color: "red"
    }

    const tile2 = {
        value: 10,
        name: "Chocho",
        color: "blue"
    }

    const tiles = [];
    tiles.push(tile1);
    tiles.push(tile2);


</script>

<div class="svg" width="{chartWidth}" height="{chartHeight}">
    <svg id="barchart" width="{chartWidth}" height="{chartHeight}">
        {#each tiles as tile}
            <g id="Pito" class="region">
            <rect
                id = {tile.name}
                class="tile"
                width= {tile.value}
                height= 50
                x=100
                y=100
                rx="4"
                ry="4"
                filter="none"
                style= "fill: {tile.color}"
            />
            </g>
        {/each}
    </svg>
</div>