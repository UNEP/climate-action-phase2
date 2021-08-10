<script lang="ts">
  import type {RegionTreemapData} from 'src/components/charts/TreemapSVG.svelte';
  import * as d3 from 'src/d3';
  import TreemapSvg from 'src/components/charts/TreemapSVG.svelte';
  import Annotation from 'src/components/maps/Annotation.svelte';
  import {sectoralBD, differentFuels} from  'src/data';


  export let data : string;

  interface CurrentSector{
    value: number,
    type: string,
    x: number,
    y: number
  }

  interface CurrentRegion{
    region: string,
    type: string,
    value: number,
    total: number,
    x: number,
    y: number,
    radius: number,
    current: CurrentSector
  }

  const currentData = data === "sectors" ? sectoralBD: data === "fuel"? differentFuels : null;

  let width = 100;

  const scaleRate = currentData.scale_height / currentData.scale_width;

  let regionTextShowing = false;
  let typeTextShowing = false;

  let currentRegionElement:HTMLElement;

  let currentRegionData : CurrentRegion = {
    region : "",                                //Curren region name selected
    type : "",                                  //Could be type of sector or fuel
    value: 0,                                   //Value of PM
    total: 0,                                   //Total value of emissions PM of the selected region
    x: 0,
    y: 0,
    radius: 0,
    current : {
      value : 0,                              //Emissions for the current selected sector/fuel on the current region
      type: "",                                //Type of sector or fuel
      x: 0,
      y: 0,
    }
  };

  const handleMouseOver = (d:HTMLElement, currentElement:CurrentSector) => {

    currentRegionData.current.type = currentElement.type
    currentRegionData.current.value = currentElement.value

    showSelectedRegionInformation(d.parentNode.parentNode.children[0] as HTMLElement)

    showConcreteTypeInformation(d)

  }

  const handleMouseOut = (d:HTMLElement) => removeInformation();

  const handleMouseOverTreemap = (d:HTMLElement, currentRegion:RegionTreemapData) =>{

    if(currentRegionData.region !== currentRegion.background.region){

       currentRegionData.region = currentRegion.background.region
       currentRegionData.total = currentRegion.totalPollutingValue
       currentRegionData.type = currentRegion.mostPollutingType
       currentRegionData.value = currentRegion.mostPollutingValue

    }

    showSelectedRegionInformation(d);
  }

  const handleMouseOutTreemap = (d:HTMLElement) => removeInformation();

  const showSelectedRegionInformation = (element:HTMLElement) => {

    const region = d3.select(element)

    d3.select(currentRegionElement).style('filter', 'none')
    currentRegionElement = element

    region.style('filter', 'url(#shadow)')

    currentRegionData.x = +region.attr('x') + +region.attr('width')/2;
    currentRegionData.y = +region.attr('y')
    regionTextShowing = true;

  };

  const removeInformation = () => {
    d3.select(currentRegionElement)
      .style('filter', 'none');

    regionTextShowing = false;
    typeTextShowing = false;

  };

  const showConcreteTypeInformation =  (element:HTMLElement) => {

    const concreteType = d3.select(element)

    currentRegionData.current.x = +concreteType.attr('x') + (+concreteType.attr('width') + 5);
    currentRegionData.current.y = +concreteType.attr('y') + 5;

    typeTextShowing = true;

  }
</script>

<h1>{data}</h1>
<div bind:clientWidth={width} >

  {#if regionTextShowing}
  <Annotation x={currentRegionData.x}
    y={currentRegionData.y}
    text="Most of the PM 2.5 in {currentRegionData.region} comes from {currentRegionData.type} -- {currentRegionData.value.toFixed(2)} of the {currentRegionData.total.toFixed(2)} µg/m3"
    radius={currentRegionData.radius} forceTopWherePossible={true}
    canvasWidth={width} canvasHeight={width * scaleRate}
  />
  {/if}

  {#if typeTextShowing}
  <Annotation
    x={currentRegionData.current.x}
    y={currentRegionData.current.y}
    text="{currentRegionData.current.type} {currentRegionData.current.value.toFixed(2)} µg/m3"
    radius={currentRegionData.radius}
    justText={true}
    canvasWidth={width}
    canvasHeight={width * scaleRate}
  />
  {/if}
  <TreemapSvg
    data={currentData}
    {width}
    height = {width * scaleRate}
    {handleMouseOver}
    {handleMouseOut}
    {handleMouseOverTreemap}
    {handleMouseOutTreemap}
  />

</div>


<style>
</style>