<script lang="ts" context="module">
    import {colorSectors, colorFuels} from 'src/App.svelte';
</script>

<script lang="ts">
    import * as d3 from 'src/d3';
    import type {CategoryStackedBar} from 'src/components/FinalSummary.svelte';
    import Annotation from '../maps/Annotation.svelte';

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

    let annotationPositions = [];

    function generateTextPosition(tile: {categoryName: string, value: number}, x: number, width: number){
        let label = {
            name: tile.categoryName,
            x: x + width/2
        };
        return label;
    }

    function calculateCategoricalWidth(value: number){
        return value * width / totalValue;
    }

    function calculateX(tile: {categoryName: string, value: number}){
        let widthOfCurrentCategory = calculateCategoricalWidth(tile.value);
        sum_width_categories += widthOfCurrentCategory;
        let x = sum_width_categories - widthOfCurrentCategory;
        annotationPositions.push(generateTextPosition(tile,x,widthOfCurrentCategory));
        return (x);
    }

    function redrawBarChart(data: {categoryName: string, value: number}[]){
        totalValue = calculateTotalSum();
        sum_width_categories = 0;
        showInformation = false;
        currentCategory = null;
        annotationPositions = [];
    }

    function generateAnnotation(){
        let annotation = currentCategory.categoryName + `: ` + currentCategory.value + ` `;

        if (selectedDataset === "deaths"){
            annotation += `deaths`;
        }
        else{
            annotation += `µg/m<sup>3</sup>`;
        }

        return annotation;
    }

    $: commentary = commentaryByDataset(selectedDataset);
    $: redrawBarChart(data);

</script>


<div class="col-text">
    <p>{@html commentary}</p>
</div>

<div>
    {#if showInformation}
        <Annotation
            x={annotationPositions.find(a => a.name === currentCategory.categoryName).x}
            y={90}
            text={generateAnnotation()}
            radius={0}
            justText={true}
            canvasWidth={width}
            canvasHeight={height}
        />
    {/if}
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
                    x={calculateX(tile)}
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