<script lang="ts">
  import IframeResizingContainer from 'src/components/IframeResizingContainer.svelte';
  import Logo from './nav/Logo.svelte';
</script>

<IframeResizingContainer>
  <div class="container" style= "display: block">
    <div class="content">

      <slot name="legend" />

      <div class="viz-pane">
        <slot name="viz" />
      </div>

      <div class="footer-embed">
        <div class="logo">
          <Logo />
        </div>
  
        <div class="text-unep-endorsement">
          <p>The boundaries and names shown, and the designations used on 
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
    display:flex;
    position: absolute;
    padding-top: 0px;
    margin-top: 0px;
  }

  .container :global(.embed-additional-text-2) {
    position: absolute;
    top: 80px;
    right: 0;
    width: 200px;
    height: 100px;
    border: 3px solid #73AD21;
  }

  .container :global(.cartogram) {
    display: flex;
    padding: 0 0 0;
    padding-bottom: 0px;
    padding-top: 0px;
    margin: 0 0 0;
    margin-top: 120px;
    margin-bottom: 0px;
  }

  .container :global(.svg) {
    display: flex;
    padding: 0 0 0;
    padding-bottom: 0px;
    padding-top: 0px;
    margin: 0 0 0;
    margin-top: 120px;
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

  p {
    font-weight:400;
    padding-left: 20%;
    color:dimgray;
    display:flex;
    text-align: right;
    padding-right: 20%;
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

  }

</style>