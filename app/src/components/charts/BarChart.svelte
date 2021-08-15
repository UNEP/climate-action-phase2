<script lang="ts" context="module">
    import {colorSectors, colorFuels} from 'src/App.svelte';
</script>

<script lang="ts">
    import * as d3 from 'src/d3';
    import type {CategoryStackedBar} from 'src/components/FinalSummary.svelte';

    const width = 950;
    const height = 125;

    export var data: {categoryName: string, value: number}[];
    export var selectedDataset: string;

    $: tiles = data;

    const colorFunction = (d: string) => selectedDataset === "sectors" ? colorSectors(d) : colorFuels(d);

    function calculateTotalSum(){
        let sum = 0;
        data.forEach(d => {
            sum += d.value;
        });
        return sum;
    }

    function commentaryByDataset(dataset: string){
        if (dataset === "deaths"){
            return `Most deaths are due to <b>{mostdeaths}</b>. Another significant causes are: {more}.`;
        }
        else if (dataset === "fuels"){
            return `Most of that PM2.5 in comes from <b>{mostfuel}</b> —<b>{mostfuelvalue}</b> of the <b>{totalpollution}</b> µg/m<sup>3</sup>. A lot more than the mean value for the region.`;
        }
        else {
            return `<b>{mostsector}</b> is the top contributor to the fine particle pollution levels —<b>{mostsectorvalue}</b> of the <b>{totalpollution}</b> µg/m<sup>3</sup>. A lot more than the regional mean.`;
        }
    }

    function sortDataByValue(data){
        data.sort(function(a, b) {
            return b.value - a.value;
        });
    }

    $: sortDataByValue(tiles);   

    let totalValue = calculateTotalSum();

    let sum_width_categories = 0;
    let showInformation = false;
    let currentCategory = null;

    function calculateCategoricalWidth(value: number){
        return value * width / totalValue;
    }

    function calculateX(value: number){
        let widthOfCurrentCategory = calculateCategoricalWidth(value);
        sum_width_categories += widthOfCurrentCategory;
        return (sum_width_categories - widthOfCurrentCategory);
    }

    $: commentary = commentaryByDataset(selectedDataset);

</script>


<div class="col-text">
    <p>{@html commentary}</p>
</div>

<div class="svg" {width} {height}>
    <svg id="barchart" {width} {height}>
        {#each tiles as tile}
            <g id="ID" class="region">
                <rect
                    id = {tile.categoryName}
                    class="tile"
                    width= {calculateCategoricalWidth(tile.value)}
                    height= 85
                    x={calculateX(tile.value)}
                    y=0
                    rx="0"
                    ry="0"
                    filter="none"
                    style= "fill: {colorFunction(tile.categoryName)}; outline: none;"
                    on:mouseenter={()=>{showInformation = true; currentCategory = tile;}}
                    on:mouseout={()=>{showInformation = false;}}
                    on:blur={()=>{showInformation = false;}}
                />
            </g>
        {/each}
    </svg>
</div>

<style>

</style>