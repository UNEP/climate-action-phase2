<script lang="ts">
  import type { Content } from 'src/types';
  import CartoWorld from 'src/components/CartoWorld.svelte';
  import PewSurvey from 'src/components/PewSurvey.svelte';
  import Intro from 'src/components/text/Intro.svelte';
  import Text from 'src/components/text/Text.svelte';
  import Image from './components/Image.svelte';
  import Iframes from './components/text/Iframes.svelte';
  import TopNav from 'src/components/nav/TopNav.svelte';
  import Footer from './components/nav/Footer.svelte';
  import Menu from './components/nav/Menu.svelte';
  import BaseEmbed from './components/BaseEmbed.svelte';
  import MethodologySourcesText from 'src/components/MethodologySourcesText.svelte';
  import { strToId } from './util';
  import CartoTemperature from './components/CartoTemperature.svelte';
  import AdaptationFinance from './components/AdaptiationFinance.svelte';
  import CartoScroller from './components/CartoScroller.svelte';
  import CountryTable from './components/CountryTable.svelte';
  import RiskCountryTable from './components/RiskCountryTable.svelte';
  import ClimateActionCountryTable from './components/ClimateActionCountryTable.svelte';
  import EmbedSection from './components/EmbedSection.svelte';
  import sotc from './stateoftheclimate.json';
  import wh from './whatshappening.json';
  import cap from './mitigationprogress.json';
  import ns from './adaptationprogress.json';

  import NavigationPages from './components/NavigationPages.svelte';

  export var embed: string;
  export var page: string;

  const gdocs = { sotc, wh, cap, ns };

  const content: Content[] = embed
    ? [...sotc.article, ...wh.article, ...cap.article, ...ns.article] : gdocs[page].article;

  const embedBlock = embed && content.find(b => b.embed === embed);

  const components = {
    'pew-survey' : PewSurvey,
    'carto-world': CartoWorld,
    'carto-temperature' : CartoTemperature,
    'adaptation-finance' : AdaptationFinance,
    'trends': CartoWorld,
    'intro': Intro,
    'text': Text,
    'image': Image,
    'iframes': Iframes,
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
    <BaseEmbed block={embedBlock}>
      <div slot="viz" class="cartogram-pane">
        <svelte:component
          this={components[embedBlock.type]}
          {...embedBlock}
          {content}
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
      <NavigationPages {page}></NavigationPages>
    </article>
  </main>

  <Footer />
  <div class="publishing_info">
    <span class="publishing_info_original">Published: 22 October 2022</span>
    <span class="publishing_info_latest_update">Last Updated: 21 October 2024</span>
	</div>
{/if}
