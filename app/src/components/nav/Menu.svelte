<script lang="ts">
  interface MenuNav {
    a: string;
    label: string;
    icon: string;
  }

  import svg from 'src/svg';
  import MenuSpy from "src/components/nav/menuspy";
  import { onMount } from "svelte";
  import * as animateScroll from "svelte-scrollto";
  export let options: MenuNav[];

  import type {MenuSpyParams} from 'src/components/nav/menuspy';

  const hasValidOptions = options instanceof Array;
  var elm : Element;
  var ms : MenuSpy;
  var msParams : MenuSpyParams = {
    menuItemSelector : 'div[href^="#"]',
    activeClass: 'active',
    threshold: 600,
    enableLocationHash: false,
    hashTimeout: 0,
    callback: null
  };

  onMount(() => {
    elm = document.querySelector('#main-menu');
    ms = new MenuSpy(elm, msParams);
  });

</script>

<nav class="mainnavbuttons" id="main-menu">
  {#if hasValidOptions}
      {#each options as option}
        <button
          class={option.a === 'pm25' ? "active" : ""}
          on:click=
          {
            animateScroll.scrollTo({
              element: '#' + option.a,
              offset: -75,
              onStart: () => ms.dissableUpdate(),
              onDone: () => { ms.enableUpdate(); ms.tick(); }
            })
          }
        >

          <div class="buttoncontent" href='#{option.a}' id= "{option.a}div">
            <div class="icon">{@html svg.menu[option.icon]}</div>
            <div class="text-container">
              <div class="text">{option.label}</div>
            </div>
          </div>

        </button>
      {/each}
  {:else}
    <div>Menu: Invalid options</div>
  {/if}
</nav>


<style>

  .mainnavbuttons {
    position: sticky;
    top:0;
    left: 100%;
    z-index: 6;
    width: 200px;
    border-top: 1px solid #DCDCDC;
    float: left;
  }
  button {
    width: 100%;
    height: 50px;
    border: none;
    outline: none;
    border-bottom: 2px solid #DCDCDC;
    border-right: 2px solid #DCDCDC;
    border-left: 2px solid #DCDCDC;
    cursor: default;
  }


  .buttoncontent {
    width: 100%;
    height: 50px;
    box-sizing: border-box;
  }



  .text-container {
    padding-left: 10px;
    height: 48px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
  }

  .icon {
    float: left;
    width: 48px;
    height: 48px;
    padding: 8px;
    box-sizing: border-box;
    z-index: 2;
  }

  button:hover:not(.active) :global(svg *){
    stroke: #e5e5e5;
  }

  button:hover:not(.active)  .text{
    color: #e5e5e5;
  }

  button:hover:not(.active) {
    background-color: #555;
  }
  button:not(.active){
    cursor: pointer;
  }
  .active .icon :global(svg *){
    stroke: #e5e5e5;
  }

  .active .text {
    color: #e5e5e5;
  }

  .active{
    background-color: #181818;
  }


  @media (max-width: 1400px) {


    .text-container{
      display: none;
    }
    .active .text-container{
      display: flex;

    }

    .text{
      opacity: 0;
    }
    .active .text{
      opacity: 1;
      animation: fadeIn 1.5s forwards;
    }

    .mainnavbuttons {
        display: flex;
        float: none;
        left: 0;
        width: 100%;
        margin: 0;
        border-top: none;
        border-left: 1px solid #DCDCDC;
    }

    button {
        flex-grow: 0;
        flex-shrink: 1;
        flex-basis: 50px;
        transition: flex 1s cubic-bezier(0.190, 1.000, 0.220, 1.000);
        border-top: 1px solid #DCDCDC;
        border-left:none;
    }

    button.active {
        flex-grow: 1;
    }

    button .buttoncontent {
        width: 100% !important;
        transition: background-color 300ms, border-color 300ms;
    }
  }

  @keyframes fadeIn{
    from { opacity: 0;}
    to { opacity: 1;}
  }
</style>