<script type="ts">
    import type { Content, TextBlock } from "src/types";
    import CartogramHeader from "../maps/CartogramHeader.svelte";
    import VizSection from "../common/VizSection.svelte";
    import ScrollableX from "../common/ScrollableX.svelte";

    export let iframes;
    export let head;
    export var id: string;
    export var block: Content.AnnotatedImage;
</script>
<VizSection {id}>
  <CartogramHeader {block}></CartogramHeader>
  <div class="iframe-area">
    <ScrollableX>
      <div class='col-iframe'>
        {#if iframes}
          {#each iframes as i}
            <iframe frameborder="0" height="576" src="{i.src}" title={i.title} width="100%"></iframe>
          {/each}
        {/if}
      </div>
    </ScrollableX>
  </div>
</VizSection>

<style>
  .col-iframe {
    max-width: 900px;
    min-width: 800px;
  }

  @media only screen and (max-width: 900px) {
    .iframe-area {
      margin: 0 -2rem;
    }
  }
  

</style>