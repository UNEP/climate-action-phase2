<script lang="ts">
  import { clamp } from "src/util";

  export let id;
  export let closePopup;
  export var canvasWidth: number;
  export var canvasHeight: number;
  export var x: number;
  export var y: number;
  export var text: string;
  export var radius: number | {x: number, y: number};
  export var forceTopWherePossible: boolean = false;
  export var justText: boolean = false;
  export var isSearch: boolean = false;
  export var isClicked: boolean = true;
  export var topClamp: number = 0;
  export var isClosed: boolean = false;

  const noDims = !(canvasHeight > 0) || !(canvasWidth > 0);
  if (noDims) throw new Error('Annotation created with no canvas dims');

  var textEl: HTMLElement;
  var el: HTMLElement;
  var pos: string;
  var textShiftX: number;
  var textShiftY: number;

  const textWidth = 250;

  interface StyleCss {
      left?: number;
      top?: number;
      bottom?: number;
      right?: number;
      width?: number;
      height?: number;
      transform?: string;
  }

  $: limitedCanvasHeight = canvasHeight - topClamp;
  const perc = (a,b) => 100 * (a / b);
  const topPaddingPx = 5;
  const leftPaddingPx = 5;

  $: leftPadding = perc(leftPaddingPx, canvasWidth);
  $: topClampPerc = perc(topClamp, canvasHeight);
  $: xPerc = perc(x, canvasWidth);
  $: yPerc = perc(y - topClamp, limitedCanvasHeight);
  $: radiusX = perc(typeof radius === 'number' ? radius : radius.x, canvasWidth);
  $: radiusY = perc(typeof radius === 'number' ? radius : radius.y, limitedCanvasHeight);
  $: topMin = perc(topPaddingPx, limitedCanvasHeight);
  $: textWidthPerc = canvasWidth && perc(textWidth, canvasHeight);

  $: {
    if (forceTopWherePossible) {
      if (yPerc < 15) {
        pos = xPerc > 50 ? 'left' : 'right';
      } else {
        pos = 'above';
      }
    }
    else {
      if (yPerc < 5) {
        pos = 'below';
      }
      else if (xPerc > 65 || xPerc < 35) {
        pos = xPerc > 50 ? 'left' : 'right';
      } else {
        pos = yPerc < 20 ? 'below' : 'above';
      }
    }
  }

  $: {
    textShiftX = null;
    textShiftY = null;
    if (pos === 'left') {
      style = {
        right: 100 - (xPerc - radiusX),
        top: yPerc,
      };

    }
    else if (pos === 'right') {
      style = {
        left: xPerc + radiusX,
        top: yPerc,
      };
    }
    else if (pos === 'above') {
      style = {
        left: xPerc,
        top: forceTopWherePossible ? topMin : Math.max(topMin, yPerc - radiusY - 40),
        bottom: 100 - (yPerc - radiusY)
      };

    }
    else if (pos === 'below') {
      style = {
        left: xPerc,
        top: yPerc + radiusY,
        bottom: Math.max(0, 100 - yPerc - 50)
      };
    }

    if (pos === 'left' || pos === 'right') {
      if (yPerc < 10) {
        textShiftY = 0;
      }
      else if (yPerc > 90) {
        textShiftY = -100;
      }
      else {
        textShiftY = -50;
      }
    }
    else if (pos === 'above' || pos === 'below') {
      const _textShiftX = clamp(
        -(textWidthPerc / 3),
        -xPerc + leftPadding,
        (100 - xPerc) - textWidthPerc
      );
      textShiftX = 100 * _textShiftX / textWidthPerc;
    }
  }

  var style: StyleCss;

  function calcStyle(style: StyleCss) {
    const dimProps = ['left', 'top', 'bottom', 'right', 'width', 'height'];

    const dimStr = dimProps
      .filter(prop => style[prop] !== undefined)
      .map(prop => `${prop}: ${style[prop]}%; `)
      .join('');

    const transformStr = `transform: ${style.transform};`;
    return dimStr + transformStr;
  }


  $: styleStr = style ? calcStyle(style) : '';
  var textStyleStr: string;
  $: {
    const translateX = textShiftX !== null ? `translateX(${textShiftX}%)` : '';
    const translateY = textShiftY !== null ? `translateY(${textShiftY}%)` : '';
    textStyleStr = (translateX || translateY) ? `transform: ${translateX} ${translateY};` : '';
  }

</script>

