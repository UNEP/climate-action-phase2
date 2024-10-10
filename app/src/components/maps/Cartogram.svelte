<script lang="ts" context="module">
  import { CartogramDataPoint } from './CartogramTypes';
  import type {
    CountryMetadata,
    ExtractVKFromIDP,
    InputDataPoint, Transforms } from "./CartogramTypes";

  export interface BaseCartogramData<
    IDP extends InputDataPoint<VK>,
    VK extends string = ExtractVKFromIDP<IDP>

  > {
    nodeSize: number;
    width: number;
    height: number;
    valueKey: VK;
    data: IDP[];
  }

  export class SimpleCartogramDataPoint<VK extends string>
    extends CartogramDataPoint<InputDataPoint<VK>, VK> {
  }

  export interface CartogramData<
    T extends CartogramDataPoint<IDP, VK>,
    IDP extends InputDataPoint<VK> = T extends CartogramDataPoint<infer IDP, infer _> ? IDP : never,
    VK extends string = ExtractVKFromIDP<IDP>
  > extends BaseCartogramData<IDP, VK> {
    NodeClass: { new(
      data: IDP,
      valueKey: VK,
      metadata: CountryMetadata,
      transforms: Transforms<T>
    ): T },
    NodeComponent: typeof SvelteComponent;
    hoverTextFn?: Transforms<T>['hoverTextFn'];
    classesFn?: Transforms<T>['classesFn'];
    colorFn?: Transforms<T>['colorFn'];
    categoryFn?: Transforms<T>['categoryFn'];
  }

</script>

