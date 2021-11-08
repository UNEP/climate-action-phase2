<script lang="ts">
  import type { Content } from 'src/types';
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
  import sotc from './stateoftheclimate.json';
  import wh from './whatshappening.json';
  import cap from './climateactionprogress.json';

  export var embed: string;
  export var page: string;

  const gdocs = { sotc, wh, cap };

  const content: Content[] = embed
    ? [...sotc.article, ...wh.article, ...cap.article] : gdocs[page].article;

  const embedBlock = embed && content.find(b => b.embed === embed);

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
{#if embed}
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
    <div>Missing embed: {embed}</div>
  {/if}
{:else}
  <TopNav />
  <main>
    <article class="main-container">
      {#each content.filter(c => !c.embedonly) as block}
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