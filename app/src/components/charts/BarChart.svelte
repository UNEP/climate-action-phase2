<script lang="ts">
    import Annotation from '../maps/Annotation.svelte';
    import {colorSectors, colorFuels} from 'src/App.svelte';

    const width = 950;
    const height = 125;

    export var data: {categoryName: string, value: number}[];
    export var selectedDataset: string;

    $: tiles = data;

    //This will change when we have the new color palette
    const colorFunction = (d: string) => selectedDataset === "sectors" ? colorSectors(d) : colorFuels(d);

    const categoryDictionary = {
        sector: {
            'waste': 'Waste',
            'windblowndust': 'Windblown dust',
            'solvents' : 'Solvents',
            'intlshipping': 'International shipping',
            'transport': 'Transport',
            'residential': 'Residential',
            'othercombustion': 'Other combustion',
            'commercial': 'Commercial',
            'remainingsources': 'Remaining sources',
            'industry': 'Industry',
            'otherfires': 'Other fires',
            'agrwasteburning': 'Agr. waste burning',
            'energy': 'Energy',
            'agriculture': 'Agriculture',
            'afciddust': 'AFCID dust'
        },
        fuel: {
            'solidbio': 'Solid bio',
            'process': 'Process',
            'coal': 'Coal',
            'liquid': 'Liquid'
        },
        disease: {
            'COPD': 'Chronic obstructive pulmonary disease',
            'DM': 'Diabetes mellitus type 2',
            'IHD': 'Ischemic heart disease',
            'LC': 'Lung cancer',
            'LRI': 'Lower respiratory infections',
            'Stroke': 'Stroke',
            'PTB': 'Pulmonary Tuberculosis',
            'LBW': 'Low birth weight'
        }
    };

    function categoryTranslator(category: string){
        if (selectedDataset === "fuels"){
            return categoryDictionary.fuel[category];
        }
        else if (selectedDataset === "sectors"){
            return categoryDictionary.sector[category];
        }
        else {
            return categoryDictionary.disease[category];
        }
    }

    function calculateTotalSum(){
        let sum = 0;
        data.forEach(d => {
            sum += d.value;
        });
        return sum;
    }

    function generateDeathsCommentary(){

    }

    function commentaryByDataset(dataset: string){

        if (dataset === "deaths"){
            return `Most deaths are due to <b>${categoryTranslator(tiles[0].categoryName)}</b>. Another significant causes are: {more}.`;
        }
        else if (dataset === "fuels"){
            return `Most of that PM2.5 in comes from <b>{mostfuel}</b> —<b>{mostfuelvalue}</b> of the 
            <b>{totalpollution}</b> µg/m<sup>3</sup>. A lot more than the mean value for the region.`;
        }
        else {
            return `<b>{mostsector}</b> is the top contributor to the fine particle pollution levels 
            —<b>{mostsectorvalue}</b> of the <b>{totalpollution}</b> µg/m<sup>3</sup>. A lot more than the regional mean.`;
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

    /*This function has data as a parameter so whenever data changes, this function is called
    Not the best solution, but it works
    */
    function redrawBarChart(data: {categoryName: string, value: number}[]){
        totalValue = calculateTotalSum();
        sum_width_categories = 0;
        showInformation = false;
        currentCategory = null;
        annotationPositions = [];
    }

    function generateAnnotation(){
        let annotation = categoryTranslator(currentCategory.categoryName) + `: ` + currentCategory.value.toLocaleString('en-US') + ` `;

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

{#if showInformation}
    <div class="annotation-text">
         <Annotation
            x={annotationPositions.find(a => a.name === currentCategory.categoryName).x}
            y={90}
            text={generateAnnotation()}
             radius={0}
            justText={true}
            canvasWidth={width}
            canvasHeight={height}
        />
    </div>
{/if}

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

    .annotation-text {
        
    }

</style>