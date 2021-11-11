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
    <div class="navigation-content" onclick="location.href='{article.link}';">
        <div class="top-section">
          <div class="arrow right"/>
          <div class="title">
            {article.title}
          </div>

          <div class="text">
            <span>
              {article.body}
            </span>
          </div>
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
    height: 150px;
  }
  .embed-container {
    box-sizing: border-box;
    padding-bottom: 20px;
    flex: 0 0 100%;
    text-align: left;
    margin-top:30px;
    flex-direction: row;
  }
  .navigation-content {
    float: left;
    cursor: pointer;
    position: relative;
    margin-top: 30px;
    height: 150px;
    border: 2px solid rgba(189, 189, 189, 1);
    width: 45%;
    margin-right: 10px;
    margin-left: 10px;
    display: inline-table;
    position:relative;
    transition: 0.5s border;
  }
  .navigation-content:hover {
    border: 2px solid rgba(54, 54, 54, 1);
    transition: 0.5s border;
  }



  .title {
    margin-left: 10px;
    float: left;
    color:#505050;
    font-size: 1.125rem;
  }
  .text{
    color:#505050;
    font-size: 0.9rem;
    display: inline-block;
    margin: 10px 20px 10px;
    z-index: 10;
  }

  .infoSquare {

    overflow: auto;
    max-width: 800px;
    margin-top: 20px!important;
  }
  .icon{
    overflow: hidden;
    position: absolute;
    bottom: 0px;
    width: 50%;
    max-height: 150px;
    right: 0px;
    z-index: 1;
    opacity: 0.2;
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

</style>