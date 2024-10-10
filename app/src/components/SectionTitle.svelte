<script lang="ts">
  import { alignment } from 'src/svg';
  import type { Content } from 'src/types';
  import Icon from './Icon.svelte';

  export let block: Content;

</script>
<div class="kicker">
  {#if block.icon}
    <div class="kicker-icon"  style={alignment[block.icon] || ''}>
      <Icon name={block.icon} />
    </div>
  {/if}
  <div class="kicker-text">
    {@html block.title }
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
    padding-left: 5px;
    font-size: 15px;
    font-weight: 400;
    text-transform: uppercase;
  }

  .kicker-icon {
    margin-right: 4px;
    position: relative;
    width: 36px;
    height: 36px;
    box-sizing: border-box;
  }

  .kicker-icon :global(svg *) {
    stroke: black;
  }

  .kicker-icon :global(svg path.fill-black) {
    fill: black;
    stroke: none;
  }
</style>