<script lang="ts">
  import type { SimpleCartogramDataPoint } from "src/components/maps/Cartogram.svelte";
  import Cartogram from "src/components/maps/Cartogram.svelte";
  import datasets from 'src/data';
  import Legend from "src/components/common/Legend.svelte";
  import { colorNDC, colorGHG, colorSubsidies, colorNAP } from "src/colors";
  import { displayVal } from 'src/util';
  import type { Content, TextBlock } from 'src/types';
  import ScrollableX from "./common/ScrollableX.svelte";
  import TrendsNode, { TrendsCartogramDataPoint } from "./maps/TrendsNode.svelte";
  import type { InputDataPoint } from "./maps/CartogramTypes";
  import { CartogramDataPoint } from "./maps/CartogramTypes";
  import CartogramNode from "./maps/CartogramNode.svelte";
  import CartogramHeader from "./maps/CartogramHeader.svelte";
  import { legendProps as nzLegendProps, nzDataset, nztrendsDataset } from './CartoScroller.svelte';
  import VizSection from "./common/VizSection.svelte";
  import AutoComplete from "simple-svelte-autocomplete";

  export var data : keyof Datasets;
  export var id: string;
  export var block: Content;
  export var text: TextBlock[];
  export var embed: string;
  export var isEmbed = false;

  let legendElementSelectedIndex: number = null;
  let clientWidth = 0;
  let width : number;
  let height : number;
  let cartogramAnnotation: boolean;
  let legendIsHoveredValue : string;

  let rerender: () => void;

  type NDCDataPoint<VK extends string> = InputDataPoint<VK> & {
    ndc: {
      status: string;
      description: string;
    }
  };

  type Dataset<CDP extends CartogramDataPoint<any>> = {
    cartogram: Cartogram<[CDP]>['$$prop_def'];
    legend: Omit<Legend['$$prop_def'], 'selected'>;
  };

  interface Datasets {
    ghg: Dataset<SimpleCartogramDataPoint<'emissions2018'>>,
    percapita: Dataset<SimpleCartogramDataPoint<'emissions_percapita'>>,
    trends: Dataset<TrendsCartogramDataPoint<'size'>>,
    ndc: Dataset<CartogramDataPoint<NDCDataPoint<'emissions2018'>, 'emissions2018'>>,
    ffsubsidies: Dataset<SimpleCartogramDataPoint<'subsidies_percapita'>>,
    nz: Dataset<SimpleCartogramDataPoint<'emissions2018'>>,
    nztrends: Dataset<TrendsCartogramDataPoint<'size'>>,
  }

  const ghgLabels = ['Lower', 'Stagnant', 'More than in 1990'];

  const napLabels = ['Not submitted', 'Under development', 'Submitted', 'Submitted and includes nature-based solutions', null];

  function convertToInternationalCurrencySystem (labelValue) {

    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+9

      ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(0) + " billion"
      // Six Zeroes for Millions 
      : Math.abs(Number(labelValue)) >= 1.0e+6

      ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(0) + " million"
      // Three Zeroes for Thousands
      : Math.abs(Number(labelValue)) >= 1.0e+3

      ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(0) + " thousand"

      : Math.abs(Number(labelValue));

    }
  
  
  const napPopup = (c) => {
    const yesThick = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none"><mask id="mask0_439_1423" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="28" height="28"><rect width="28" height="28" fill="#D9D9D9"/></mask><g mask="url(#mask0_439_1423)"><path d="M12.2659 16.3984L9.29529 13.428C9.16521 13.2977 9.0115 13.2326 8.83416 13.2326C8.65702 13.2326 8.49962 13.2977 8.36195 13.428C8.22448 13.5655 8.15575 13.7258 8.15575 13.909C8.15575 14.0923 8.22448 14.2528 8.36195 14.3902L11.6759 17.7109C11.8433 17.8859 12.0381 17.9734 12.2604 17.9734C12.4824 17.9734 12.6772 17.8859 12.8446 17.7109L19.7909 10.7581C19.921 10.6278 19.9879 10.4741 19.9916 10.297C19.9953 10.1196 19.9284 9.96224 19.7909 9.82477C19.6532 9.6871 19.4928 9.61827 19.3097 9.61827C19.1265 9.61827 18.9698 9.6871 18.8395 9.82477L12.2659 16.3984ZM5.76612 23.9166C5.30704 23.9166 4.91183 23.751 4.5805 23.4196C4.24916 23.0883 4.0835 22.6931 4.0835 22.234V5.76594C4.0835 5.30685 4.24916 4.91165 4.5805 4.58031C4.91183 4.24898 5.30704 4.08331 5.76612 4.08331H22.2342C22.6933 4.08331 23.0885 4.24898 23.4198 4.58031C23.7512 4.91165 23.9168 5.30685 23.9168 5.76594V22.234C23.9168 22.6931 23.7512 23.0883 23.4198 23.4196C23.0885 23.751 22.6933 23.9166 22.2342 23.9166H5.76612Z" fill="#65BF8F"/></g></svg>`;
    
    const noThick = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none"><mask id="mask0_439_1431" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="28" height="28"><rect width="28" height="28" fill="#D9D9D9"/></mask><g mask="url(#mask0_439_1431)"><path d="M14.0002 14.9219L17.7449 18.6666C17.875 18.7967 18.0286 18.8599 18.2057 18.8562C18.383 18.8525 18.5367 18.7856 18.6668 18.6553C18.7969 18.5252 18.862 18.3716 18.862 18.1944C18.862 18.0171 18.7969 17.8634 18.6668 17.7333L14.9221 14L18.6668 10.2553C18.7969 10.1252 18.862 9.97158 18.862 9.79444C18.862 9.61711 18.7969 9.4634 18.6668 9.33331C18.5367 9.20323 18.383 9.13819 18.2057 9.13819C18.0286 9.13819 17.875 9.20323 17.7449 9.33331L14.0002 13.078L10.2555 9.33331C10.1254 9.20323 9.97361 9.13819 9.80016 9.13819C9.62672 9.13819 9.47496 9.20323 9.34487 9.33331C9.21459 9.4634 9.14946 9.61711 9.14946 9.79444C9.14946 9.97158 9.21459 10.1252 9.34487 10.2553L13.0782 14L9.3335 17.7447C9.20341 17.8748 9.14022 18.0265 9.14391 18.2C9.14761 18.3734 9.21459 18.5252 9.34487 18.6553C9.47496 18.7856 9.62857 18.8507 9.80571 18.8507C9.98304 18.8507 10.1367 18.7856 10.2668 18.6553L14.0002 14.9219ZM5.76612 23.9166C5.30704 23.9166 4.91183 23.751 4.5805 23.4196C4.24916 23.0883 4.0835 22.6931 4.0835 22.234V5.76594C4.0835 5.30685 4.24916 4.91165 4.5805 4.58031C4.91183 4.24898 5.30704 4.08331 5.76612 4.08331H22.2342C22.6933 4.08331 23.0885 4.24898 23.4198 4.58031C23.7512 4.91165 23.9168 5.30685 23.9168 5.76594V22.234C23.9168 22.6931 23.7512 23.0883 23.4198 23.4196C23.0885 23.751 22.6933 23.9166 22.2342 23.9166H5.76612Z" fill="#E95838"/></g></svg>`

    let text: string = `<div style="padding: 8px"><b>${c.name}</b>`;

    if (['3', '4'].includes(c.data.status)) {
      if(c.data.cost !==  '' && c.data.cost !== 'Not stated') {
        const cost = c.data.cost.replaceAll(',', '');
        text += `<div style="line-height: 135%; font-size: 16px;"> Cost of NAP implementation: <b>US$${convertToInternationalCurrencySystem(cost)}</b>`;
      } else {
        text += `<div style="line-height: 135%; font-size: 16px;"> Cost of NAP implementation: <b>Not stated</b>`;
      }
      text += `<br /><br /> Does the NAP... </div>`;
    
      text += `<div style="display: flex; justify-content: space-between; margin-top: 12px; align-items: start;">`;
      text += `   <div style="font-size: 16px;">Identify financing sources for implementation?</div>`;
      text += `   <div style="min-width: 28px;">${c.data.financing === `y` ? yesThick : noThick}</div>`;
      text += `</div>`;

      text += `<div style="display: flex; justify-content: space-between; margin-top: 12px; align-items: start;">`;
      text += `   <div>Include a monitoring and evaluation framework?</div>`;
      text += `   <div style="min-width: 28px;">${c.data.me_framework === `y` ? yesThick : noThick}</div>`;
      text += `</div>`;

      text += `<div style="display: flex; justify-content: space-between; margin-top: 12px; align-items: start;">`;
      text += `   <div>Identify gender as a guiding principle?</div>`;
      text += `   <div style="min-width: 28px;">${c.data.gender_guiding === `y` ? yesThick : noThick}</div>`;
      text += `</div>`;

      text += `<a href="${c.data.document}" target="_blank" style="display: flex; justify-content: start; margin-top: 12px; align-items: start; border-bottom: none;">`;
      text += `   <div style="min-width: 20px; margin-right: 6px;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M9.16683 3.33334H5.3335C4.22893 3.33334 3.3335 4.22877 3.3335 5.33334V15C3.3335 15.442 3.50909 15.866 3.82165 16.1785C4.13421 16.4911 4.55814 16.6667 5.00016 16.6667H15.0002C15.4422 16.6667 15.8661 16.4911 16.1787 16.1785C16.4912 15.866 16.6668 15.442 16.6668 15V10.8333M7.50016 12.5L16.6668 3.33334M16.6668 3.33334H12.5002M16.6668 3.33334V7.50001" stroke="#1E1E1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`;
      text += `   <div style="border-bottom: dashed 1px #1E1E1E; line-height: 20px;">Link to NAP document</div>`;
      text += `</a>`;

    } else if(['1'].includes(c.data.status))  {
      text += ` has not submitted a National Adaptation Plan to UNFCCC`;
    } else if(['2'].includes(c.data.status))  {
      text += ` is in the process of developing a National Adaptation Plan`;
    } else {
      text += `<br /> Developed countries only started submitting NAPs to UNFCCC in 2023. <a href="https://napcentral.org/developedcountriesnaps" target="_blank">See here for those that are available</a>`;
    }

    text += `</div>`;

    return text;

  };

  const datasetParams: Datasets = {
    ghg: {
      cartogram: {
        dataset: [
          {
            ...datasets.cartoworld.ghg,
            NodeComponent: CartogramNode,
            NodeClass: CartogramDataPoint,
            hoverTextFn: c =>
              `<b>${c.name}</b> emitted ${displayVal(c.value, 1)} ` +
              `million tonnes of GHG in 2018`,
            colorFn: d => colorGHG(datasets.ghgCategories[d.id] || 'Unknown'),
          }
        ],
        helpText: {
          code: "CAN",
          text: "Each square represents a country, scaled by its emissions"
        },
        countries: datasets.countries,
      },
      legend: {
        title: `How much have <b>emissions changed since 1990</b>`,
        colors: colorGHG.range(),
        labels: ghgLabels,
        type: 'categorical',
      }
    },
    percapita: {
      cartogram: {
        dataset: [
          {
            ...datasets.cartoworld.percapita,
            NodeComponent: CartogramNode,
            NodeClass: CartogramDataPoint,
            hoverTextFn: c =>
              `<b>${c.name}</b> emitted ${displayVal(c.value, 1)} ` +
              `tonnes of GHG per capita in 2018`,
            colorFn: d => colorGHG(datasets.ghgCategories[d.id] || 'Unknown')
          }
        ],
        helpText: {
          code: "CAN",
          text: "Each square represents a country, scaled by its per capita emissions"
        },
        countries: datasets.countries,
      },
      legend: {
        title: `How much have <b>emissions changed since 1990</b>`,
        colors: colorGHG.range(),
        labels: ghgLabels,
        type: 'categorical',
      }
    },
    trends: {
      cartogram: {
        dataset: [{
          ...datasets.cartoworld.trends,
          NodeClass: TrendsCartogramDataPoint,
          NodeComponent: TrendsNode,
          classesFn: () => ['invert'],
          colorFn: d => colorGHG(datasets.ghgCategories[d.id]) || 'black'
        }],
        countries: datasets.countries,
        helpText: {
          code: "IRN",
          text: "Each tile represents individual country trends in GHG emissions"
        },
      },
      legend: {
        title: `How much have <b>emissions changed since 1990</b>`,
        colors: colorGHG.range(),
        labels: ghgLabels,
        type: 'categorical',
      }
    },
    nap: {
      cartogram: {
        dataset: [{
          ...datasets.cartoworld.nap,
          NodeClass: CartogramDataPoint,
          NodeComponent: CartogramNode,
          hoverTextFn: (c) => napPopup(c),
          colorFn: d => colorNAP(d.data.status)
        }],
        countries: datasets.countries,
        // helpText: {
        //   code: "IRN",
        //   text: "Each tile represents individual NAP progress by country"
        // },
      },
      legend: {
        title: `Status of NAPs`,
        colors: colorNAP.range(),
        labels: napLabels,
        type: 'categorical',
        helpText: 'Each tile represents individual NAP progress by country'
      }
    },
    ndc: {
      cartogram: {
        dataset: [{
          ...datasets.cartoworld.ndc,
          NodeClass: CartogramDataPoint,
          NodeComponent: CartogramNode,
          hoverTextFn: (c) => `<b>${c.name}</b><br>${c.data.ndc.description}`,
          colorFn: d => colorNDC(d.data.ndc.status)
        }],
        countries: datasets.countries,
        helpText: {
          code: "CAN",
          text: "Each square represents a country, scaled by its per capita emissions"
        },
      },
      isSearch: 'true',
      legend: {
        title: `Status of <b>Nationally Determined Contributions (NDCs)</b>`,
        colors: colorNDC.range(),
        labels: colorNDC.domain(),
        type: 'categorical',
      }
    },
    ffsubsidies: {
      cartogram: {
        dataset: [{
          ...datasets.cartoworld.ffsubsidies,
          NodeClass: CartogramDataPoint,
          NodeComponent: CartogramNode,
          hoverTextFn: c =>
            `<b>${c.name}</b> subsidized fossil fuels with ` +
            `<b>$${displayVal(c.data.subsidies_total_in_millions, 1)} million</b> in 2019` +
            ` — <b>$${displayVal(c.data.subsidies_percapita, 1)} per person</b>. ` +
            `That represents <b>${displayVal(c.data.subsidies_pct_gdp, 1)}% of its GDP</b>.`,
          colorFn: d => colorSubsidies(d.data.subsidies_pct_gdp),
        }],
        countries: datasets.countries,
        helpText: {
          code: "CAN",
          text: "Each square represents a country, scaled by its fossil fuel subsidies per capita"
        },
      },
      legend: {
        title: `How much <b>fossil fuel subsidies</b> represent <b>as a per cent of GDP</b>`,
        colors: colorSubsidies.range(),
        labels: colorSubsidies.domain(),
        type: 'sequential',
      }
    },
    nz: {
      cartogram: {
        dataset: [nzDataset],
        countries: datasets.countries
      },
      legend: nzLegendProps
    },
    nztrends: {
      cartogram: {
        dataset: [nztrendsDataset],
        countries: datasets.countries
      },
      legend: nzLegendProps
    }
  };

  $: legendIsHoveredValue = legendElementSelectedIndex !== null && legendElementSelectedIndex >= 0
    ? selectedDataset.legend.colors[legendElementSelectedIndex]
    : "";
  $: {
    width = Math.max(clientWidth, 700);
  }
  $: height = width * 0.62;

  $: selectedDataset = datasetParams[data];

  const dataAutoComplete = datasetParams[data].cartogram.dataset[0].data;

  let selectedColorObject;
  let selectedColorValue;

  $: {
    // console.log(selectedColorValue);
  }

  $: searchCountry = selectedColorValue ? selectedColorValue : '';