<script lang="ts">
  import PewSurvey from '../PewSurvey.svelte';

  import * as d3 from 'src/d3';
  import { createLookup, throttle, trailingDebounce } from 'src/util';
  import Annotation from './Annotation.svelte';
  import type { SvelteComponent } from "svelte";

  type CDPs = $$Generic<[CartogramDataPoint<any>, ...CartogramDataPoint<any>[]]>;
  type CDP = CartogramDataPoint<any>;
  type CDs = {[P in keyof CDPs]: CartogramData<CDPs[P] & CartogramDataPoint<any>>};

  export let dataset: CDs;
  export let selectedDatasetIndex = 0;
  export let countries: CountryMetadata[];
  export let helpText: {code: string, text: string} = null;
  export const rerenderFn: () => void = () => selectedCartogramData = selectedCartogramData;
  export let annotationShowing: boolean = false;
  export let legendIsHoveredValue: string = "";
  export let searchCountry: string = "";

  // workaround as mapped tuples seem to break with generics
  type _CDs = [CartogramData<any>, ...CartogramData<any>[]];
  type CD = _CDs extends {[x: number]: infer R} ? R : never;
  let datasets: CD[] = dataset as CD[];

  let containerEl: Element;
  let loaded = false;

  const countryMetadataLookup = createLookup(countries, d => d.id, d => d);

  $: {
    if (datasets[selectedDatasetIndex] === undefined) {
      throw new Error(`Invalid dataset index: ${selectedDatasetIndex}`);
    }
  }

  // used to scale to container el
  const originalWidth = datasets[0].width;
  const originalHeight = datasets[0].height;
  let targetWidth = originalWidth;
  let targetHeight = originalHeight;
  let resizing = false;
  let hoverTimeout: number;
  let hoverData: {x: number, y: number, country: CDP} = null;
  let helpTextFade = false;
  let annotation: AnnotationData;
  let isClicked = false;
  let isClosed = false;
  let closePopup = false;

  let clientWidth: number;
  let containerWidth: number;
  let containerHeight: number;

  let transforms = datasets.map(_dataset => {

    const largestVal = Math.max(..._dataset.data.map(d => d[_dataset.valueKey]));

    const radius = d3.scaleSqrt()
      .domain([0, largestVal])
      .range([0, _dataset.nodeSize]);

    const xScale = d3.scaleLinear()
      .domain([0, _dataset.width])
      .range([0, targetWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, _dataset.height])
      .range([0, targetHeight]);

    const { hoverTextFn, classesFn, colorFn, categoryFn } = _dataset;

    return { colorFn, categoryFn, hoverTextFn, classesFn, xScale, yScale, radius };
  });

  let allCartogramData: CDP[][] = datasets.map((_dataset, i) => {
    return _dataset.data
      .map(d => new _dataset.NodeClass(
        d,
        _dataset.valueKey,
        countryMetadataLookup[d.id] || { id: d.id, short: 'UNKNOWN', name: 'UNKNOWN' },
        transforms[i]
      ))
      .sort((a,b) => a.id > b.id ? -1 : 1);
  });

  let childNodes: {[id: string]: {
    component: typeof SvelteComponent, data: CDP,
    setActive?: () => void
    setInactive?: () => void,
    datasetIndex: number,
    active: boolean
  }[] } = {};
  allCartogramData.forEach((_cartogramData, i) => {
    _cartogramData.forEach(d => {
      childNodes[d.id] = childNodes[d.id] || [];
      childNodes[d.id].push({
        component: datasets[i].NodeComponent,
        data: d,
        setActive: () => null,
        setInactive: () => null,
        active: i === selectedDatasetIndex,
        datasetIndex: i
      });
    });
  });


  function resize() {
    if (containerEl) {
      resizing = true;
      const ctrStyle = getComputedStyle(containerEl);

      const xPadding = parseFloat(ctrStyle.paddingLeft) + parseFloat(ctrStyle.paddingRight);
      const yPadding = parseFloat(ctrStyle.paddingTop) - parseFloat(ctrStyle.paddingBottom);

      containerWidth = containerEl.clientWidth - xPadding;
      containerHeight = containerEl.clientHeight - yPadding;

      const scale = Math.min(containerWidth / originalWidth, containerHeight / originalHeight);
      targetWidth = originalWidth * scale;
      targetHeight = originalHeight * scale;

      transforms.forEach(({xScale, yScale}) => {
        xScale.range([0, targetWidth]);
        yScale.range([0, targetHeight]);
      });
      allCartogramData.forEach(_dataset => {
        _dataset.forEach(d => d.clearDims());
      });
      rerenderFn();

      window.setTimeout(() => resizing = false);
    }
  }

  const throttledResize = throttle(resize, 100);
  $: clientWidth && throttledResize();

  $: selectedCartogramData = allCartogramData[selectedDatasetIndex];

  window.setTimeout(() => {
    resize();
    loaded = true;
  }, 0);

  // ANNOTATIONS....  yea it's pretty complicated... :(
  interface AnnotationData {
    x: number;
    y: number;
    radius: number;
    html: string;
    class?: string;
    id: string;
  }
  
  const _debouncedShowHelpText = trailingDebounce(() => helpTextFade = false, 200);
  let isSearch = false;
  $: {
    if (searchCountry !== "") {
      isSearch = true;
      const s = selectedCartogramData.find(d => d.id === searchCountry);
      onMouseClick(s);      
    } else {
      isSearch = false;
      isClicked = false;
      onMouseLeaveCountry();
    }
  }

  $: {
    if(closePopup) {
      isSearch = false;
      isClicked = false;
      isClosed = false;
      closePopup = false;
      searchCountry= "";
      clickedCountry = "";
      onMouseLeaveCountry();
    }
  }

  function onMouseEnterCountry(evt: MouseEvent, country: CDP) {
    isClosed = false;
    // onHoverFn(country);
    if(searchCountry == "") {      
      helpTextFade = false;
      _debouncedShowHelpText.cancel();
      hoverData = {
        country,
        x: country.left + (country.width / 2),
        y: country.top + (country.height / 2)
      };
    }
  }

  let clickedCountry = '';
  function onMouseClick(country: CDP) {
    //add isClicked status
    clickedCountry = country.id;
    isClicked = true;
    isClosed = true;

    if(isClosed === true) {
      isSearch = false;
    }
    
    // selectedCartogramData.find(d => d.name === country.name);
    hoverData = {
      country,
      x: country.left + (country.width / 2),
      y: country.top + (country.height / 2),
    };
  }

  function onMouseLeaveCountry() {
    //add isClicked status to prevent annotation/hover from being removed
    if(searchCountry === '' && isClicked === false) {
      clearHoverState();
    }
  }

  function clearHoverState() {
    // console.log("cleared!");
    hoverData = null;
    window.clearTimeout(hoverTimeout);
    hoverTimeout = null;
    fadeInHelpText();
  }

  function fadeInHelpText() {
    helpTextFade = true;
    _debouncedShowHelpText();
  }

  $: helpCountry = (helpText && selectedCartogramData)
    ? selectedCartogramData.find(d => d.id === helpText.code) : null;

  $: helpAnnotation = helpCountry && {
    x: helpCountry.left + helpCountry.width / 2,
    y: helpCountry.top + helpCountry.height / 2,
    radius: 2 + helpCountry.width / 2,
    html: helpText.text,
    id: helpCountry.id,
    class: 'help close'
  };

  $: countryAnnotation = hoverData?.country.hoverText && {
    x: hoverData.x,
    y: hoverData.y,
    radius: 2 + hoverData.country.width / 2,
    html: hoverData.country.hoverText,
    id: hoverData.country.id,
    class: 'close'
  };

  $: haveContainerDims = containerWidth > 0 && containerHeight > 0;
  $: annotation = haveContainerDims ? (countryAnnotation || helpAnnotation) : undefined;
  $: hideAnnotation = helpTextFade || (!countryAnnotation && hoverData);

  $: annotationShowing = annotation && !hideAnnotation && annotation !== helpAnnotation;


  // $: dataset.data && fadeInHelpText();

  let pxAboveScreenTop: number = 0;
  const onWindowScroll = () => {
    const top = containerEl.getBoundingClientRect().top - 50;
    pxAboveScreenTop = top < 0 ? Math.abs(top) : 0;
  };

  let transitioning = false;

  let prevSelectedDatasetIndex = selectedDatasetIndex;
  $: {
    if (selectedDatasetIndex !== prevSelectedDatasetIndex) {
      transitioning = true;
    }
    prevSelectedDatasetIndex = selectedDatasetIndex;
  }

  const ontransitionend = (evt: TransitionEvent) => {
    if (evt.currentTarget === evt.target) {
      transitioning = false;
    }
  };

