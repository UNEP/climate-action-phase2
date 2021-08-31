<script lang="ts">

  import deathLogo from 'src/svg/icons_deaths.svg';
  //import fuelsLogo from 'src/svg/icons_fuels.svg';
  import pm25Logo from 'src/svg/icons_pm25.svg';
  import sectorsLogo from 'src/svg/icons_sectors.svg';
  import sourceLogo from 'src/svg/icons_data-source.svg';

  export var sectionTitle: string;

  let selectedSection;

  if (sectionTitle === "pm25"){
    selectedSection = {
      logo: pm25Logo,
      title: `CURRENT STATE`
    };
  }

  else if (sectionTitle === "sectors"){
    selectedSection = {
      logo: sectorsLogo,
      title: `SOURCES PER SECTOR`
    };
  }

  else if (sectionTitle === "health"){
    selectedSection = {
      logo: deathLogo,
      title: `IMPACT`
    };
  }

  else if (sectionTitle === "sources"){
    selectedSection = {
      logo: sourceLogo,
      title: `DATA`
    };
  }

</script>

<div class="kicker">
  <div class="kicker-icon">{@html selectedSection.logo}</div>
  <div class="kicker-text">
    {@html selectedSection.title}
  </div>
</div>

<style>

  .kicker {
    position: relative;
    max-width: 1100px;
    height: 50px;
    font-size: 16px;
    display: flex;
    align-items: center;
    color: #505050;
    font-weight: 300;
    white-space: nowrap;
    margin-bottom: 5px;
  }

  .kicker-text {
    padding-bottom: 0;
    margin-bottom: 0;
    padding-left: 5px;
    font-size: 15px;
    font-weight: 550;
  }

  .kicker-icon {
    padding-left: 0px;
    margin-bottom: 13px;
    margin-right: 4px;
    position: relative;
    margin-left: 0px;
    float: left;
    width: 36px;
    height: 36px;
    box-sizing: border-box;
  }

  .kicker-icon :global(svg *) {
    stroke: black;
  }

  @media (max-width: 700px) {
    .kicker-icon {
      flex: 0 0 20px;
      top: 0;
    }
  }

</style>