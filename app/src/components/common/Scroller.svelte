<script lang="ts">
  import { onMount } from "svelte";

  let el: HTMLDivElement;
  let sections: Element[];
  export let section: number;

  const onScroll = () => {
    for (let i = 0; i < sections.length; i++) {
      const s = sections[i];
      const { top, bottom } = s.getBoundingClientRect();
      const middle = (bottom + top) / 2;
      if (middle > 0 && middle < window.innerHeight) {
        if (section !== i) {
          section = i;
        }
        break;
      }
    }
  };

  onMount(() => {
    sections = [...el.querySelectorAll('[slot=scrollable] > *')];
  });

</script>

<svelte:window on:scroll={onScroll} />
<div class="scroller" bind:this={el}>
  <div class="sticky-container">
    <slot name="sticky" />
  </div>
  <slot name="scrollable" />
</div>

<style lang="scss">

  .scroller {
    position: relative;
  }

  .sticky-container {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    > :global(*) {
      position: sticky;
      top: 20vh;
    }
  }
</style>