</script>

<svelte:window on:scroll={onWindowScroll} />

<div class="cartogram" bind:this={containerEl}
  bind:clientWidth={clientWidth}
  class:cartogram-country-hover={hoverData}
  class:cartogram-resizing={resizing}
>
  {#if loaded}
    <div class="countries">
      {#each selectedCartogramData as d (d.id)}
        {#if d.x && d.y}
          <div
            class="node"
            class:node--fadeout={(legendIsHoveredValue !== "" && legendIsHoveredValue !== d.transforms.colorFn(d)) || (searchCountry !== "" && searchCountry !== d.id) || (isClicked && clickedCountry !== d.id) }
            style={d.style}
            data-code={d.id}
            data-country={searchCountry}
            on:transitionend={ontransitionend}
          >
            {#each childNodes[d.id] as node}
              <svelte:component this={node.component}
                d={node.data}
                isClosed={isClosed}
                canvasWidth={targetWidth}
                canvasHeight={targetHeight}
                datasetSelected={node.datasetIndex === selectedDatasetIndex}
                {transitioning}
                clearHoverState()
                on:mouseenter={(evt) => onMouseEnterCountry(evt, d)}
                on:mouseleave={() => onMouseLeaveCountry()}
                on:focus={() => onMouseClick(d)}
                on:click={() => onMouseClick(d)}
                on:blur={() => onMouseLeaveCountry()
                }
              />
            {/each}
          </div>
        {/if}
      {/each}
    </div>

  {/if}

  {#if annotation}
    <div class="annotation-container" class:is-search={isSearch} class:is-clicked={isClicked}
      class:annotation-hide={hideAnnotation} class:annotation-help={annotation.class === "help"} class:is-closed={isClosed}
    >
    <Annotation id={annotation.id} x={annotation.x} y={annotation.y} text={annotation.html}
      radius={annotation.radius} forceTopWherePossible={annotation === helpAnnotation}
      topClamp={annotation === helpAnnotation ? 0 : pxAboveScreenTop}
      canvasWidth={containerWidth} canvasHeight={containerHeight} isSearch={isSearch} bind:closePopup isClicked={isClicked} isClosed={isClosed}
    />
    </div>
  {/if}

</div>

<style lang="scss">

  .annotation-container {
    display: contents;
    z-index: 111111111111111;
    position: relative;
  }
  
  .node {
    position: absolute;
    transition: 200ms width 50ms, 200ms height 50ms, 200ms left 50ms, 200ms top 50ms, opacity 500ms;

    &.node--fadeout {
      opacity: 0.2;
    }
  }

  .node:hover {
    box-shadow: 0px 0px 7.7px 0px rgba(31, 31, 31, 0.62);
  }

  .cartogram {
    transform-origin: 0 0;
    height: 100%;
    width: 100%;
    display: flex;
    max-width: 957px; 
    position: relative;
  }

  .countries {
    flex: 0 0 100%;
    transform: rotateY(0.001deg);
  }

  .annotation-container {
    opacity: 1;
    pointer-events: none;
  }

  .annotation-container.is-search {
    pointer-events: unset;
  }

  .annotation-container.is-clicked {
    pointer-events: unset;
  }

  .annotation-help {
    transition: opacity 500ms;
  }

  .annotation-hide {
    opacity: 0;
    transition: opacity 0s;
  }

  .annotation-container :global(.line) {
    border-color :#bbbbbb !important;
  }
</style>