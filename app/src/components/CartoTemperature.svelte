<script lang="ts">
  import type { MediaAnnotation } from "./maps/AnnotatedMedia.svelte";
  import type { Content, TextBlock } from 'src/types';
  import { annotations } from '../data';
  import svg from '../svg';
  import ScrollableX from "./common/ScrollableX.svelte";
  import AnnotatedMedia from "./maps/AnnotatedMedia.svelte";
  import CartogramHeader from "./maps/CartogramHeader.svelte";

  type InputAnnotation = typeof annotations.surface[0];
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
  export var block: Content.AnnotatedImage;
  export var id: string;
  export var text: TextBlock[];

  let selectedSectionStr: string = block.title;

  const sections: {[section: string]: {annotations: MediaAnnotation[]}} = {
    "Land temperature": {
      annotations: annotations.surface.map(mapAnnotation).filter(a => a)
        // quick hack to transform old coords to new coords (bigger image)
        .map(a => ({...a, x: a.x * (2400 / 828), y: a.y * (1217 / 420) }))
    },
    "Ocean temperature": {
      annotations: annotations.ocean.map(mapAnnotation).filter(a => a)
        // quick hack to transform old coords to new coords (bigger image)
        .map(a => ({...a, x: a.x * (2400 / 828), y: a.y * (1217 / 420) }))
    },
    "Fires": {
      annotations: annotations.fire.map(mapAnnotation).filter(a => a)
        // quick hack to transform old coords to new coords (bigger image)
        .map(a => ({...a, x: a.x * (1200 / 828), y: a.y * (608 / 420) }))
    }
  };
  $: selectedSection = sections[selectedSectionStr];
  var selectedAnnotation: MediaAnnotation;
  function onChangeAnnotation(a: MediaAnnotation) {
    selectedAnnotation = a;
  }

</script>

<section {id} class="viz wide">

  <CartogramHeader {block}>
    <div slot="legend">
      {#if selectedSectionStr === "Land temperature"}
        <div class="legend">
          <p class="legend-text">Colder</p>
          <div class="legend-scale">{@html svg.legends.land}</div>
          <p class="legend-text"><span>Warmer than the</span> <span>avg. for the 2000s</span></p>
        </div>
      {:else if selectedSectionStr === "Ocean temperature"}
        <div class="legend">
          <p class="legend-text">Cold</p>
          <div class="legend-scale">{@html svg.legends.sea}</div>
          <p class="legend-text">Warm</p>
        </div>
      {/if}
    </div>
  </CartogramHeader>

  <div class="margin-breakout-mobile">
    <ScrollableX>
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
    </ScrollableX>
  </div>

  {#if !isEmbed}

    {#each text as t}
      <p class='col-text'>{@html t.p}</p>
    {/each}

  {/if}

</section>
<style lang="scss">
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
    div {
      grid-column: 1;
      grid-row: 1;
      visibility: hidden;
      &.visible {
        visibility: visible;
      }
    }
  }

  .legend {
    display: flex;
    align-items: center;
    column-gap: 5px;
    flex: 0;
    padding-left: 10px;
    min-width: 380px;
  }
  .legend-scale {
    max-width: 270px;
    min-width: 200px;
    flex: 1;
    font-size: 0;
    > :global(svg) {
      width: 100%;
    }
  }
  .legend-text {
    font-size: 14px;
    line-height: 1.3;
    margin: 0;
    padding: 0;
    > span {
      display: inline-block;
    }
  }

  @media (max-width: 600px) {
    .container :global(.aimg .annotation) {
      display: none;
    }
    .legend-text {
      display: none;
    }
    .legend {
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