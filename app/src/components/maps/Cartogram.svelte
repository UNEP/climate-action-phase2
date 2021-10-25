<script lang="ts" context="module">
  import type {
    CartogramConstructor, CartogramDataPoint, CountryMetadata,
    InputDataPoint, Transforms } from "./CartogramTypes";

  export interface BaseCartogramData<
    VK extends string,
    IDP extends InputDataPoint<VK> = InputDataPoint<VK>
  > {
    nodeSize: number;
    width: number;
    height: number;
    valueKey: VK;
    data: IDP[];
  }

  export interface CartogramData<
    VK extends string,
    IDP extends InputDataPoint<VK> = InputDataPoint<VK>,
    CDP extends CartogramDataPoint<VK, IDP> = CartogramDataPoint<VK, IDP>
  > extends BaseCartogramData<VK, IDP> {
    NodeClass: { new(input: CartogramConstructor<CDP>): CDP },
    NodeComponent: typeof SvelteComponent;
    hoverTextFn: Transforms<CDP>['hoverTextFn']
  }

</script>

<script lang="ts">
  import * as d3 from 'src/d3';
  import { createLookup, throttle, trailingDebounce } from 'src/util';
  import Annotation from './Annotation.svelte';
  import type { SvelteComponent } from "svelte";

  type CD = CartogramData<string, InputDataPoint<string>>;
  type CDP = CartogramDataPoint<string, InputDataPoint<string>>;

  // type VK = ExtractValueKey<CDP>;
  // type IDP = ExtractInputDataType<CDP>;

  export let dataset: CD | CD[];
  export let selectedDatasetIndex = 0;
  export let countries: CountryMetadata[];
  export let helpText: {code: string, text: string} = null;
  // export let NodeClass: { new(input: CartogramConstructor<CDP>): CDP };
  export let categoryFn: Transforms<CDP>['categoryFn'] = () => '';
  export let colorFn: Transforms<CDP>['colorFn'] = undefined;
  export let classesFn: Transforms<CDP>['classesFn'] = () => [];
  export let onHoverFn: (c: CDP) => void = () => null;
  // export const rerenderFn: () => void = () => cartogramData = cartogramData;
  export let annotationShowing: boolean = false;

  let datasets = dataset instanceof Array ? dataset : [dataset];

  let containerEl: Element;
  let loaded = false;

  const countryMetadataLookup = createLookup(countries, d => d.id, d => d);

  $: {
    if (datasets[selectedDatasetIndex] === undefined) {
      throw new Error(`Ivalid dataset index: ${selectedDatasetIndex}`);
    }
  }

  // let data: typeof dataset.data;
  // $: data = dataset.data;
  // $: nodeSize = dataset.nodeSize;
  // $: valueKey = dataset.valueKey;
  // $: domain = [dataset.width, dataset.height];
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

  let clientWidth: number;
  let containerWidth: number;
  let containerHeight: number;

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
      window.setTimeout(() => resizing = false);
    }
  }

  const throttledResize = throttle(resize, 100);
  $: clientWidth && throttledResize();

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

    const hoverTextFn = _dataset.hoverTextFn;

    return { colorFn, categoryFn, hoverTextFn, classesFn, xScale, yScale, radius };
  });

  let allCartogramData: CDP[][] = datasets.map((_dataset, i) => {
    return _dataset.data
      .map(d => new _dataset.NodeClass({
        data: d,
        valueKey: _dataset.valueKey,
        transforms: transforms[i],
        metadata: countryMetadataLookup[d.id] || { id: d.id, short: 'UNKNOWN', name: 'UNKNOWN' }
      }))
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
    class?: string
  }

  const _debouncedShowHelpText = trailingDebounce(() => helpTextFade = false, 200);

  function onMouseEnterCountry(evt: MouseEvent, country: CDP) {
    onHoverFn(country);
    helpTextFade = false;
    _debouncedShowHelpText.cancel();
    hoverData = {
      country,
      x: country.left + (country.width / 2),
      y: country.top + (country.height / 2)
    };
  }

  function onMouseClick(country: CDP) {
    onHoverFn(country);
    helpTextFade = false;
    _debouncedShowHelpText.cancel();
    hoverData = {
      country,
      x: country.left + (country.width / 2),
      y: country.top + (country.height / 2)
    };
  }

  function onMouseLeaveCountry() {
    clearHoverState();
    onHoverFn(null);
  }

  function clearHoverState() {
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
    class: 'help'
  };

  $: countryAnnotation = hoverData?.country.hoverText && {
    x: hoverData.x,
    y: hoverData.y,
    radius: 2 + hoverData.country.width / 2,
    html: hoverData.country.hoverText
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
<filter id="shadow" x="+100px">
  <feDropShadow dx="0" dy="0" stdDeviation="4" flood-opacity="0.9"></feDropShadow>
</filter>
  {#if loaded}
    <div class="countries">
      {#each selectedCartogramData as d (d.id)}
        {#if d.x && d.y}
          <div
            class="node"
            style={d.style}
            data-code={d.id}
            on:transitionend={ontransitionend}
          >
            {#each childNodes[d.id] as node}
              <svelte:component this={node.component}
                d={node.data}
                canvasWidth={targetWidth}
                canvasHeight={targetHeight}
                datasetSelected={node.datasetIndex === selectedDatasetIndex}
                {transitioning}
                on:mouseenter={(evt) => onMouseEnterCountry(evt, d)}
                on:mouseleave={() => onMouseLeaveCountry()}
                on:focus={() => onMouseClick(d)}
                on:blur={() => onMouseLeaveCountry()}
              />
            {/each}
          </div>
        {/if}
      {/each}
    </div>

  {/if}

  {#if annotation}
    <div class="annotation-container"
      class:annotation-hide={hideAnnotation} class:annotation-help={annotation.class === "help"}
    >
    <Annotation x={annotation.x} y={annotation.y} text={annotation.html}
      radius={annotation.radius} forceTopWherePossible={annotation === helpAnnotation}
      topClamp={annotation === helpAnnotation ? 0 : pxAboveScreenTop}
      canvasWidth={containerWidth} canvasHeight={containerHeight}
    />
    </div>
  {/if}

</div>

<style>

  .node {
    position: absolute;
    transition: 300ms width 50ms, 300ms height 50ms, 300ms left 50ms, 300ms top 50ms;
  }

  .cartogram {
    transform-origin: 0 0;
    height: 100%;
    width: 100%;
    display: flex;
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