<div class="annotation-container" class:is-search={isSearch} class:is-clicked={isClicked}>
  {#if !justText}
    <div class="canvas-limiter" style="top: {topClampPerc}%; height: {perc(limitedCanvasHeight, canvasHeight)}%">
      <div class="annotation annotation--{pos}" data-id={id} style={styleStr}
          bind:this={el}>
          <div class="line line-before"></div>
          <div class="text" style={textStyleStr} bind:this={textEl}>
              {@html text}
              {#if (isClosed && !isSearch)}
              <div class="close" on:click={() => closePopup = true}>
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <path d="M13.0007 14.1795L17.31 18.4892C17.4707 18.6498 17.6651 18.7323 17.8933 18.7365C18.1215 18.7407 18.3203 18.6583 18.4897 18.4892C18.6588 18.3198 18.7433 18.1232 18.7433 17.8992C18.7433 17.6754 18.6588 17.4788 18.4897 17.3095L14.18 13.0002L18.4897 8.69083C18.6503 8.53016 18.7328 8.33572 18.737 8.1075C18.7412 7.87927 18.6588 7.6805 18.4897 7.51116C18.3203 7.34205 18.1237 7.2575 17.8997 7.2575C17.6759 7.2575 17.4793 7.34205 17.31 7.51116L13.0007 11.8208L8.69132 7.51116C8.53065 7.3505 8.33621 7.26805 8.10799 7.26383C7.87976 7.25961 7.68098 7.34205 7.51165 7.51116C7.34254 7.6805 7.25799 7.87716 7.25799 8.10116C7.25799 8.32494 7.34254 8.5215 7.51165 8.69083L11.8213 13.0002L7.51165 17.3095C7.35098 17.4702 7.26854 17.6646 7.26432 17.8928C7.2601 18.1211 7.34254 18.3198 7.51165 18.4892C7.68098 18.6583 7.87765 18.7428 8.10165 18.7428C8.32543 18.7428 8.52198 18.6583 8.69132 18.4892L13.0007 14.1795ZM13.003 25.6668C11.2601 25.6668 9.61932 25.3344 8.08065 24.6695C6.54198 24.0046 5.19876 23.0986 4.05098 21.9515C2.90343 20.8042 1.99698 19.4615 1.33165 17.9235C0.66654 16.3855 0.333984 14.7452 0.333984 13.0025C0.333984 11.2505 0.666429 9.60372 1.33132 8.06216C1.99621 6.52061 2.90221 5.17972 4.04932 4.0395C5.19665 2.89927 6.53932 1.9965 8.07732 1.33116C9.61532 0.666051 11.2557 0.333496 12.9983 0.333496C14.7503 0.333496 16.3971 0.66594 17.9387 1.33083C19.4802 1.99572 20.8211 2.89805 21.9613 4.03783C23.1015 5.17761 24.0043 6.51794 24.6697 8.05883C25.3348 9.59972 25.6673 11.2461 25.6673 12.9978C25.6673 14.7407 25.3349 16.3815 24.67 17.9202C24.0051 19.4588 23.1028 20.8021 21.963 21.9498C20.8232 23.0974 19.4829 24.0038 17.942 24.6692C16.4011 25.3343 14.7548 25.6668 13.003 25.6668Z" fill="#1C1B1F"/>
                </svg>
              </div>
              {/if}
          </div>
          <div class="line line-after"></div>
      </div>
    </div>
  {:else}
    <div class="just-text"
        bind:this={el}>
        <div class="text" style="transform: translate({x}px, {y}px);" bind:this={textEl}>
            {@html text}
        </div>
    </div>
  {/if}
</div>
<style>
  .close {
    position: absolute;
    top: -5px;
    right: -5px;
  }

  .annotation-container {
    display: contents;
    z-index: 111111111111111;
    position: relative;
  }
  .canvas-limiter {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    pointer-events: none;
  }

  .just-text{
    position: absolute;
    pointer-events: none;
    height: auto !important;
    width: 0;
  }
  
  .text .list {
    display: flex;
    justify-content: space-between;
  }

  .annotation {
    display: flex;
    position: absolute;
    z-index: 11111;
    pointer-events: none;
    height: auto !important;
    width: 0;
  }

  .text {
    flex: 0 0;
  }

  .prerender {
    visibility: hidden;
  }

  .line {
    flex: 1 1;
  }

  .annotation--right .line,
  .annotation--left .line {
    border-top: 1px solid #bbbbbb;
    height: 0;
  }
  .annotation--above .line,
  .annotation--below .line {
    border-left: 1px solid #bbbbbb;
    width: 0;
  }

  .annotation--left,
  .annotation--right {
    flex-direction: row;
    width: calc(250px + 5%);
  }

  .annotation--left .text,
  .annotation--right .text {
    flex: 0 0 250px;
  }

  .annotation--above,
  .annotation--below {
    flex-direction: column;
    height: 200px;
  }

  .annotation--above .line-before,
  .annotation--below .line-after,
  .annotation--left .line-before,
  .annotation--right .line-after {
    display: none;
  }

  .text {
    box-shadow: 0px 4px 18.8px 0px rgba(0, 0, 0, 0.15);
    width: 250px;
    z-index: 5;
    pointer-events: none;
  }

  .annotation[data-id="HTI"] .text,
  .annotation[data-id="GTM"] .text {
    margin-top: 20px;
  }

  .annotation[data-id="TON"] .text,
  .annotation[data-id="FJI"] .text {
    margin-top: -60px;
  }

  .is-search .canvas-limiter,
  .is-search .canvas-limiter .annotation,
  .is-search .canvas-limiter .annotation .text {
    pointer-events: unset;
  }

  .is-clicked .canvas-limiter,
  .is-clicked .canvas-limiter .annotation,
  .is-clicked .canvas-limiter .annotation .text {
    pointer-events: unset;
  }

  .is-clicked .canvas-limiter {
    /* background: rgba(255, 255, 255, .8); */
  }

</style>
  