<script lang="ts">
  import type { Content, GDocs, Embeds } from 'src/types';
  import CartoWorld from 'src/components/CartoWorld.svelte';
  import PewSurvey from 'src/components/PewSurvey.svelte';
  import Intro from 'src/components/text/Intro.svelte';
  import Text from 'src/components/text/Text.svelte';
  import TopNav from 'src/components/nav/TopNav.svelte';
  import Footer from './components/nav/Footer.svelte';
  import Menu from './components/nav/Menu.svelte';
  import BaseEmbed from './components/BaseEmbed.svelte';
  import MethodologySourcesText from 'src/components/MethodologySourcesText.svelte';
  import { strToId } from './util';
  import CartoTemperature from './components/CartoTemperature.svelte';
  import CartoScroller from './components/CartoScroller.svelte';
  import CountryTable from './components/CountryTable.svelte';
  import RiskCountryTable from './components/RiskCountryTable.svelte';
  import ClimateActionCountryTable from './components/ClimateActionCountryTable.svelte';
  import EmbedSection from './components/EmbedSection.svelte';

  export var gdocs: GDocs;
  export var embed: string;

  let embedData:Embeds[] = [];
  const content: Content[] = gdocs.article;
  const embedBlock = embed && content.find(b => b.embed === embed);

  console.log(content);

  content.forEach(c =>{
    if('head' in c && 'title' in c && 'embed' in c){
      embedData.push({'title':c.title, 'head':c.head, 'embed':c.embed});
    }
  });

  const components = {
    'pew-survey' : PewSurvey,
    'carto-world': CartoWorld,
    'carto-temperature' : CartoTemperature,
    'trends': CartoWorld,
    'intro': Intro,
    'text': Text,
    "menu": Menu,
    'methodology': MethodologySourcesText,
    'carto-scrolly': CartoScroller,
    'country-table': CountryTable,
    'risk-country-table': RiskCountryTable,
    'climate-action-country-table': ClimateActionCountryTable,
    'embed' : EmbedSection
  };

</script>
{#if embedBlock}
  <BaseEmbed>
    <div slot="viz" class="cartogram-pane">
      <svelte:component
        this={components[embedBlock.type]}
        {...embedBlock}
        content={content}
        block={embedBlock}
        isEmbed={true}
      />
    </div>
  </BaseEmbed>
{:else}
  <TopNav />
  <main>
    <article>
      {#each content as block}
        {#if components[block.type]}
          <svelte:component
            this={components[block.type]}
            {...block}
            block={block}
            id={block.menu ? strToId(block.menu) : null}
            content={content}
            currentPage={block.id}
          />
        {:else}
          <div>Missing component for '{block.type}'</div>
        {/if}
      {/each}
    </article>
  </main>

  <Footer />
{/if}