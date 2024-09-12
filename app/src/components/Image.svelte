<script>
  export let image;
  export let caption;
  </script>
  <section class='col-text'>
    {#if image}
      <img src={image} alt={'image ap'} class="image" />
    {/if}
    {#if caption}
    {#each caption as p}
        <p class="dateline">{@html p.p}</p>
    {/each}
    {/if}
  </section>


  <style>
      .dateline {
        font-size: 14.4px;
        font-style: normal;
        font-weight: 300;
        line-height: 18px;
        padding: 0;
        color:#505050;
    }

    .image {
      max-width: 100%;
      width: 100%;
      height: auto;
      margin-top: 32px;
      margin-bottom: 24px;
    }
  </style>