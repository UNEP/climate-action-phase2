<script lang="ts" context="module">
    export interface CountryDataSquare {
        id: string,
        value: number
    }
</script>

<script lang="ts">
    import Typeahead from "svelte-typeahead";
    import countries from 'src/data/countryDictionary.json';
    import BarChart from 'src/components/charts/BarChart.svelte';
    import ColoredSquareDistribution from 'src/components/charts/SquareDistribution.svelte';
    import fuels from 'src/data/fuels.json';
    import sectors from 'src/data/sectors.json';
    import deathsdata from 'src/data/deathDatabase.json';
    import pm25data from 'src/data/pm25.json';
    import healthData from 'src/data/health.json';
    import { createLookup } from "src/util";

    const countriesToBeFiltered = ["AIA","VGB","CYM","CUW","SWZ","FLK","FRO",
    "GIB","VAT","JEY","LIE","MSR","NCL","NFK","PCN","SHN","SPM","TCA","ESH"];

    const CTBF_lookUp = createLookup(countriesToBeFiltered, c => c, c => c);
    const pm25LookUp = createLookup(pm25data, p => p.id, p => p);
    const healthLookUp = createLookup(healthData, h => h.id, h => h);
    const deathsLookUp = createLookup(deathsdata, d => d.id, d => d);
    const fuelsLookUp = createLookup(fuels, f => f.id, f => f);
    const sectorsLookUp = createLookup(sectors, s => s.id, s => s);

    const maxNumSearchResults = 5;

    $: currentCountry = {
        id: "",
        PM25country: 0,
        timesPM25: 0,
        totalDeaths: 0,
        deathRatio: 0
    };

    let countryPM25Data: CountryDataSquare[] = pm25data
    .map(d => {
        return {
            id: d.id,
            value: d.pm25
        };
    });

    let countryHealthData: CountryDataSquare[] = healthData
    .map(d => {
         return {
            id: d.id,
            value: d.rate
        };
    });

    $: countrySectorsData = generateData(currentCountry.id, "sectors");
    $: countryFuelsData = generateData(currentCountry.id, "fuels");
    $: countryDeathsData = generateData(currentCountry.id, "deaths");

    let countrySelected = false;

    function generateData(countryID: string, selectedDB: string){
        let countryInfo;
        if (selectedDB === "sectors"){
            countryInfo = sectorsLookUp[countryID];
        }
        else if (selectedDB === "fuels"){
            countryInfo = fuelsLookUp[countryID];
        }
        else {
            countryInfo = deathsLookUp[countryID];
        }
        let array = [];
        for (const Attribute in countryInfo){
            if (Attribute != "id"){
                let tile = {categoryName : Attribute, value: countryInfo[Attribute]};
                array.push(tile);
            }  
        }
        return array;
    }

    function toFilter(countryID:string){

        if (CTBF_lookUp[countryID] != null){
            return true;
        }
        else return false;
    }
    
    const extract = (item) => item.name;
    const filter = (item) => toFilter(item.id);
    const head = `Lorem <b>ipsum dolor sit amet</b>, consectetur adipiscing elit. Mauris mattis posuere faucibus.`;

    let events = [];

    function updateSelectedCountry(event, detail) {
        events = [...events, { event, detail }];
        if (event === "select"){
            let newID = detail.original.id;
            currentCountry.id = newID;
            currentCountry.PM25country = pm25LookUp[newID].pm25;
            currentCountry.timesPM25 = parseFloat((currentCountry.PM25country/10).toFixed(1));
            currentCountry.totalDeaths = healthLookUp[newID].deaths;
            currentCountry.deathRatio = healthLookUp[newID].rate;
            countrySelected = true;
        }
        else{
            currentCountry.id = "";
            currentCountry.PM25country = 0;
            currentCountry.timesPM25= 0;
            currentCountry.totalDeaths= 0;
            currentCountry.deathRatio = 0;
            countrySelected = false;
        }
    }

    $: PM25commentary = ` µg/m<sup>3</sup> <br>each person's annual mean exposure <br>—` 
    + currentCountry.timesPM25 + ` times WHO's guideline.`;

    $: PMtimesCommentary = ` deaths per 100,000 people <br>attributable to fine particle 
    pollution in 2017 <br>(` + currentCountry.totalDeaths.toLocaleString('en-US') + ` in total in the country).`;

</script>

<section class="viz wide">

    <h2 class='narrow'>{@html head}</h2>

    <div class="searchBar">
        <Typeahead 
            data={countries} 
            {extract} 
            {filter}
            on:select={(e) => updateSelectedCountry("select", e.detail)}
            on:clear={(e) => updateSelectedCountry("clear", e.detail)}
            limit={maxNumSearchResults}
            placeholder={ `Search a country`}
            hideLabel>
        </Typeahead>

    </div>

    {#if countrySelected}

        <div class="summary">
            <div class="narrow">
                <p><span class="bigger-text">{currentCountry.PM25country}</span>{@html PM25commentary}</p>

                <div>
                    <ColoredSquareDistribution
                        data = {countryPM25Data}
                        selectedCountry = {currentCountry.id}
                        selectedDataset = "pm25"
                    />
                </div>

            </div>

            <div class="right-narrow">
                <p><span class="bigger-text">{currentCountry.deathRatio}</span>{@html PMtimesCommentary}</p>

                <div>
                    <ColoredSquareDistribution
                        data = {countryHealthData}
                        selectedCountry = {currentCountry.id}
                        selectedDataset = "health"
                    />
                </div>

            </div>
        </div>

        <div class="BarChart">
            <BarChart
                tiles = {countryDeathsData}
                selectedDataset = "deaths"
            />
        </div>

        <div class="BarChart">
            <BarChart
                tiles = {countrySectorsData}
                selectedDataset = "sectors"
                selectedCountry = {currentCountry.id}
            />
        </div>

        <div class="BarChart">
            <BarChart
                tiles = {countryFuelsData}
                selectedDataset = "fuels"
                selectedCountry = {currentCountry.id}
            />
        </div>
    {/if}

</section>

<style>

    .summary {
        margin-top: 15px;
    }

    .bigger-text {
        font-size: 200%;
    }

    .searchBar :global([data-svelte-typeahead]) {
        margin: 0rem;
        width: 450px;
        margin-top: 30px;
        z-index: 1000;
        background-color: #f9f9f9;
    }

    .searchBar :global([data-svelte-search] input:focus) {
        outline-width: 0px;
        background-color: #f9f9f9;
    }

    .searchBar :global([data-svelte-search] input) {
        width: 100%;
        padding: 0.5rem 0rem;
        background: #f9f9f9;
        font-size: 1.25rem;
        border: 0;
        border-radius: 0;
        border: 0px solid #e5e5e5;
        border-bottom-width: 2px;
        font-family: Roboto;
    }

    .searchBar :global([data-svelte-search] label) {
        margin-bottom: 0.25rem;
        display: inline-flex;
        font-size: 0.875rem;
    }
    
</style>