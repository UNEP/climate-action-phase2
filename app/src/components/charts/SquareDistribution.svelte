<script lang="ts" context="module">
    import { colorPM25, colorHealth } from "src/App.svelte";
</script>

<script lang="ts">
import type {CountryDataSquare} from 'src/components/FinalSummary.svelte';

    const width = 450;
    const height = 100;
    const normalTileWidth = 3;
    const normalTileHeight = 20;
    const relevantTileWidth = 5;
    const relevantTileHeight = 34;
    const xBorderRadius = 10;
    const yBorderRadius = 3;

    export var selectedCountry: string;
    export var data: CountryDataSquare[];
    export var selectedDataset: string;

    const colorFunction = (d: number) => selectedDataset === "pm25" ? colorPM25(d) : colorHealth(d);

    function findMaxValue(data: CountryDataSquare[]){
        let max = 0;
        data.forEach(c => {
            if (c.value > max){
                max = c.value;
            }
        });
        return max;
    }

    function findXlocation(countryValue: number){
        return countryValue * (width-4) / maxValue;
    }

    $: maxValue = findMaxValue(data);

    $: relevantCountry = {
        id: selectedCountry,
        value: data.find(c=>c.id === selectedCountry).value,
        relevantCountryColor: colorFunction(data.find(c=>c.id === selectedCountry).value)
    };

</script>

<div>
    <svg id="barchart" {width} {height}>
        {#each data as d}
            {#if d.value != null && d.id != selectedCountry}
                <g id="ID" class="region">
                    <rect
                        id = {d.id}
                        class= "normalTile"
                        width= {d.id === selectedCountry ? relevantTileWidth : normalTileWidth}
                        height= {d.id === selectedCountry ? relevantTileHeight : normalTileHeight}
                        x={findXlocation(d.value)}
                        y=10
                        rx={xBorderRadius}
                        ry={yBorderRadius}
                        filter="none"
                        style = "--theme-color: {colorFunction(d.value)}"
                    />
                </g>
            {/if}
        {/each}
        <g id="ID" class="region2">
             <rect
                id = {relevantCountry.id}
                class= "selectedCountry"
                width= {relevantTileWidth}
                height= {relevantTileHeight}
                x={findXlocation(relevantCountry.value)}
                y=4
                rx="10"
                ry="3"
                filter="none"
                style = "--theme-color: {colorFunction(relevantCountry.value)}"
             />
        </g>
    </svg>
</div>

<style>

    .selectedCountry {
        fill: var(--theme-color);
        stroke-width: 1.2;
        stroke: black;
    }

    .normalTile {
        fill: var(--theme-color);
    }

    .region2 {
        filter: drop-shadow(3px 5px 2px rgb(0 0 0 / 0.6));
    }

</style>