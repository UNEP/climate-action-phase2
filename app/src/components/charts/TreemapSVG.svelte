<script>
	import { Canvas } from 'svelte-canvas'
	import { scaleOrdinal, scaleSqrt } from 'd3-scale'
	import Square from './Square.svelte'
    import * as d3 from '../libraries/d3.min.js'
    import { onMount } from 'svelte';
    export let handleMouseOver;
    export let handleMouseOut;
    export let handleMouseOverTreemap;
    export let handleMouseOutTreemap;
    export let data;
    export let width;
    export let height;
    export let currentRegionData;

    const colorSectors = scaleOrdinal()
  	.domain(['intlshipping','transport','residential','commercial','industry','afciddust','othercombustion','remainingsources','otherfires','agrwasteburning','agriculture','windblowndust','waste','solvents','energy'])
  	.range(['#9b7ccc','#811494','#407aa9','#ff9c9c','#ab4867','#b3b3b3','#8c8c8c','#666666','#333333','#62b048','#1b6e29','#faba26','#bd8e71','#854f38','#ff8a18']);
    let typeColors = {"industry" 						:	"#774F38","intlshipping" 				:   "#89d5e0","windblowndust" 				:   "#c1ddcc","waste" 						:	"#e9e6bd","remainingsources"				:	"#f78e22","agriculture"					:   "#fc7000","commercial"					:	"#f1e591","residential"					:	"#fc2d00","energy"						:	"#41a0a7","solvents"						:   "#3e0022","agrwasteburning"			:	"#c4574b","transport"						:   "#cacf3d","afciddust"					:   "#eaf6b2","othercombustion"			    :   "#53c4bb","otherfires"					:	"#6f6456","Liquid fuel and natural gas"	:	"#C9531C","totalcoal"					:	"#996A55","Solid biofuel"					:	"#FC413D","Process"						:	"#FCC93D",}

    onMount(() => {
        let svg = d3.select('#treemapCartogram');
        let regionSection = new Object();
        //If there is a some bakground for the treemap use it
        //Creating shadows
        let filter = svg.append('svg:filter')
                .attr('id', 'shadow')
                .attr('x', '-10%')
                .attr('y', '-10%')
                .attr('width', '120%')
                .attr('height', '120%')
                
            let shadow = filter.append('svg:feDropShadow')
                .attr('dx','0')
                .attr('dy','0')
                .attr('stdDeviation','3')
                .attr('flood-color', "#CACACA")
            
        data.treemapBackground.forEach(region => {
 
            regionSection[region.region] = svg.append('g').attr('id', region.region.replace(/\s/g, '').replace('+','-') + "-group")
            
            
            let background = regionSection[region.region].append('rect')
                .attr('id', region.region.replace(/\s/g, '').replace('+','-')+ "-background")
                .attr('class', 'tile')
                .attr('fill', region.color)
                .attr('width', region.width + region.borderRight + region.borderLeft)
                .attr('height', region.height + region.borderTop + region.borderBottom)  
                .attr('x', region.x - region.borderRight)
				.attr('y', region.y - region.borderBottom)
                .attr('rx', 2)
                .attr('ry', 2)
                .attr("filter", "url(#shadow)")
                .on("mouseover", (d) =>{
                    handleMouseOverTreemap(d);
                })
                .on("mouseout", handleMouseOutTreemap)
            let treemapRect = regionSection[region.region].append('g')
                .attr('id', region.region.replace(/\s/g, '').replace('+','-')  + "-elements")
    
    
                
        });
        
        data.values.forEach(type => {
            regionSection[type.leave.parent.data.region].select('#'+type.leave.parent.data.region.replace(/\s/g, '').replace('+','-') + "-elements").append('rect')
                .attr('class', 'tile')
                .attr('fill', colorSectors(type.leave.data.type))
                .attr('width', type.leave.x1 - type.leave.x0)
                .attr('height', type.leave.y1 - type.leave.y0)  
                .attr('x', type.regionX + type.leave.x0)
                .attr('y', type.regionY + type.leave.y0)
                .attr('rx', 2)
                .attr('ry', 2)
                .style('stroke', 'transparent')
                .style('stroke-linecap', 'butt')
                .style('stroke-width', '0.5')
                .on("mouseover", (d) => {
                    currentRegionData.region = type.leave.parent.data.region
                    currentRegionData.type = type.leave.data.type;
                    currentRegionData.value = type.leave.data.value
                    currentRegionData.total = type.leave.parent.value
                    currentRegionData.current.value = type.leave.parent.value
                    currentRegionData.current.type = type.leave.data.type;
                    handleMouseOver(d);
                })
                .on("mouseout", handleMouseOut)
            
        });
    })
   
    /*data.regions.forEach((region) => {
        //Create hierarchy for each node
        let hierarchy = d3.hierarchy(region, (node) => {

            return node.types;
        })
        .sum((node) => {
            return parseFloat(node.pm);	
        }).sort((a,b) => {
            return parseFloat(b.value) - parseFloat(a.value);
        });
        
        //Create the tree map for the current region
        let createTreeMap = d3.treemap().size([region.width, region.height]).padding(3).round(true);
        
        createTreeMap(hierarchy);

        onMount(() =>{
            let svg = d3.select('#treemapCartogram');
            let regionLeaves = hierarchy.leaves();
            let currentRegion = 
            svg.append('svg')
                .attr('region-name', region.region)
                .attr('width', region.width)
                .attr('height', region.height)
                .attr('x', region.posX)
                .attr('y', region.posY);

            let block = 
            currentRegion.selectAll('g')
                .data(regionLeaves)
                .enter()
                .append('g')
                .attr('transform', (node) =>'translate(' + node.x0 + ', ' +  node.y0 + ')');
            
            block.append('rect')
                .attr('class', 'tile')
                .attr('fill', (node) => typeColors[node.data.type])
                .attr('data-name', (node) => node.data.type)
                .attr('data-region', (node) => node.parent.data.region)
                .attr('data-value', (node) => node.data.value)
                .attr('width', (node) => '44')
                .attr('height', (node) => node.y1 - node.y0)       
        })

            
    });*/
</script>
<div class="svg" {width} {height}>
    <svg id="treemapCartogram" {width} {height}></svg>
</div>

<style>
    .svg {
        position:absolute;
        border-width: 0.5px;
        border-style: solid;
        border-color: black;
        background-color: rgb(237,237,237);
    }
</style>