<script lang="ts">
  import ScrollableX from "../common/ScrollableX.svelte";
  import Icon from "../Icon.svelte";

  const urlParts = window.location.href.split('/');
  const current = urlParts.slice().pop();

  const navs = [
    {
      text: "State of the climate",
      file: "state-of-climate.html",
      icon: "stateoftheclimate.main"
    },
    {
      text: "What's happening",
      file: "whats-happening.html",
      icon: "whatshappening.main"
    },
    {
      text: "Climate action progress",
      file: "climate-action-progress.html",
      icon: "climateactionprogress.main"
    }
  ];
</script>

<div class="section">
  <ScrollableX>
    <nav>
        <div class="subnavbuttons">
          {#each navs as nav}
            <a href={nav.file} class:selected={current === nav.file} disabled={current !== nav.file} title={nav.text}>
                <i><Icon name={nav.icon} /></i>
                {nav.text}
            </a>
          {/each}
        </div>
    </nav>
  </ScrollableX>
</div>

<style>

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
      padding: 20px 16px 4px 50px;
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
      width: 36px;
      height: 36px;
      display: block;
      position: absolute;
      left: 10px;
      bottom: 6px;
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