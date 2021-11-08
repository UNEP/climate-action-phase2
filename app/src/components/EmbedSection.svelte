<script lang="ts">
  import Icon from './Icon.svelte';
  import type {Content, Embeds} from '../types';

  export let content: Content[];
  export let id: string;

  const embedData: Embeds[] = content
    .filter(c => 'head' in c && 'title' in c && 'embed' in c)
    .map(c => ({'title':c.title, 'head':c.head, 'embed':c.embed}));

  const urlParts = window.location.href.split('/');
  const urlPath = urlParts.slice(0, -1).join('/');
  const embedScript = `${urlPath}/embed.js`;

  function selectAll(e: HTMLTextAreaElement) {
    e.setSelectionRange(0, e.value.length);
  }

</script>

<section class="infoSquare margin-breakout-mobile" id={id}>
  <div class="kicker">
    <div class="kicker-icon" style="">
      <Icon name="embed" />
    </div>
    <div class="kicker-text">
      EMBED OUR VISUALITZATIONS
    </div>
  </div>
  <div class="embed-container">
    {#each embedData as {embed, title, head}}
    <div class="group-embed">
      <div class="embed-chart">
        <img src="/img/embeds/{embed}.jpg" class="embed-image" alt="embed">
        <div class="embed-background">
          <textarea
            class="embed-tag"
            on:focus={e => selectAll(e.currentTarget)}
            readonly
            value="<script async src='{embedScript}' data-embed='{embed}'></script>"
          />
        </div>
      </div>
      <div class="embed-text">
        <b>{title}</b>
        <br>
        {head}
      </div>
    </div>
    {/each}
  </div>

</section>

<style>
  .embed-tag {
    word-wrap: break-word;
    word-break: break-all;
    text-align: left;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    outline: none;
    border: none;
    background: transparent;
    padding: 10px;
    font-size: 16px;
    font-family: 'Roboto', sans-serif;
    color: black;
    resize: none;
  }
  .embed-text {
    margin-top: 20px;
    height: 150px;
  }
  .group-embed {
    width: 225px;
    margin-right: 25px;
    display: inline-table;
    position:relative;
  }
  .embed-image {
    position: absolute;
    width: 100%;
    height: 150px;
    object-fit: contain;
  }
  .embed-background {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(139, 139, 139, 0.2);
    transition: .5s ease;
    text-align: center;
  }

  .embed-background:hover {
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
    background: #f9f9f9;
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