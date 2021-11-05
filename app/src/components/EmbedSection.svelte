<script lang="ts">

  import Icon from './Icon.svelte';
  import type {Embeds} from '../types';

  export let content: Embeds[];


  const urlParts = window.location.href.split('/');
  const urlPath = urlParts.slice(0, -1).join('/');
  const embedScript = `${urlPath}/embed.js`;

</script>

<section class="infoSquare margin-breakout-mobile">
  <div class="kicker">
    <div class="kicker-icon"  style="">
      <Icon name="embed" />
    </div>
    <div class="kicker-text">
      EMBED OUR VISUALITZATIONS
    </div>
  </div>
  <div class="embed-container">
    {#each content as block}
    <div class="group-embed">
      <div class="embed-chart">
        <img src={"/img/embeds/" + block.embed + ".png"} class="embed-image" alt="embed">
        <div class="embed-background">
          <div class="embed-tag">
            &lt;script async src='{embedScript}' data-embed='{block.embed}'&gt;&lt/script&gt;
          </div>
        </div>
      </div>
      <div class="embed-text">
        <b>{block.title}</b>
        <br>
        {block.head}
      </div>
    </div>
    {/each}
  </div>

</section>

<style>
  .embed-tag{
    margin-top: 10px;
    margin-left: 5px;
    word-wrap: break-word;
    text-align: left;
  }
  .embed-text{
    margin-top: 20px;
    height: 150px;
  }
  .group-embed{
    width: 225px;
    margin-right: 25px;
    display: inline-table;
    position:relative;
  }
  .embed-image{
    position: absolute;
    width: 100%;
    height: 150px;
  }
  .embed-background{
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(139, 139, 139, 0.2);
    transition: .5s ease;
    text-align: center;
  }

  .embed-background:hover{
    opacity: 1;
    transition: .5s ease;
  }
  .embed-container {
    box-sizing: border-box;
    padding-bottom: 20px;
    flex: 0 0 100%;
    text-align: left;
    margin-top:30px;
    flex-direction: row;
  }
  .embed-chart {
    filter: drop-shadow(0px 0px 10px rgba(0,0,0,0.2));

    height: 150px;
    border: 2px solid rgba(189, 189, 189, 0);
  }
  .embed-chart:hover {
    filter: drop-shadow(0px 0px 10px rgba(0,0,0,0));
    border: 2px solid rgba(189, 189, 189, 1);
  }

  .kicker-icon {
    margin-right: 4px;
    position: relative;
    width: 36px;
    height: 36px;
    box-sizing: border-box;
  }
  .kicker-text {
    padding-left: 5px;
    font-size: 15px;
    font-weight: 400;
    text-transform: uppercase;
  }
  .kicker {
    position: relative;
    max-width: 1100px;
    height: 50px;
    font-size: 16px;
    display: flex;
    align-items: center;
    color: #505050;
    font-weight: 300;
    white-space: nowrap;
    margin-bottom: 5px;
  }


  .infoSquare {
    padding: 1rem 1rem;
    background-color:#E8E8E8;
    overflow: auto;
    max-width: 800px;
    margin-top: 20px;
  }

  @media (min-width: 400px) {
    .infoSquare {
      padding: 1rem 2rem;
    }
  }

  @media (min-width: 58rem) {
    .infoSquare {
      margin: 1rem 0 0;
      padding: 3.6rem;
    }
  }
</style>