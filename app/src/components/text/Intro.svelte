<script>

export let text;
export let head;
export let tag;
export let breadcrumbs;

</script>
<header class='intro col-text'>
  <nav class="inner-nav" role="navigation" labelledby="breadcrumbs-label">
    <h3 id="breadcrumbs-label" class="hidden">Breadcrumbs</h3>
    <ul class='breadcrumbs'>
      {#each breadcrumbs as b}
        {#if b.a}
        <li><a href='{b.a}'>{@html b.label}</a></li>
        {:else}
        <li>{@html b.label}</li>
        {/if}
      {/each}
    </ul>
  </nav>

  {#if head}
    <h1>{@html head}</h1>
  {/if}

  {#if tag}
    <h2 class="tag">{@html tag}</h2>
  {/if}

  {#if text}
  {#each text as p}
      <p>{@html p.p}</p>
  {/each}
  {/if}

  <p class="dateline">
    Published <time datetime="2021-11-09">9 Nov 2021</time>
  </p>

</header>

<style>
  .intro {
    border-bottom: 1px solid #3B536527;
    padding-top:2rem;
  }
  .breadcrumbs {
    list-style-type: none;
    margin:0;
    padding: 0;
  }
  .dateline {
    font-size: 1rem;
    color:#505050;
  }
  li {
    display: inline-block;
    margin-right:.8rem;
    font-size: 1rem;
    color:#333;
    font-weight: 400;
  }
  li:not(:last-child)::after {
    content: '/';
    margin-left:.4rem;
  }
  li:last-child { font-weight: 700; }
  li a {
    border: none;
    transition: opacity .3s;
    opacity: .68;
  }
  li a:hover { opacity:1; }
  p { margin: 0; }
</style>