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
      {#each options as i}
        <li class={i.a === 'pm25' ? "active" : ""}>

          <a href='#{i.a}'
            on:click={animateScroll.scrollTo({
              element: '#' + i.a,
              onStart: () => ms.dissableUpdate(),
              onDone: () => { ms.enableUpdate(); ms.tick(); }
            })}
          >
            <div class="menu-option">
              <div class="icon">{@html svg[i.icon]}</div>
              <div class="text">{i.label}</div>
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
    padding: 20px;
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
    background-color: #f1f1f1;
    border: 1px solid #555
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
    height: 40px;
    border-bottom: 1px solid #555;
  }

  .icon {
    width: 25px;
    height: 25px;
    margin-top: 7.5px;
    box-sizing: border-box;
    z-index: 2;
    float: left;
  }

  .text {
    float: left;
    margin-top: 9px;

  }

  .menu-option {
    display: block;
  }

  .active{
    color: white;
    background-color: black;
  }

  li:hover:not(.active) {
    background-color: #555;
    color: white;
  }
</style>