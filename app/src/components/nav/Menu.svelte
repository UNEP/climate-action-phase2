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

  const hasValidOptions = options instanceof Array;


  var elm : Element;
  var ms : MenuSpy;

  onMount(() => {
    elm = document.querySelector('#main-menu');
    ms = new MenuSpy(elm);
  });
</script>

<nav class="sections-menu" role="navigation" id="main-menu">
  {#if hasValidOptions}
    <ul class='menu sections'>
      {#each options as option}
        <li class={option.a === 'pm25' ? "active" : ""}>

          <a href='#{option.a}'
            on:click={animateScroll.scrollTo({
              element: '#' + option.a,
              onStart: () => ms.dissableUpdate(),
              onDone: () => { ms.enableUpdate(); ms.tick(); }
            })}
          >
            <div class="menu-option">
              <div class="icon">{@html svg.menu[option.icon]}</div>
              <div class="text">{option.label}</div>
            </div>
          </a>

        </li>
      {/each}
    </ul>
  {:else}
    <div>Menu: Invalid options</div>
  {/if}
</nav>

<style>

  .sections-menu {
    float: left;
    position: sticky;
    margin:0;
    max-width: 10rem;
    top:0;
    left: 100%;
    z-index: 6;
    pointer-events: all;
  }

  .sections-menu ul{
    list-style-type: none;
    margin: 0;
    padding: 0;
    width: 200px;
    background-color: #f9f9f9;
    border: 2px solid #dbdbdb
  }

  li:last-child{
    border-bottom: none;
  }

  li a{
    display: block;
    height: 100%;
    border-bottom: none;
  }

  li {
    width: 100%;
    height: 45px;
    border-bottom: 2px solid #dbdbdb;
  }

  .icon {
    width: 40px;
    height: 40px;
    z-index: 2;
    float: left;
  }

  .text {
    float: left;
    padding-top: 12.5px;
    padding-left: 10px;
    color: #808080;
  }

  .menu-option {
    display: block;
  }

  .active{
    background-color: #181818;
  }

  li:hover:not(.active) :global(svg *){
    stroke: #e5e5e5;
  }

  li:hover:not(.active)  .text{
    color: #e5e5e5;
  }

  li:hover:not(.active) {
    background-color: #555;
  }

  .active .icon :global(svg *){
    stroke: #e5e5e5;
  }

  .active .text {
    color: #e5e5e5;
  }
</style>