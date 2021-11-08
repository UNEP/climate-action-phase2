<script lang="ts">
  export let id: string = null;
</script>

<section {id} class="viz wide">
  <slot />
</section>

<style lang="scss">
  .viz {
    padding: 2rem 0;
  }
</style>
