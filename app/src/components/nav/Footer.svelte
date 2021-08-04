<script>
    import Logo from "./Logo.svelte";
    const footerMenu = [
        {label: '© UNEP'},
        {label: 'Terms of Use', a: 'https://www.unep.org/node/18424/'},
        {label: 'Privacy', a: 'https://www.unep.org/node/28178/'},
        {label: 'Report a project concern', a: 'https://www.unep.org/about-un-environment/why-does-un-environment-matter/un-environment-project-concern'},
    ];
</script>

<footer class="fs footer">
    <nav role="navigation" labelledby="footer-label">
        <Logo color="white" />
        <h3 id="footer-label" class="hidden">Footer menu</h3>
        <ul class='menu'>
            {#each footerMenu as b}
            {#if b.a}
            <li><a href='{b.a}'>{@html b.label}</a></li>
            {:else}
            <li>{@html b.label}</li>
            {/if}
            {/each}
        </ul>
        <ul class='menu social'>
            {#each footerMenu as b}
            {#if b.a}
            <li><a href='{b.a}'>{@html b.label}</a></li>
            {:else}
            <li>{@html b.label}</li>
            {/if}
            {/each}
        </ul>
    </nav>
  </footer>

<style>
    .hidden {
    position: absolute!important;
    overflow: hidden;
    clip: rect(1px,1px,1px,1px);
    width: 1px;
    height: 1px;
    word-wrap: normal;
  }
  .footer { 
      background-color: #00abf1;
      padding-top: 2rem;
      margin-top: 2rem;
    }
  .menu {
    list-style-type: none;
    margin:3rem 0 0 0;
    padding: 0;
  }
  li {
    display: inline-block;
    margin-right:.6rem;
    font-size: 1rem;
    color:#FFFFFF88;
    font-weight: 400;
  }
  li:not(:last-child)::after {
    content: '|';
    margin-left:.6rem;
  }
  li a {
    border: none;
    color:#FFFFFF88;
    transition: color .3s;
  }
  li a:hover { color:#FFFFFFFF; }
</style>