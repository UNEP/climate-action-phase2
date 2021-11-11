<script lang="ts">
import { current_component, each } from 'svelte/internal';
import sotc from '../stateoftheclimate.json';
import wh from '../whatshappening.json';
import cap from '../climateactionprogress.json';

import Icon from './Icon.svelte';

export let page:string;

console.log(sotc);

let articles: Article[] = [
  {
    title: sotc.article[0].head,
    body: sotc.article[0].text[0].p.split('.').slice(0,2).join('.'),
    icon: "stateoftheclimate.main",
    id: "sotc",
    link: "state-of-climate.html"
  },
  {
    title: wh.article[0].head,
    body: wh.article[0].text[0].p.split('.').slice(0,2).join('.'),
    icon: "whatshappening.main",
    id: "wh",
    link: "whats-happening.html"
  },
  {
    title: cap.article[0].head,
    body: cap.article[0].text[0].p.split('.').slice(0,1).join('.'),
    icon: "climateactionprogress.main",
    id: "cap",
    link: "climate-action-progress.html"
  }
];

  interface Article{
    title: string;
    body: string;
    icon: string;
    id: string;
    link: string;
  }
</script>

<section class="infoSquare margin-breakout-mobile">

  <div class="embed-container">
    {#each articles as article}
    {#if article.id !== page}
    <div class="navigation-content" on:click={() => location.href=article.link}>
        <div class="top-section">
          <span class="arrow right"/>
          <h4 class="title">
            {article.title}
          </h4>
          <p class="text">
              {article.body}
          </p>
        </div>
        <div class="icon">
          <Icon name={article.icon} />
        </div>
    </div>
    {/if}
    {/each}
  </div>

</section>

<style>


  .top-section{
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .embed-container {
    box-sizing: border-box;
    padding-bottom: 20px;
    flex: 0 0 100%;
    text-align: left;
    flex-direction: row;
  }

  .navigation-content:first-child {
    margin-right: 1rem;
  }

  .navigation-content {
    cursor: pointer;
    position: relative;
    margin-top: 30px;
    height: 18rem;
    border: 2px solid #DCDCDC;
    width: 100%;
    display: inline-table;
    position:relative;
    transition: 0.5s border;
  }

  .navigation-content:hover {
    border: 2px solid rgba(54, 54, 54, 1);
    transition: 0.5s border;
  }

  .title, .text { padding: 0 3rem; }

  .text{
    color:#505050;
    font-size: 1.125rem;
    line-height:  1.5rem;
  }

  .icon{
    overflow: hidden;
    position: absolute;
    bottom: 0px;
    width: 70%;
    height: 16rem;
    right: 0px;
    z-index: 1;
    opacity: 0.15;
  }

  *, *:before, *:after {
	box-sizing: border-box;
  }

  .arrow {
    margin-top: 10px;
    float: left;
    width: 60px;
    height: 15px;
    position: relative;
  }

  .arrow::before {
    content: '';
    display: block;
    width: 15px;
    height: 15px; 
    left: 60%;
    border-style: solid;
    border-color: #000;
    border-width: 2px 2px 0 0;
    position: absolute;
    transform-origin: 110%;
    transform: rotate(45deg);
  }

  .arrow::after {
    content: '';
    display: block;
    border-style: solid;
    border-color: #000;
  }

  .arrow.arrow.right::after {
    width: 54px;
    height: 0;
    border-width: 2px 0 0 0;
  }

  .infoSquare {
    overflow: auto;
    margin-top: 20px!important;
    padding:0 1rem;
  }

  @media (min-width: 58rem) {
    .infoSquare {
      padding:0;
      margin: 1rem 0 0;
      max-width: calc(800px + 7.2rem);
    }
    .navigation-content {
      width: calc(50% - .5rem);
    }
  }

</style>