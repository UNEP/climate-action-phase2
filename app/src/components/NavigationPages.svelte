<script lang="ts">
  import sotc from '../stateoftheclimate.json';
  import wh from '../whatshappening.json';
  import cap from '../climateactionprogress.json';
  import ns from '../adaptationprogress.json';

  import Icon from './Icon.svelte';

  export let page: string;

  let articles = [
    {
      title: sotc.article[0].head,
      body: sotc.article[0].text[0].p.split('.').slice(0,2).join('.') + '.',
      icon: "stateoftheclimate.main",
      id: "sotc",
      link: "state-of-climate.html"
    },
    {
      title: wh.article[0].head,
      body: wh.article[0].text[0].p.split('.').slice(0,2).join('.') + '.',
      icon: "whatshappening.main",
      id: "wh",
      link: "whats-happening.html"
    },
    {
      title: cap.article[0].head,
      body: cap.article[0].text[0].p.split('.').slice(0,1).join('.') + '.',
      icon: "climateactionprogress.main",
      id: "cap",
      link: "mitigation-progress.html"
    },
    {
      title: ns.article[0].head,
      body: ns.article[0].text[0].p.split('.').slice(0,1).join('.') + '.',
      icon: "adaptationprogress.main",
      id: "ns",
      link: "adaptation-progress.html"
    }
  ];
</script>

<section class="info-square">

  <div class="link-square-container">
    {#each articles as article}
    {#if article.id !== page}
      <a class="link-square" href={article.link}>
        <div class="page-name">
          <div class="arrow"/>
          <h4 class="title">
            {article.title}
          </h4>
        </div>
        <p class="text">
            {article.body}
        </p>
        <div class="icon">
          <Icon name={article.icon} />
        </div>
      </a>
    {/if}
    {/each}
  </div>

</section>

<style lang="scss">

  .page-name {
    display: flex;
    align-items: center;
    column-gap: 10px;
    .title {
      margin: 0;
    }
  }

  .link-square-container {
    display: flex;
    column-gap: 10px;
    row-gap: 10px;
    flex-wrap: wrap;
  }

  @media (min-width: 900px) {
    .link-square-container {
      display: grid;
      grid-template-columns: auto auto auto;
    }

  }


  .link-square {
    cursor: pointer;
    position: relative;
    padding: 30px 0 20px;
    border: 2px solid #DCDCDC;
    // width: 100%;
    // display: inline-table;
    position:relative;
    transition: 0.5s border;
    // flex: 1 1 300px;
  }

  .link-square:nth-child(3) {
    display: none !important;
  }

  .link-square:hover {
    border: 2px solid rgba(54, 54, 54, 1);
    transition: 0.5s border;
  }

  h4 {
    font-size: 19px;
    font-style: normal;
    font-weight: 700;
    line-height: 29px;
  }
  
  .text {
    padding: 0 2.5rem;
    color: #505050;
    font-size: 18px;
    font-style: normal;
    font-weight: 300;
    line-height: 30px;
  }

  .icon {
    overflow: hidden;
    position: absolute;
    bottom: 0;
    top: -30%;
    width: 80%;
    right: 0;
    z-index: 1;
    opacity: 0.15;
    > :global(svg) {
      height: 100%;
      position: relative;
      top: 20%;
    }
    > :global(svg *) {
      stroke-width: 0.6 !important;
    }
  }

  .arrow {
    position: relative;
    border-top: 1px solid black;
    float: left;
    width: 70px;
    height: 0;
  }

  .arrow::before,
  .arrow::after {
    content: '';
    display: block;
    position: absolute;
    width: 18px;
    right: 0;
    border-top: 1px solid black;
    transform-origin: 100% 0;
    bottom: 0;
  }

  .arrow::before {
    transform: rotate(35deg);
  }

  .arrow::after {
    transform: rotate(-35deg);
  }

  .info-square {
    overflow: auto;
    margin-top: 20px;
  }

  @media (min-width: 58rem) {
    .info-square {
      max-width: 900px;
    }
  }

</style>
