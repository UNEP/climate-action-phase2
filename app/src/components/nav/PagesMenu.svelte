<script lang="ts">
  import icons, { alignment } from 'src/svg';

  import Icon from '../Icon.svelte';

  let width: number;

  export let currentPage = "";


</script>

<svelte:window bind:innerWidth={width}/>
<nav class="mainnavbuttons margin-breakout-mobile">
    <button href="sotc.html">
      <div class="buttoncontent {currentPage === "sotc" ? "active" : ""}">
        <div class="icon" style={alignment[icons.climateactionprogress.main] || ''}>
          <Icon name="stateoftheclimate.main"/>
        </div>
        <div class="text-container">
          <div class="text">State of the climate</div>
        </div>
      </div>
    </button>
    <button href="whatshappening.html">
      <div class="buttoncontent {currentPage === "whatshappening" ? "active" : ""}">
        <div class="icon" style={alignment[icons.climateactionprogress.main] || ''}>
          <Icon name="whatshappening.main"/>
        </div>
        <div class="text-container">
          <div class="text">Whats happening</div>
        </div>
      </div>
    </button>
    <button href="localhost:5000/climateactionprogress.html">
      <div class="buttoncontent {currentPage === "climateactionprogress" ? "active" : ""}">
        <div class="icon" style={alignment[icons.climateactionprogress.main] || ''}>
          <Icon name="climateactionprogress.main"/>
        </div>
        <div class="text-container">
          <div class="text">Climate action progress</div>
        </div>
      </div>
    </button>
</nav>

<style>


  button {
    width: 100%;
    height: 44px;
    border: none;
    outline: none;
    padding: 0;
    border-bottom: 2px solid #DCDCDC;
    border-right: 2px solid #DCDCDC;
    border-left: 2px solid #DCDCDC;
    cursor: default;
    background-color:#f9f9f9;
    box-sizing: content-box;
  }

  .buttoncontent {
    width: 100%;
    height: 100%;
    height: 100%;
    box-sizing: border-box;
    align-items: center;
  }

  .text-container {
    padding-left: 0;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    text-align: left;
    margin-left: 10px;
    height: 100%;
  }

  .icon {
    float: left;
    width: 36px;
    height: 36px;
    margin: 4px 7px;
    z-index: 2;
  }

  button:not(.active){
    cursor: pointer;
  }
  .active .icon :global(svg *){
    stroke: #e5e5e5;
  }

  .active .text {
    color: #e0e0e0;
  }

  .active{
    background-color: #181818;
  }



  @media (hover : hover) and (pointer : fine){
    button:hover:not(.active) :global(svg *){
      stroke: #e5e5e5;
    }

    button:hover:not(.active)  .text{
      color: #e5e5e5;
    }

    button:hover:not(.active) {
      background-color: #555;
    }
  }

  .active .text-container{
    display: flex;

  }

  .active .text{
    opacity: 0;
    animation: fadeIn 300ms forwards;
    animation-delay: 150ms;
  }

  .mainnavbuttons {
    display: flex;
    float: none;
    right: 0;
    width: 100%;
    border-top: none;
    border-left: 1px solid #DCDCDC;
  }

  button {
    flex-grow: 0;
    flex-shrink: 1;
    transition: flex 500ms cubic-bezier(0.190, 1.000, 0.220, 1.000);
    border-top: 1px solid #DCDCDC;
    border-left:none;
  }

  button .buttoncontent {
    width: 100% !important;
    transition: background-color 300ms, border-color 300ms;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
</style>