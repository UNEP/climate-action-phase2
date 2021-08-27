<script lang="ts">
  import IframeResizingContainer from 'src/components/IframeResizingContainer.svelte';
  import Logo from './nav/Logo.svelte';

  let width: number;
  let align = 'right';
  let textHeight: number;
  let logoWidth: number;

  $: width < 700 ? align = 'left' : align = 'right';
</script>

<IframeResizingContainer>
  <div class="container" style= "display: block" bind:clientWidth={width}>
    <div class="content">

      <slot name="legend" />

      <div class="viz-pane">
        <slot name="viz" />
      </div>

      <div style="position: absolute; bottom: {textHeight}px; margin-left: {logoWidth}px; padding-left: 20px;">
        <p style="margin: 0; padding: 0;">
          To explore more about air pollution visit
          <b><a href="https://www.unep.org/">unep.org</a></b>
        </p>
      </div>

      <div class="footer-embed wide">
        <div class="logo" bind:clientWidth={logoWidth}>
          <Logo />
        </div>

        <div class="text-unep-endorsement" bind:clientHeight={textHeight}>
          <p style="text-align: {align};">The boundaries and names shown, and the designations used on
            this map do not imply official endorsement or acceptance by the United Nations.</p>
        </div>

      </div>

    </div>
  </div>
</IframeResizingContainer>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap');

  :global(body) {
    padding: 0;
    text-align: left;
    margin: 0;
    font-family: 'Roboto', sans-serif;
    background-color: #F3F3F3;
    font-size: 24px;
  }

  .container :global(.embed-additional-text) {
    max-width: 300px;
    position: absolute;
    padding-top: 0px;
    margin-top: 0px;
    padding-bottom: 0px;
  }

  .container :global(.embed-additional-text--mobile) {
    display: none;
    position: absolute;
    bottom: 0;
    right: 0;
  }

  @media (max-width: 700px) {
    .container :global(.embed-additional-text--mobile) {
      display: block;
    }
    .container :global(.embed-additional-text--desktop) {
      display: none;
    }

    .text-unep-endorsement p{
      text-align: left;
      float: left;
      margin-top: 0;
      padding-top: 0px;
      font-size: 14px;
      line-height: 1.7;
      padding-left: 20px;
    }
  }

  .container :global(.cartogram) {
    display: flex;
    padding: 0 0 0;
    padding-bottom: 0px;
    padding-top: 0px;
    margin: 0 0 0;
    margin-bottom: 0px;
  }

  .container :global(.svg) {
    display: flex;
    padding: 0 0 0;
    padding-bottom: 0px;
    padding-top: 0px;
    margin: 0 0 0;
    margin-bottom: 0px;
  }

  .container :global(.Legend) {
    display: flex;
    position: absolute;
  }

  .container :global(.cartogram-pane) {
    padding-left: 0;
    margin: 0 0 0;
  }


  .container :global(.narrow) {
    padding-bottom: 0px;
    margin-bottom: 0px;
  }

  .footer-embed {
    display: flex;
  }

  .text-unep-endorsement p{
    font-weight: 300;
    color: dimgray;
    text-align: right;
    float: right;
    max-width: 600px;
  }

  .container {
    padding: 20px 20px 0;
    max-width: 100%;
    padding-left: 0px;
    margin: 0px 0px 0;
    margin: auto;
    overflow-x: hidden;
    position:relative;
  }

  .content {
    position: relative;
  }

  .viz-pane {
    position: relative;
    margin-left: 0%;
  }

  .logo {
    display: flex;
    align-items: flex-start;
  }

  .viz-pane :global(.scrollable) {
    overflow: hidden;
  }

  .viz-pane :global(.scrollable-content) {
    position: relative;
  }


  @media (min-width: 800px) {

    .viz-pane {
      margin-left: 0%;
    }

    .container {
      padding: 0px 12px 0;
    }
  }

  @media (max-width: 600px) {
    .container {
      padding: 20px 12px 0;
    }
  }


  @media (min-width: 1100px) {
    .content {
      margin-left:12px;
    }

    .text-unep-endorsement {
      flex-grow: 1;
    }

    .text-unep-endorsement p{
      font-weight: 300;
      color: dimgray;
      text-align: right;
      float: right;
      max-width: 600px;
    }
  }


</style>