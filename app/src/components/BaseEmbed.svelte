<script lang="ts">
  import IframeResizingContainer from 'src/components/IframeResizingContainer.svelte';
  import Logo from './nav/Logo.svelte';

  export var header: string;

</script>

<IframeResizingContainer>
  <div class="container">

    <h1>{header}</h1>

    <div class="content">

      <slot name="legend" />

      <div class="viz-pane">
        <slot name="viz" />
      </div>

      <div class="logo">
        <Logo />
        <div  class="copy">
          <p>
            To explore more about the climate emergency and
            the effects on the planet visit
            <b><a href="https://www.unep.org/">unep.org</a></b>
          </p>
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

  .container {
    padding: 20px 20px 0;
    max-width: 1100px;
    margin: auto;
    overflow-x: hidden;
  }

  .content {
    position: relative;
  }

  .copy {
    font-size: 18px;
    line-height: 1.5;
    font-weight: 300;
  }

  p {
    margin-top:0;
  }

  h1 {
    font-size: 22px;
    line-height: 28px;
    margin-top: 0;
  }

  .viz-pane {
    position: relative;
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
      margin-left: 25%;
    }
    .copy {
      position: absolute;
      top: 30px;
      left: 0;
      width: 20%;
      min-width: 180px;
    }

    p {
      margin-top:10px;
    }

    .container {
      padding: 20px 12px 0;
    }
  }

  @media (max-width: 600px) {
    .copy {
      font-size: 14px;
    }
    .container {
      padding: 20px 12px 0;
    }
  }


  @media (min-width: 1100px) {
    .content, h1 {
      margin-left:12px;
    }

  }

</style>