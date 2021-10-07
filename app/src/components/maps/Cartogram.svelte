<script lang="ts" context="module">
  import type {
    CartogramConstructor, CartogramDataPoint, CountryMetadata, ExtractInputDataType,
    ExtractValueKey, InputDataPoint, Transforms } from "./CartogramTypes";
  import CartogramNode from "./CartogramNode.svelte";

  export interface CartogramData<
    VK extends string,
    IDP extends InputDataPoint<VK> = InputDataPoint<VK>
  > {
    nodeSize: number;
    width: number;
    height: number;
    valueKey: VK;
    data: IDP[];
  }

</script>

<script lang="ts">
  import * as d3 from 'src/d3';
  import { createLookup, throttle, trailingDebounce } from 'src/util';
  import Annotation from './Annotation.svelte';
  import type { SvelteComponent } from "svelte";

  type CDP = $$Generic<CartogramDataPoint<any, any>>;

  type VK = ExtractValueKey<CDP>;
  type IDP = ExtractInputDataType<CDP>;

  export let dataset: CartogramData<VK, IDP>;
  export let countries: CountryMetadata[];
  export let helpText: {code: string, text: string} = null;
  export let NodeClass: { new(input: CartogramConstructor<CDP>): CDP };
  export let categoryFn: Transforms<CDP>['categoryFn'] = () => '';
  export let colorFn: Transforms<CDP>['colorFn'] = undefined;
  export let classesFn: Transforms<CDP>['classesFn'] = () => [];
  export let hoverTextFn: Transforms<CDP>['hoverTextFn'] = undefined;
  export let onHoverFn: (c: CDP) => void = () => null;
  export let NodeComponent: typeof SvelteComponent = CartogramNode;
  export const rerenderFn: () => void = () => cartogramData = cartogramData;
  export let annotationShowing: boolean = false;

  let containerEl: Element;
  let loaded = false;

  const countryMetadataLookup = createLookup(countries, d => d.id, d => d);

  const { data, nodeSize, valueKey } = dataset;
  const domain = [dataset.width, dataset.height];
  // used to scale to container el
  const originalWidth = domain[0];
  const originalHeight = domain[1];
  let targetWidth: number = originalWidth;
  let targetHeight: number = originalHeight;
  let resizing = false;
  let hoverTimeout: number;
  let hoverData: {x: number, y: number, country: CDP} = null;
  let helpTextFade = false;
  let annotation: AnnotationData;

  $: largestVal = Math.max(...data.map(d => d[valueKey]));

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

  $: radius = d3.scaleSqrt()
    .domain([0, largestVal])
    .range([0, nodeSize]);

  $: xScale = d3.scaleLinear()
    .domain([0, domain[0]])
    .range([0, targetWidth]);

  $: yScale = d3.scaleLinear()
    .domain([0, domain[1]])
    .range([0, targetHeight]);

  $: dimsChanged = radius && xScale && yScale;

  let cartogramData: CDP[];
  $: cartogramData = dimsChanged && data
    .map(d => new NodeClass({
      data: d,
      valueKey: dataset.valueKey,
      transforms: { colorFn, categoryFn, hoverTextFn, classesFn, xScale, yScale, radius },
      metadata: countryMetadataLookup[d.id] || { id: d.id, short: 'UNKNOWN', name: 'UNKNOWN' }
    }))
    .sort((a,b) => a.y - b.y);

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

  $: helpCountry = helpText ? cartogramData.find(d => d.id === helpText.code) : null;

  $: helpAnnotation = helpCountry && {
    x: helpCountry.left + helpCountry.width / 2,
    y: helpCountry.top + helpCountry.height / 2,
    radius: 2 + helpCountry.width / 2,
    html: helpText.text,
    class: 'help'
  };

  $: countryAnnotation = hoverTextFn && hoverData && {
    x: hoverData.x,
    y: hoverData.y,
    radius: 2 + hoverData.country.width / 2,
    html: hoverData.country.hoverText
  };

  $: haveContainerDims = containerWidth > 0 && containerHeight > 0;
  $: annotation = haveContainerDims ? (countryAnnotation || helpAnnotation) : undefined;
  $: hideAnnotation = helpTextFade || (!countryAnnotation && hoverData);

  $: annotationShowing = annotation && !hideAnnotation && annotation !== helpAnnotation;

  $: data && fadeInHelpText();

  let pxAboveScreenTop: number = 0;
  const onWindowScroll = () => {
    const top = containerEl.getBoundingClientRect().top - 50;
    pxAboveScreenTop = top < 0 ? Math.abs(top) : 0;
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
      {#each cartogramData as d (d.id)}
        {#if d.x && d.y}
          <svelte:component this={NodeComponent}
            {d}
            canvasWidth={targetWidth}
            canvasHeight={targetHeight}
            hovered={hoverData && hoverData.country === d}
            on:mouseenter={(evt) => onMouseEnterCountry(evt, d)}
            on:mouseleave={() => onMouseLeaveCountry()}
            on:focus={() => onMouseClick(d)}
            on:blur={() => onMouseLeaveCountry()}
          />
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