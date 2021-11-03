
<script lang="ts">
  import type { MenuOption } from "src/types";

  import ScrollableX from "../common/ScrollableX.svelte";
  import Icon from "../Icon.svelte";

  export let options: MenuOption[];
  export let selected: number;
  let current = options[0];
  $: current = options[selected];
  console.log(options);
</script>
<div class="section">
  <ScrollableX>
    <nav>
        <div class="subnavbuttons">
            {#each options as option}

            <a href={option.href} class:selected={current === option} disabled={current === option} on:click={() => current = option} title={option.text}>
                <i><Icon name={option.icon} /></i>
                {option.text}
            </a>

            {/each}
        </div>
    </nav>
  </ScrollableX>
</div>

<style>
  .section{

  }
  .subnavbuttons {
      display: flex;
      position: relative;
      z-index: 1;
  }

  .subnavbuttons::-webkit-scrollbar {
      display: none;
  }

  a {
      border: 0;
      border-radius: 0;
      padding: 20px 16px 4px 40px;
      background: none;
      border-bottom: 1px solid #dcdcdc;
      margin: 0;
      display: block;
      position: relative;
      box-sizing: border-box;
      height: 49px;
      font-size: 16px;
      outline: none;
      white-space: nowrap;
      margin-bottom: 1px;
  }

  a:not(.selected):hover {
      background: #E6E6E6;
  }

  a:not(.selected) :global(svg *) {
      stroke: #999999;
  }

  a:not(:disabled) {
      cursor: pointer;
  }

  a.selected {
      font-weight: 700;
      color: #222;
  }

  .selected:before {
      content: '';
      display: block;
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 3px;
      background: #1E1E1E;
  }
  i {
      width: 22px;
      height: 22px;
      display: block;
      position: absolute;
      left: 10px;
      bottom: 8px;
  }

  i :global(svg) {
      width: 100%;
  }

  a::after {
      /* this is a hack to stop the button width
         changing when bolding the text */
      display: block;
      content: attr(title);
      font-weight: bold;
      height: 1px;
      color: transparent;
      overflow: hidden;
      visibility: hidden;
      margin-bottom: -1px;
  }
  @media (max-width: 900px) {
      a {
          height: 39px;
          padding-top: 12px;
          font-size: 14px;
      }
  }
  @media (max-width: 600px) {
    .section{
      margin: 0 -1rem;
    }
  }


</style>