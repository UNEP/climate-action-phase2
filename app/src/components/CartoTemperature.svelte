<script lang="ts">
  import type { MediaAnnotation } from "./maps/AnnotatedMedia.svelte";
  import type { copy as Copy } from '../data';
  import type { Content, TextBlock } from 'src/types';
  import { copy } from '../data';
  import svg from '../svg';
  import ScrollableX from "./common/ScrollableX.svelte";
  import EmbedFooter from "./EmbedFooter.svelte";
  import SectionTitle from "src/components/SectionTitle.svelte";
  import AnnotatedMedia from "./maps/AnnotatedMedia.svelte";

  type InputAnnotation = typeof Copy.happening.surface.annotation[0];
  function mapAnnotation(input: InputAnnotation): MediaAnnotation {
    const coords = (input.coords || '').split(',');
    if (!input.text || coords.length !== 2) return null;
    return {
      text: input.text,
      x: parseInt(coords[0]), y: parseInt(coords[1])
    };
  }


  export var isEmbed = false;
  export var embed: string;
  export var block: Content;
  export var id: string;
  export var text: TextBlock[];

  let selectedSectionStr: string = block.title;
  let width : number;
  let clientWidth = 0;

  const sections:
  {[section: string]: {annotations: MediaAnnotation[]}} = {
    "Land temperature": {
      annotations: copy.happening.surface.annotation.map(mapAnnotation).filter(a => a)
    },
    "Ocean temperature": {
      annotations: copy.happening.ocean.annotation.map(mapAnnotation).filter(a => a)
    },
    "Fires": {
      annotations: copy.happening.fire.annotation.map(mapAnnotation).filter(a => a)
    }
  };
  $: selectedSection = sections[selectedSectionStr];
  var selectedAnnotation: MediaAnnotation;
  function onChangeAnnotation(a: MediaAnnotation) {
    selectedAnnotation = a;
  }

  $: {
    width = Math.max(clientWidth, 700);
  }
  $: height = width * 0.62;
</script>

<section {id} class="viz wide">

  {#if !isEmbed}
      <SectionTitle {block} />
  {/if}

  <h2 class='narrow'>{@html block.head}</h2>

  <div class="right-narrow" >
    {#if selectedSectionStr === "Land temperature"}
    <div class="legend">
        <p class="legend-text">Colder</p>
        <div class="legend-scale">{@html svg.legends.land}</div>
        <p class="legend-text">Warmer than the avg. for the 2000s</p>
    </div>
    {:else if selectedSectionStr === "Ocean temperature"}
    <div class="legend">
        <p class="legend-text">Cold</p>
        <div class="legend-scale">{@html svg.legends.sea}</div>
        <p class="legend-text">Warm</p>
    </div>
    {/if}
  </div>


  <div class="margin-breakout-mobile" bind:clientWidth={clientWidth}>
    <ScrollableX>
      <div
        style="width:{width}px; height:{height}px"
        class="cartogram-container"
      >
        <div class="container">
          <div class="title {selectedSectionStr === 'Ocean temperature' ? 'white' : ''}">
              {@html block.imgtitle}
          </div>
          <div class="aimg-container">
              <AnnotatedMedia src={block.src} alt={block.alt} video={block.src === 'fire.mp4'}
                  annotations={selectedSection.annotations} onChangeAnnotation={onChangeAnnotation}
              />
          </div>

          <div class="inline-annotation">
              {#each selectedSection.annotations as annotation}
              <div class:visible={selectedAnnotation === annotation}>{annotation.text}</div>
              {/each}
          </div>
        </div>
      </div>
    </ScrollableX>
  </div>

  {#if !isEmbed}

      <div class="footer">
        <EmbedFooter {embed} />
      </div>

      {#each text as t}
        <p class='col-text'>{@html t.p}</p>
      {/each}

  {/if}

</section>
<style>
  .container {
      width: 100%;
  }
  .title {
      font-size: 14px;
      padding-left: 12px;
      margin: 10px 0 12px 0;
  }
  .aimg-container {
      flex: 1;
      position: relative;
      overflow: hidden;
  }
  .inline-annotation {
      font-size: 14px;
      line-height: 1.5;
      padding: 0 10px;
      margin-top: 10px;
      display: grid;
  }
  .inline-annotation div {
      grid-column: 1;
      grid-row: 1;
      visibility: hidden;
  }
  .inline-annotation div.visible {
      visibility: visible;
  }
  .legend {
      display: inline-block;
      margin: auto;
      margin-top: 8px;
      flex: 0;
      padding-left: 10px;
      white-space: nowrap;
  }
  .legend-scale {
      max-width: 270px;
      display: inline-block;
  }
  .legend-scale > :global(svg) {
      width: 100%;
  }
  .legend-text {
      display: inline-block;
      font-size: 14px;
      vertical-align: middle;
      margin-bottom: 18px;
  }
  @media (max-width: 600px) {
      .container :global(.aimg .annotation) {
          display: none;
      }
      .legend-text {
          display: none;
      }
      .legend {
          position: absolute;
          top: 25px;
      }
      .aimg-container {
          margin-top: 45px;
      }
  }
  @media (min-width: 600px) {
      .inline-annotation {
          display: none;
      }
  }
  @media (min-width: 600px) {
      .title {
          position: absolute;
          top:35%;
          left:2rem;
          max-width: 120px;
          font-size: 14px;
          line-height: 1.3;
          color:#808080;
          z-index: 5;
      }
      .white {
          color:#FFF;
      }
  }
</style>