</script>

{#if datasetParams[data]}
  <VizSection {id}>
    <CartogramHeader {block} >
      <div slot="search" class="search-country">
        {#if data === "nap"}
          <AutoComplete 
            items={dataAutoComplete}
            bind:selectedItem={selectedColorObject}
            bind:value={selectedColorValue}
            labelFieldName="country"
            valueFieldName="id"
            maxItemsToShowInList=5
            placeholder="Search a country"
            lock={true}
            cleanUserText={true}
            keywordsFunction={color => color.country + ' ' + color.id}
            hideArrow={true}
          />
        {/if}
      </div>
      <div slot="legend">
        <Legend
          {...datasetParams[data].legend}
          bind:selected = {legendElementSelectedIndex}
        />
      </div>
    </CartogramHeader>

    {#if isEmbed}
      <div class="embed-additional-text-desktop" class:hide={cartogramAnnotation}>
        <p>
          To explore more about the climate emergency and
          the effects on the planet visit
          <b><a target="_blank" href="https://www.unep.org/">unep.org</a></b>
        </p>
      </div>
    {/if}

    <div class="margin-breakout-mobile" bind:clientWidth={clientWidth}>
      <ScrollableX>
        <div
          style="width:{width}px; height:{height}px"
          class="cartogram-container"
        >
          <Cartogram
            {legendIsHoveredValue}
            {searchCountry}
            {...selectedDataset.cartogram}
            bind:rerenderFn={rerender}
            bind:annotationShowing={cartogramAnnotation}
          />
        </div>
      </ScrollableX>
    </div>

    {#if !isEmbed}

      {#each text as t}
        <p class='col-text'>{@html t.p}</p>
      {/each}

    {/if}

  </VizSection>
{:else}
  <div>Missing dataset: {data}</div>
{/if}

<style lang="scss">

  .embed-additional-text-desktop {
    display: none !important; // TODO: fix this element
    opacity: 1;
    transition: 300ms opacity 700ms;
    position: relative;
    z-index: 1;
    &.hide {
      opacity: 0;
      transition: 150ms opacity;
    }
  }

  .cartogram-container {
    overflow: hidden;
  }

  .cartogram-container :global(.annotation .text) {
    background: #f9f9f9e0;
    border-radius: 4px;
    padding: 0 10px 5px;
  }

  .search-country {
    width: 100%;
    max-width: 400px;
    margin-top: -20px;
    margin-bottom: 40px;
  }

  .search-country :global(.autocomplete) {
    width: 100%;
  }

  .search-country :global(.autocomplete .input-container input) {
    border: none;
    padding: 7px 8px;
    font-size: 24px;
    font-style: normal;
    font-weight: 100;
    line-height: 30px;
    border-bottom: 2px solid #CCC;
    background: #F9F9F9;
    color: #1E1E1E;
    outline: none !important;
  }

  .search-country :global(.autocomplete .input-container .autocomplete-clear-button) {
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><mask id="mask0_339_4772" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="%23D9D9D9"/></mask><g mask="url(%23mask0_339_4772)"><path d="M12 13.0635L8.75377 16.3095C8.60893 16.4545 8.43335 16.5253 8.22702 16.522C8.02052 16.5188 7.84485 16.4448 7.70002 16.3C7.55518 16.1552 7.48277 15.9779 7.48277 15.7682C7.48277 15.5586 7.55518 15.3813 7.70002 15.2365L10.9365 12L7.69052 8.77874C7.54552 8.6339 7.47468 8.45665 7.47802 8.24699C7.48118 8.03749 7.55518 7.86032 7.70002 7.71549C7.84485 7.57049 8.0221 7.49799 8.23177 7.49799C8.44143 7.49799 8.61868 7.57049 8.76352 7.71549L12 10.9615L15.2213 7.71549C15.3661 7.57049 15.5417 7.49799 15.748 7.49799C15.9545 7.49799 16.1302 7.57049 16.275 7.71549C16.4302 7.87049 16.5078 8.05024 16.5078 8.25474C16.5078 8.45924 16.4302 8.6339 16.275 8.77874L13.0385 12L16.2845 15.2462C16.4295 15.3911 16.502 15.5667 16.502 15.773C16.502 15.9795 16.4295 16.1552 16.2845 16.3C16.1295 16.4552 15.9498 16.5327 15.7453 16.5327C15.5408 16.5327 15.3661 16.4552 15.2213 16.3L12 13.0635Z" fill="%231E1E1E"/></g></svg>') center no-repeat;
    width: 24px;
    height: 24px;
    right: 8px !important;
    margin-top: 2px;
    font-size: 0;
  }

  .search-country :global(.autocomplete .input-container input::placeholder) {
    color: #757575;
  }
  
  .search-country :global(.autocomplete-list) {
    box-shadow: 0px 4px 18.8px 0px rgba(0, 0, 0, 0.15);
    border: none !important;
    margin-top: 16px;
    padding: 0 !important;
  }

  .search-country :global(.autocomplete-list .autocomplete-list-item) {
    font-size: 20px;
    padding: 10px 8px;
    border-bottom: 1px solid #CCC;
    font-style: normal;
    font-weight: 300;
    color: #1E1E1E;
    line-height: 30px;
  }

  .search-country :global(.autocomplete-list .autocomplete-list-item-no-results) {
    padding: 10px 8px;
    font-size: 12px;
  }


  .search-country :global(.autocomplete-list .autocomplete-list-item.selected) {
    background-color: #E5E5E5;
    color: #1E1E1E;
  }

</style>
