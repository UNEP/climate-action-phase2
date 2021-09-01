<script lang="ts">
  import svg from 'src/svg';
  import type { Content } from 'src/types';

  export let block: Content;

</script>
<div class="kicker">
  <div class="kicker-icon">{@html svg.menu[block.icon]}</div>
  <div class="kicker-text">
    {@html block.menu}
  </div>
</div>

<style>

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

  .kicker-text {
    padding-bottom: 0;
    margin-bottom: 0;
    padding-left: 5px;
    font-size: 15px;
    font-weight: 550;
    text-transform: uppercase;
  }

  .kicker-icon {
    padding-left: 0px;
    margin-bottom: 13px;
    margin-right: 4px;
    position: relative;
    margin-left: 0px;
    float: left;
    width: 36px;
    height: 36px;
    box-sizing: border-box;
  }

  .kicker-icon :global(svg *) {
    stroke: black;
  }

  @media (max-width: 700px) {
    .kicker-icon {
      flex: 0 0 20px;
      top: 0;
    }
  }

</style>