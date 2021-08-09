<script lang="ts" context="module" >
  export interface CountryDataPoint  {
    name: string;
    short: string;
    code: string;
    x: number;
    y: number;
    value: number;
    rate: number
  }
</script>

<script lang="ts">
  import * as d3 from 'src/d3';
  import { throttle, trailingDebounce } from 'src/util';
  import Annotation from './Annotation.svelte';

  interface CartogramDataPoint extends CountryDataPoint {
    category: string;
    left: number;
    top: number;
    width: number;
    height: number;
  }

  export var data: CountryDataPoint[];
  export var nodeSize = 100;
  export var domain: [number, number];
  export var helpText: {code: string, text: string} = null;
  export var categoryFn: (code: CountryDataPoint) => string;
  export var colorFn: (code: CountryDataPoint) => string;
  export var hoverTextFn: (country: CountryDataPoint) => string;
  export var onHoverFn: (country: CountryDataPoint) => void = c => null;
  export var hideLabels = false;

  var containerEl: Element;
  let loaded = false;

  // used to scale to container el
  const originalWidth = domain[0];
  const originalHeight = domain[1];
  var targetWidth: number = originalWidth;
  var targetHeight: number = originalHeight;
  var resizing = false;
  var hoverTimeout: number;
  let hoverData: {x: number, y: number, country: CartogramDataPoint} = null;
  var helpTextFade = false;
  var annotation: AnnotationData;
  var hoveredForX = false;

  $: largestVal = Math.max(...data.map(d => d.value));

  $: radius = d3.scaleSqrt()
  .domain([0, largestVal])
  .range([0, nodeSize]);

  $: xScale = d3.scaleLinear()
  .domain([0, domain[0]])
  .range([0, targetWidth]);

  $: yScale = d3.scaleLinear()
  .domain([0, domain[1]])
  .range([0, targetHeight]);

  var cartogramData: CartogramDataPoint[];
  $: cartogramData = data.map(d => {
    const r = radius(d.value);
    return {
      ...d,

      category: categoryFn(d),
      left: xScale(d.x - r),
      top: yScale(d.y- r),

      // width height should be the same if the aspect is correct
      width: xScale(r * 2),
      height: yScale(r * 2),
    };
  });


  function calcStyle(d: CartogramDataPoint) {
    const styles = [
    `left: ${d.left}px`,
    `top: ${d.top}px`,
    `width: ${d.width}px`,
    `height: ${d.height}px`,
    `background-color: ${colorFn(d)};`
    ];
    return styles.join(';');
  }

  var containerWidth: number;
  var containerHeight: number;
  function resize() {
    if (containerEl) {
      resizing = true;
      const containerStyle = getComputedStyle(containerEl);
      containerWidth = containerEl.clientWidth - parseFloat(containerStyle.paddingLeft) - parseFloat(containerStyle.paddingRight);
      containerHeight = containerEl.clientHeight - parseFloat(containerStyle.paddingTop) - parseFloat(containerStyle.paddingBottom);
      const scale = Math.min(containerWidth / originalWidth, containerHeight / originalHeight);
      targetWidth = originalWidth * scale;
      targetHeight = originalHeight * scale;
      window.setTimeout(() => resizing = false);
    }
  }

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

  function onMouseEnterCountry(evt: MouseEvent, country: CartogramDataPoint) {
    onHoverFn(country);
    helpTextFade = false;
    _debouncedShowHelpText.cancel();
    hoverData = {
      country,
      x: country.left + (country.width / 2),
      y: country.top + (country.height / 2)
    };
    hoverTimeout = window.setTimeout(() => hoveredForX = true, 350);
  }

  function onMouseLeaveCountry() {
    clearHoverState();
    onHoverFn(null);
  }

  function clearHoverState() {
    hoverData = null;
    hoveredForX = false;
    window.clearTimeout(hoverTimeout);
    hoverTimeout = null;
    fadeInHelpText();
  }

  function fadeInHelpText() {
    helpTextFade = true;
    _debouncedShowHelpText();
  }

  $: helpCountry = helpText ? cartogramData.find(d => d.code === helpText.code) : null;

  $: helpAnnotation = helpCountry && {
    x: helpCountry.left + helpCountry.width/2,
    y: helpCountry.top + helpCountry.height/2,
    radius: 2 + helpCountry.width / 2,
    html: helpText.text,
    class: 'help'
  };

  $: countryAnnotation = hoverTextFn && hoverData && {
    x: hoverData.x,
    y: hoverData.y,
    radius: 2 + hoverData.country.width / 2,
    html: hoverTextFn(hoverData.country)
  };

  $: annotation = countryAnnotation || helpAnnotation;

  $: hideAnnotation = helpTextFade || (!countryAnnotation && hoverData);

  $: data && fadeInHelpText();

