<script lang="ts">
  import Icon from './Icon.svelte';

</script>

<section class="infoSquare margin-breakout-mobile">

  <div class="infoSquare embed-container">
    <div class="navigation-content">
        <div class="top-section">
          <div class="arrow"/>
          <div class="title">
            State of the climate
          </div>

          <div class="text">
            <span>
              The world is in a climate emergency - 'a code red for humanity'.
              The concentration of GHG emissions in the atmosphere is wreaking havoc across the world
              threating live, cononmy, health and food.
            </span>
          </div>
        </div>
        <div class="icon">
          <Icon name="stateoftheclimate.main" />
        </div>
    </div>

    <div class="navigation-content">
      <div class="top-section">
        <div class="arrow"/>
        <div class="title">
          State of the climate
        </div>

        <div class="text">
          <span>
            The world is in a climate emergency - 'a code red for humanity'.
            The concentration of GHG emissions in the atmosphere is wreaking havoc across the world
            threating live, cononmy, health and food.
          </span>
        </div>
      </div>
      <div class="icon">
        <Icon name="stateoftheclimate.main" />
      </div>
  </div>

  </div>

</section>

<style>
  .top-section{
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .embed-container {
    box-sizing: border-box;
    padding-bottom: 20px;
    flex: 0 0 100%;
    text-align: left;
    margin-top:30px;
    flex-direction: row;
  }
  .navigation-content {
    cursor: pointer;
    position: relative;
    margin-top: 30px;
    height: 150px;
    border: 2px solid rgba(189, 189, 189, 1);
    width: 45%;
    margin-right: 10px;
    margin-left: 10px;
    display: inline-table;
    position:relative;
    transition: 0.5s border;
  }
  .navigation-content:hover {
    border: 2px solid rgba(54, 54, 54, 1);
    transition: 0.5s border;
  }



  .title {
    margin-left: 10px;
    float: left;
    color:#505050;
    font-size: 1.125rem;
  }
  .text{
    color:#505050;
    font-size: 0.9rem;
    display: inline-block;
    margin: 10px 20px 10px;
    z-index: 10;
  }

  .infoSquare {

    overflow: auto;
    max-width: 800px;
    margin-top: 20px!important;
  }
  .icon{
    overflow: hidden;
    position: absolute;
    bottom: 0px;
    width: 50%;
    max-height: 150px;
    right: 0px;
    z-index: 1;
    opacity: 0.2;
  }
  .arrow {
    float: left;
    background: currentColor;
    width:80px;
    height:15px;
    clip-path: polygon(0 10px,calc(100% - 15px) 10px,calc(100% - 15px) 0,100% 50%,calc(100% - 15px) 100%,calc(100% - 15px) calc(100% - 10px),0 calc(100% - 10px));
  }
</style>