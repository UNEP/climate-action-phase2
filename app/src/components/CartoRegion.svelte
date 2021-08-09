<script lang="ts">
  import * as d3 from 'src/d3';
  import type { CartoRegionData } from 'src/types';
  import TreemapSvg from './charts/TreemapSVG.svelte';
  import Annotation from './maps/Annotation.svelte';

  interface Sector {
    type: string;
    value: number;
  }

  interface RegionAnnotation {
    x: number,
    y: number,
  }

  let data: CartoRegionData = {"regions":[{"region":"Asia + Pacific","types":[{"type":"waste","value":43.50000000000001},{"type":"windblowndust","value":91.50000000000003},{"type":"solvents","value":1.2},{"type":"intlshipping","value":10.899999999999999},{"type":"transport","value":68.30000000000001},{"type":"residential","value":181.59999999999994},{"type":"othercombustion","value":13.899999999999999},{"type":"commercial","value":10.299999999999999},{"type":"remainingsources","value":184.29999999999998},{"type":"industry","value":100.60000000000001},{"type":"otherfires","value":33.6},{"type":"agrwasteburning","value":5.6000000000000005},{"type":"energy","value":90.69999999999996},{"type":"agriculture","value":72.4},{"type":"afciddust","value":76}],"posX":360,"posY":121,"numCountries":45,"totalValue":984.4000000000024},{"region":"Europe","types":[{"type":"waste","value":20.399999999999995},{"type":"windblowndust","value":177.1},{"type":"solvents","value":-0.6},{"type":"intlshipping","value":16.400000000000002},{"type":"transport","value":69.39999999999999},{"type":"residential","value":113.30000000000001},{"type":"othercombustion","value":12.099999999999998},{"type":"commercial","value":11.399999999999993},{"type":"remainingsources","value":62.90000000000002},{"type":"industry","value":56.7},{"type":"otherfires","value":11.699999999999996},{"type":"agrwasteburning","value":7.3},{"type":"energy","value":114},{"type":"agriculture","value":119.4},{"type":"afciddust","value":52.10000000000001}],"posX":198,"posY":117,"numCountries":53,"totalValue":843.6000000000023},{"region":"Africa","types":[{"type":"waste","value":27.599999999999998},{"type":"windblowndust","value":1112.9000000000003},{"type":"solvents","value":-0.30000000000000004},{"type":"intlshipping","value":14.899999999999995},{"type":"transport","value":59.19999999999999},{"type":"residential","value":153.8},{"type":"othercombustion","value":7.4},{"type":"commercial","value":11.699999999999996},{"type":"remainingsources","value":147.8},{"type":"industry","value":53.30000000000002},{"type":"otherfires","value":282.9000000000001},{"type":"agrwasteburning","value":15.099999999999996},{"type":"energy","value":83.80000000000004},{"type":"agriculture","value":17.599999999999998},{"type":"afciddust","value":61.500000000000014}],"posX":547,"posY":331,"numCountries":53,"totalValue":2049.199999999997},{"region":"Latin America + Caribbean","types":[{"type":"waste","value":19.799999999999997},{"type":"windblowndust","value":152.5},{"type":"solvents","value":0},{"type":"intlshipping","value":15.500000000000002},{"type":"transport","value":37.4},{"type":"residential","value":66.1},{"type":"othercombustion","value":3.9},{"type":"commercial","value":2.3000000000000003},{"type":"remainingsources","value":162.1},{"type":"industry","value":47.1},{"type":"otherfires","value":48.89999999999999},{"type":"agrwasteburning","value":3.600000000000001},{"type":"energy","value":36.7},{"type":"agriculture","value":20.2},{"type":"afciddust","value":13.899999999999997}],"posX":491,"posY":204,"numCountries":36,"totalValue":630.0000000000008},{"region":"West Asia","types":[{"type":"waste","value":11.400000000000002},{"type":"windblowndust","value":311.70000000000005},{"type":"solvents","value":-0.7},{"type":"intlshipping","value":3},{"type":"transport","value":33.300000000000004},{"type":"residential","value":7.300000000000002},{"type":"othercombustion","value":1},{"type":"commercial","value":1.5},{"type":"remainingsources","value":10.200000000000001},{"type":"industry","value":30.499999999999996},{"type":"otherfires","value":0.5},{"type":"agrwasteburning","value":0.8},{"type":"energy","value":93.59999999999998},{"type":"agriculture","value":23.499999999999996},{"type":"afciddust","value":14.4}],"posX":479,"posY":8,"numCountries":12,"totalValue":541.9999999999999},{"region":"North America","types":[{"type":"waste","value":0.30000000000000004},{"type":"windblowndust","value":0.30000000000000004},{"type":"solvents","value":0},{"type":"intlshipping","value":0.30000000000000004},{"type":"transport","value":1.9},{"type":"residential","value":1.8},{"type":"othercombustion","value":0.8},{"type":"commercial","value":0.30000000000000004},{"type":"remainingsources","value":1.6},{"type":"industry","value":1.7000000000000002},{"type":"otherfires","value":2.2},{"type":"agrwasteburning","value":0.1},{"type":"energy","value":1.7000000000000002},{"type":"agriculture","value":1.7000000000000002},{"type":"afciddust","value":0.4}],"posX":242,"posY":233,"numCountries":2,"totalValue":15.1},{"region":"Polar","types":[{"type":"waste","value":0.1},{"type":"windblowndust","value":0.5},{"type":"solvents","value":0},{"type":"intlshipping","value":0.5},{"type":"transport","value":0.5},{"type":"residential","value":0.1},{"type":"othercombustion","value":0.1},{"type":"commercial","value":0},{"type":"remainingsources","value":1.1},{"type":"industry","value":0.2},{"type":"otherfires","value":1},{"type":"agrwasteburning","value":0},{"type":"energy","value":0.3},{"type":"agriculture","value":0.7},{"type":"afciddust","value":0.1}],"posX":560,"posY":180,"numCountries":1,"totalValue":5.2},{"region":"#N/A","types":[{"type":"waste","value":1},{"type":"windblowndust","value":1.6},{"type":"solvents","value":-0.1},{"type":"intlshipping","value":1},{"type":"transport","value":2.2},{"type":"residential","value":2.7},{"type":"othercombustion","value":0.2},{"type":"commercial","value":0.3},{"type":"remainingsources","value":1.6},{"type":"industry","value":3.2},{"type":"otherfires","value":0.3},{"type":"agrwasteburning","value":0.1},{"type":"energy","value":4},{"type":"agriculture","value":2.7},{"type":"afciddust","value":3.2}],"posX":451,"posY":85,"numCountries":1,"totalValue":24}],"scale_width":800,"scale_height":500}
 
  //Just for hardcode the position of each region on the map, once done delete /*ALX*/
  //Asia + Pacific
  data.regions[0].posX = 620;
  data.regions[0].posY = 150;

  //Europe
  data.regions[1].posX = 370;
  data.regions[1].posY = 105;

  //Africa
  data.regions[2].posX = 280;
  data.regions[2].posY = 210;

  //Latin America + Caribbean
  data.regions[3].posX = 85;
  data.regions[3].posY = 240;

  //West Asia
  data.regions[4].posX = 440;
  data.regions[4].posY = 210;

  //North America
  data.regions[5].posX = 60;
  data.regions[5].posY = 145;

  //Polar
  data.regions[6].posX = 190;
  data.regions[6].posY = 70;

  //N/A (Taiwan)
  data.regions[7].posX = 1500;
  data.regions[7].posY = 1500;

  //Remove N/A and polar
  data.regions.splice(6,2)

  let width = 100;

  const scaleRate = data.scale_height / data.scale_width;

  const textShowDelay = 0;
  const textRemoveDelay = 0;
  let regionTextShowing = false;
  let typeTextShowing = false;

  let currentRegionData = {
    region : "",                                //Curren region name selected
    type : "",                                  //Could be type of sector or fuel
    value: 0,                                   //Value of PM
    total: 0,                                   //Total value of emissions PM of the selected region
    x: 0,
    y: 0,
    radius: 0,
    forceTop: true,
    current : {
      value : 0,                              //Emissions for the current selected sector/fuel on the current region
      type: "",                                //Type of sector or fuel
      x: 0,
      y: 0,
    }
    
  }

  const handleMouseOver = (d, currentElement) => {
    
    currentRegionData.current.type = currentElement.type
    currentRegionData.current.value = currentElement.value
    
    d3.select(d)
            .transition()
            .duration(250)
            .style('stroke', 'black')
            .style('stroke-linecap', 'butt')
            .style('stroke-width', '0.5')
    
    showSelectedRegionInformation(d.parentNode.parentNode.children[0])
    
    showConcreteTypeInformation(d)
  
  }

  const handleMouseOut = (d) => {

    removeInformation('#' + d.parentNode.id.replace('-elements','') + "-background")

    let currentType = d3.select(d)
            .transition()
            .duration(250)
            .style('stroke', 'transparent')

  }

  const handleMouseOverTreemap = (d, currentRegion) =>{
  
    if(currentRegionData.region != currentRegion.background.region){

       currentRegionData.region = currentRegion.background.region
       currentRegionData.total = currentRegion.totalPollutingValue
       currentRegionData.type = currentRegion.mostPollutingType
       currentRegionData.value = currentRegion.mostPollutingValue

    }

    showSelectedRegionInformation(d);
  } 

  const handleMouseOutTreemap = d => removeInformation(d);

  const showSelectedRegionInformation = (element) => {
    
    const region = d3.select(element)

    region.style('filter', 'url(#shadow)')

    currentRegionData.x = +region.attr('x') + +region.attr('width')/2;
    currentRegionData.y = +region.attr('y')
    regionTextShowing = true;

  };

  const removeInformation = (element) => {
    
    d3.select(element)
      .style('filter', 'none');

    const svg = d3.select('#treemapCartogram');
    svg.select('line').remove();
    svg.selectAll('text').remove();

    regionTextShowing = false;
    typeTextShowing = false;

  };

  const showConcreteTypeInformation =  (element) => {
    
    const concreteType = d3.select(element)

    currentRegionData.current.x = +concreteType.attr('x') + (+concreteType.attr('width') + 5);
    currentRegionData.current.y = +concreteType.attr('y') + 5;

    typeTextShowing = true;

  }
</script>

<h1>TITLE</h1>
<div bind:clientWidth={width} >
  {#if regionTextShowing}
  <Annotation x={currentRegionData.x} y={currentRegionData.y} text="Most of the PM 2.5 in {currentRegionData.region} comes from {currentRegionData.type} -- {currentRegionData.value.toFixed(2)} of the {currentRegionData.total.toFixed(2)} µg/m3" 
                radius={currentRegionData.radius} forceTopWherePossible={currentRegionData.forceTop}
                canvasWidth={width} canvasHeight={width * scaleRate} />
  {/if}
  {#if typeTextShowing}
  <Annotation x={currentRegionData.current.x} y={currentRegionData.current.y} text="{currentRegionData.current.type} {currentRegionData.current.value.toFixed(2)} µg/m3"
                radius={currentRegionData.radius} justText={true}
                canvasWidth={width} canvasHeight={width * scaleRate} />
  {/if}
  <TreemapSvg 
    {data}
    {width}
    height = {width * scaleRate} 
    {handleMouseOver}
    {handleMouseOut}
    {handleMouseOverTreemap}
    {handleMouseOutTreemap}
    {currentRegionData}
  />
  
</div>


<style>
</style>