</script>

<svelte:window on:resize={throttle(resize, 50)} />

<div class="cartogram" bind:this={containerEl}
  class:cartogram-country-hover={hoverData}
  class:cartogram-resizing={resizing}
  on:touchstart={clearHoverState}
>
  {#if loaded}
    <div class="countries">
      {#each cartogramData as d (d.code)}
        {#if d.x && d.y}
          <div class="country bg--{d.category}"
            style={calcStyle(d)}
            data-code={d.code}
            on:mouseenter={(evt) => onMouseEnterCountry(evt, d)}
            on:mouseleave={() => onMouseLeaveCountry()}
          >
            {#if !hideLabels && d.width > 50}
              <span class="country-text">{d.short}</span>
            {/if}
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
      radius={annotation.radius} forceTopWherePossible
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

  .label {
    font-size: 14px;
  }

  .countries {
    flex: 0 0 100%;
    transform: rotateY(0.001deg);
  }

  .country {
    position: absolute;
    border-radius: 4px;
    cursor: pointer;
    opacity: 1;
    z-index: 2;
    transition: top 0.2s, left 0.2s, width 0.2s, height 0.2s, background-color 0.2s, opacity 0.45s ease 0.15s;
    will-change: opacity, background-color, border-radius;
    background: grey;
  }

  .cartogram-resizing .country {
    transition: none;
  }

  .country-text {
    color: white;
    font-weight: 500;
    font-size: 14px;
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    width: min(100%, 50px);
    margin: auto;
    transform: translateY(-50%);
    text-align: center;
  }

  .cartogram-country-hover .country:not(:hover) {
    opacity: 0.65;
    transition: opacity 0.05s;
  }

  .cartogram-country-hover .country:hover {
    opacity: 0.999;
    transition: opacity 0s;
    z-index: 3;
  }
  .hover-chart {
    position: absolute;
    width: 200px;
    box-sizing: border-box;
    pointer-events: none !important;
    cursor: none;
    background: #EAEAEA;
    padding: 5px;
    box-shadow: 0px 0px 0px 0px #00000018;
    visibility: hidden;
    border: 1px solid #E7E7E7;
    transform: translate(-50%, -50%) scale(0.3);
    transform-origin: 50% 50%;
    z-index: 3;
  }

  .hover-chart--show {
    visibility: visible;
    box-shadow: 0px 0px 15px 0px #00000018;
    transition: box-shadow 100ms, transform 20ms ease-in;
    transform: translate(-50%, -50%) scale(1);
  }

  .hover-chart :global(svg) {
    width: 100%;
  }

  .help {
    opacity: 0;
  }

  .help-show {
    opacity: 1;
    transition: opacity 200ms;
  }

  .help-text {
    position: absolute;
    font-size: 14px;
    line-height: 20px;
    width: 180px;
    padding-bottom: 5px;
    z-index: 2;
  }

  .help-line {
    position: absolute;
    z-index: 1;
    border-left: 1px solid #dfdfdf;
  }

  .annotation-container {
    opacity: 1;
    pointer-events: none;
  }
  .annotation-help :global(.text) {
    font-size: 14px !important;
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