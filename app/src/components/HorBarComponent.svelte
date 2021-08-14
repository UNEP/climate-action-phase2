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
    import ColoredSquareDistribution from 'src/components/charts/coloredSquareDistribution.svelte';
    import fuels from 'src/data/fuels.json';
    import sectors from 'src/data/sectors.json';
    import pm25data from 'src/data/pm25.json';
    import healthData from 'src/data/health.json';

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
        }
    })

    const extract = (item) => item.name;
    const head = `Lorem <b>ipsum dolor sit amet</b>, consectetur adipiscing elit. Mauris mattis posuere faucibus.`;

    let events = [];

    $: currentCountry = {
        id: "USA",
        PM25country: 0,
        timesPM25: 0,
        totalDeaths: 0,
        deathRatio: 0
    }
 
    function updateSelectedCountry(event, detail) {
        events = [...events, { event, detail }];
        if (event === "select"){
            let newID = detail.original.id;
            currentCountry.id = newID;
            console.log(detail.original.id);
            currentCountry.PM25country = pm25data.find(c => c.id === newID).pm25;
            currentCountry.timesPM25 = parseFloat((currentCountry.PM25country/10).toFixed(1));
            currentCountry.totalDeaths = healthData.find(c => c.id === newID).deaths;
            currentCountry.deathRatio = healthData.find(c => c.id === newID).rate;
        }
    }


    $: PM25commentary = ` µg/m<sup>3</sup> <br>each person's annual mean exposure <br>—` + currentCountry.timesPM25 + ` times WHO's guideline.`;
    $: PMtimesCommentary = ` deaths per 100,000 people <br>attributable to fine particle pollution in 2017 <br>(` + currentCountry.totalDeaths + ` in total in the country).`;

</script>

<section class="viz wide">
    <h2 class='narrow'>{@html head}</h2>

    <div class="search">
        <Typeahead 
            data={countries} 
            {extract} 
            on:select={(e) => updateSelectedCountry("select", e.detail)}
            on:clear={(e) => updateSelectedCountry("clear", e.detail)}
            limit={5}
            placeholder={ `Search a country`}
            hideLabel>
        </Typeahead>

    </div>

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



</section>

<style>

    .summary {
        margin-top: 15px;
    }

    .bigger-text {
        font-size: 200%;
    }
    :global([data-svelte-typeahead]) {
        margin: 0rem;
        width: 450px;
        margin-top: 30px;
        z-index: 1000;
    }

    :global([data-svelte-search] input:focus) {
        outline-width: 0px;
        background-color: #f9f9f9;
    }

    :global([data-svelte-search] input) {
        width: 100%;
        padding: 0.5rem 0.75rem;
        background: #f9f9f9;
        font-size: 1rem;
        border: 0;
        border-radius: 0;
        border: 0px solid #e5e5e5;
        border-bottom-width: 2px;
    }

    :global([data-svelte-search] label) {
        margin-bottom: 0.25rem;
        display: inline-flex;
        font-size: 0.875rem;
    }
</style>