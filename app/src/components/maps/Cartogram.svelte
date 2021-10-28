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
    class?: string
  }

  const _debouncedShowHelpText = trailingDebounce(() => helpTextFade = false, 200);

  function onMouseEnterCountry(evt: MouseEvent, country: CDP) {
    // onHoverFn(country);
    helpTextFade = false;
    _debouncedShowHelpText.cancel();
    hoverData = {
      country,
      x: country.left + (country.width / 2),
      y: country.top + (country.height / 2)
    };
  }

  function onMouseClick(country: CDP) {
    // onHoverFn(country);
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
    // onHoverFn(null);
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
  {#if loaded}
    <div class="countries">
      {#each selectedCartogramData as d (d.id)}
        {#if d.x && d.y}
          <div
            class="node"
            class:node--fadeout={legendIsHoveredValue !== "" && legendIsHoveredValue !== d.transforms.colorFn(d)}
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

<style lang="scss">

  .node {
    position: absolute;
    transition: 200ms width 50ms, 200ms height 50ms, 200ms left 50ms, 200ms top 50ms, opacity 400ms;

    &.node--fadeout {
      opacity: 0.2;
    }
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