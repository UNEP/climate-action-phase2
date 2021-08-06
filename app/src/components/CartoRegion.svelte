<script>
    /*************************************************************************/   
    /*                             MODULE IMPORTS                            */
    /*************************************************************************/
    import { onMount } from 'svelte';
    import * as d3 from './libraries/d3.min.js'
    import TreemapCanvas from './charts/TreemapCanvas.svelte';
    import TreemapSvg from './charts/TreemapSVG.svelte';
    import { t } from 'svelte-canvas';


    /*************************************************************************/   
    /*                        VARIABLES DEFINITION                           */
    /*************************************************************************/
    let data = {"regions":[{"region":"Asia + Pacific","types":[{"type":"waste","value":43.50000000000001},{"type":"windblowndust","value":91.50000000000003},{"type":"solvents","value":1.2},{"type":"intlshipping","value":10.899999999999999},{"type":"transport","value":68.30000000000001},{"type":"residential","value":181.59999999999994},{"type":"othercombustion","value":13.899999999999999},{"type":"commercial","value":10.299999999999999},{"type":"remainingsources","value":184.29999999999998},{"type":"industry","value":100.60000000000001},{"type":"otherfires","value":33.6},{"type":"agrwasteburning","value":5.6000000000000005},{"type":"energy","value":90.69999999999996},{"type":"agriculture","value":72.4},{"type":"afciddust","value":76}],"width":100,"height":100,"posX":447,"posY":6},{"region":"Europe","types":[{"type":"waste","value":20.399999999999995},{"type":"windblowndust","value":177.1},{"type":"solvents","value":-0.6},{"type":"intlshipping","value":16.400000000000002},{"type":"transport","value":69.39999999999999},{"type":"residential","value":113.30000000000001},{"type":"othercombustion","value":12.099999999999998},{"type":"commercial","value":11.399999999999993},{"type":"remainingsources","value":62.90000000000002},{"type":"industry","value":56.7},{"type":"otherfires","value":11.699999999999996},{"type":"agrwasteburning","value":7.3},{"type":"energy","value":114},{"type":"agriculture","value":119.4},{"type":"afciddust","value":52.10000000000001}],"width":100,"height":100,"posX":657,"posY":167},{"region":"Africa","types":[{"type":"waste","value":27.599999999999998},{"type":"windblowndust","value":1112.9000000000003},{"type":"solvents","value":-0.30000000000000004},{"type":"intlshipping","value":14.899999999999995},{"type":"transport","value":59.19999999999999},{"type":"residential","value":153.8},{"type":"othercombustion","value":7.4},{"type":"commercial","value":11.699999999999996},{"type":"remainingsources","value":147.8},{"type":"industry","value":53.30000000000002},{"type":"otherfires","value":282.9000000000001},{"type":"agrwasteburning","value":15.099999999999996},{"type":"energy","value":83.80000000000004},{"type":"agriculture","value":17.599999999999998},{"type":"afciddust","value":61.500000000000014}],"width":100,"height":100,"posX":699,"posY":208},{"region":"Latin America + Caribbean","types":[{"type":"waste","value":19.799999999999997},{"type":"windblowndust","value":152.5},{"type":"solvents","value":0},{"type":"intlshipping","value":15.500000000000002},{"type":"transport","value":37.4},{"type":"residential","value":66.1},{"type":"othercombustion","value":3.9},{"type":"commercial","value":2.3000000000000003},{"type":"remainingsources","value":162.1},{"type":"industry","value":47.1},{"type":"otherfires","value":48.89999999999999},{"type":"agrwasteburning","value":3.600000000000001},{"type":"energy","value":36.7},{"type":"agriculture","value":20.2},{"type":"afciddust","value":13.899999999999997}],"width":100,"height":100,"posX":475,"posY":33},{"region":"West Asia","types":[{"type":"waste","value":11.400000000000002},{"type":"windblowndust","value":311.70000000000005},{"type":"solvents","value":-0.7},{"type":"intlshipping","value":3},{"type":"transport","value":33.300000000000004},{"type":"residential","value":7.300000000000002},{"type":"othercombustion","value":1},{"type":"commercial","value":1.5},{"type":"remainingsources","value":10.200000000000001},{"type":"industry","value":30.499999999999996},{"type":"otherfires","value":0.5},{"type":"agrwasteburning","value":0.8},{"type":"energy","value":93.59999999999998},{"type":"agriculture","value":23.499999999999996},{"type":"afciddust","value":14.4}],"width":100,"height":100,"posX":549,"posY":257},{"region":"North America","types":[{"type":"waste","value":0.30000000000000004},{"type":"windblowndust","value":0.30000000000000004},{"type":"solvents","value":0},{"type":"intlshipping","value":0.30000000000000004},{"type":"transport","value":1.9},{"type":"residential","value":1.8},{"type":"othercombustion","value":0.8},{"type":"commercial","value":0.30000000000000004},{"type":"remainingsources","value":1.6},{"type":"industry","value":1.7000000000000002},{"type":"otherfires","value":2.2},{"type":"agrwasteburning","value":0.1},{"type":"energy","value":1.7000000000000002},{"type":"agriculture","value":1.7000000000000002},{"type":"afciddust","value":0.4}],"width":100,"height":100,"posX":10,"posY":337},{"region":"Polar","types":[{"type":"waste","value":0.1},{"type":"windblowndust","value":0.5},{"type":"solvents","value":0},{"type":"intlshipping","value":0.5},{"type":"transport","value":0.5},{"type":"residential","value":0.1},{"type":"othercombustion","value":0.1},{"type":"commercial","value":0},{"type":"remainingsources","value":1.1},{"type":"industry","value":0.2},{"type":"otherfires","value":1},{"type":"agrwasteburning","value":0},{"type":"energy","value":0.3},{"type":"agriculture","value":0.7},{"type":"afciddust","value":0.1}],"width":100,"height":100,"posX":266,"posY":272},{"region":"#N/A","types":[{"type":"waste","value":1},{"type":"windblowndust","value":1.6},{"type":"solvents","value":-0.1},{"type":"intlshipping","value":1},{"type":"transport","value":2.2},{"type":"residential","value":2.7},{"type":"othercombustion","value":0.2},{"type":"commercial","value":0.3},{"type":"remainingsources","value":1.6},{"type":"industry","value":3.2},{"type":"otherfires","value":0.3},{"type":"agrwasteburning","value":0.1},{"type":"energy","value":4},{"type":"agriculture","value":2.7},{"type":"afciddust","value":3.2}],"width":100,"height":100,"posX":495,"posY":42}],"scale_width":800,"scale_height":500}

    
    
    
    //Just for hardcode the position of each region on the map, once done delete /*ALX*/
    //Asia + Pacific
    data.regions[0].posX = 550;
    data.regions[0].posY = 150;
    data.regions[0].width = 175;
    data.regions[0].height = 250;

    //Europe
    data.regions[1].posX = 370;
    data.regions[1].posY = 105;
    data.regions[1].width = 150;
    data.regions[1].height = 100;

    //Africa
    data.regions[2].posX = 300;
    data.regions[2].posY = 230;
    data.regions[2].width = 150;
    data.regions[2].height = 200;

    //Latin America + Caribbean
    data.regions[3].posX = 85;
    data.regions[3].posY = 270;
    data.regions[3].width = 100;
    data.regions[3].height = 150;

    //West Asia
    data.regions[4].posX = 460;
    data.regions[4].posY = 250;
    data.regions[4].width = 75;
    data.regions[4].height = 50;

    //North America
    data.regions[5].posX = 60;
    data.regions[5].posY = 100;
    data.regions[5].width = 100;
    data.regions[5].height = 150;

    //Polar
    data.regions[6].posX = 190;
    data.regions[6].posY = 70;
    data.regions[6].width = 100;
    data.regions[6].height = 50;

    //N/A (Taiwan)
    data.regions[7].posX = 1500;
    data.regions[7].posY = 1500;

    //Remove N/A and polar
    data.regions.splice(6,2)


    let treemapData = {
        values : [],                                //Tree map data (CANVAS)
        treemapBackground : [],                     //If you wanna print a background on treemap should be the dimensions and coordinates here
    }

    let regionLeaves;                               //Treemap Leaves data (SVG)

    let cartogramConfiguration = {
        "width" : 600,                              //Cartogram width
        "height" : 400,                             //Cartogram height
        "current-data" : treemapData,               //Data used for the cartogram
        "data-scale-width" : data.scale_width,      //Data used scale width coordinates
        "data-scale-height" : data.scale_height     //Data used scale height coordinates
    }

    let currentRegionData = {
        region : "",                                //Curren region name selected
        type : "",                                  //Could be type of sector or fuel
        value: 0,                                   //Value of PM
        total: 0,                                   //Total value of emissions PM of the selected region
        current : {
            value : 0,                              //Emissions for the current selected sector/fuel on the current region
            type: ""                                //Type of sector or fuel
        }
    }

    let dataProcessed = false;                      //Wheter the data has been preocessed; False : No, True: Yes.

    /*************************************************************************/   
    /*                      FUNCTIONS IMPLEMENTATION                         */
    /*************************************************************************/
  

    /**************************************************************************
     * Function:    convertCoordinates(x:float, y:float)
     * Description: -Given the coordinates x, y make a propotional coordinates
     *              for the current canvas.
     * Parameters:  -(Float) x : coordinate x for the current region type
     *              -(Float) y : coordinate y for teh current region type
     * Return:      -(Object) {
     *                          x : float --> Converted x
     *                          y : float --> Converted y
     *                        }             
    **************************************************************************/
    let convertCoordinates = (x, y) => {
        //Check parameters
        if(isNaN(x)) return -1; //Not a number
        if(isNaN(y)) return -1; //Not a number*/
        
        let coordinates = {
            x : Number,
            y : Number
        }

        coordinates.x = (((x * 100) / cartogramConfiguration['data-scale-width']) * cartogramConfiguration['width'])/100;
        coordinates.y = (((y * 100) / cartogramConfiguration['data-scale-height']) * cartogramConfiguration['height'])/100;
 
        return coordinates;
    }



    /**************************************************************************
     * Function:    convertSize(width:float, height:float)
     * Description: -Given the width and height make a propotional size
     *              for the current canvas.
     * Parameters:  -(Float) width : width of the current region.
     *              -(Float) y : height of the current region.
     * Return:      -(Object) {
     *                          width : float --> Converted width
     *                          height : float --> Converted height
     *                        }             
    **************************************************************************/
    let convertSize = (width, height) => {
        //Check parameters
        if(isNaN(width)) return -1; //Not a number
        if(isNaN(height)) return -1; //Not a number*/
        
        let size = {
            width : Number,
            height : Number
        }

        size.width = (((width * 100) / cartogramConfiguration['data-scale-width']) * cartogramConfiguration['width'])/100;
        size.height = (((height * 100) / cartogramConfiguration['data-scale-height']) * cartogramConfiguration['height'])/100;

        return size;
    }



    /**************************************************************************
     * Function:    handleMouseOver()
     * Description: -This function is sended to the treemap is for handle
     *              the mouse over function on each section of region.
     * Parameters:  -(None).
     * Return:      -(None).         
    **************************************************************************/
    let handleMouseOver = (d) => {
        
        let parent = d3.select(d.path[1]);
        let elementRegion = parent.attr('id').replace('-elements','');
        
        let currentType = d3.select(d.target)
            .transition()
            .duration(250)
            .style('stroke', 'black')
            .style('stroke-linecap', 'butt')
            .style('stroke-width', '0.5')

      
    
            showSelectedRegionInformation('#' + elementRegion + '-background')

        
        

    }



    /**************************************************************************
     * Function:    handleMouseOut()
     * Description: -This function is sended to the treemap is for handle
     *              the mouse out function on each section of region.
     * Parameters:  -(None).
     * Return:      -(None).         
    **************************************************************************/
    let handleMouseOut = (d) => {
        let parent = d3.select(d.path[1]);
        let elementRegion = parent.attr('id').replace('-elements','');    
        
        let currentType = d3.select(d.target)
            .transition()
            .duration(250)
            .style('stroke', 'transparent')
        
        removeInformation('#' + elementRegion + "-background")
    
    }




    /**************************************************************************
     * Function:    handleMouseOverTreemap()
     * Description: -This function is sended to the treemap is for handle
     *              the mouse out function on each Treemap.
     * Parameters:  -(None).
     * Return:      -(None).         
    **************************************************************************/
    let handleMouseOverTreemap = (d) => {
        showSelectedRegionInformation(d.target);
    }





    /**************************************************************************
     * Function:    handleMouseOutTreemap(d:String)
     * Description: -This function is sended to the treemap is for handle
     *              the mouse out function on each Treemap.
     * Parameters:  -(String) d: Tag of the element.
     * Return:      -(None).         
    **************************************************************************/
    let handleMouseOutTreemap = (d) => {
        removeInformation(d.target);
    }





    /**************************************************************************
     * Function:    showSelectedRegionInformation(element)
     * Description: -This function is sended to the treemap is for handle
     *              the mouse out function on each Treemap.
     * Parameters:  -(None).
     * Return:      -(None).         
    **************************************************************************/
    let showSelectedRegionInformation = (element) => {

        let region = d3.select(element)
        /*region.transition()
            .duration(500)
            .style('fill', 'black')*/
       
     
        let svg = d3.select('#treemapCartogram');

        let x1 = +region.attr('x') + (+region.attr('width') * 0.1);
        let y1 = +region.attr('y');
        let x2 = x1;
        let y2 = y1 - (cartogramConfiguration['width'] * 0.05)

        svg.append('line')
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)
            .style("stroke", "black")
            .style("stroke-width", 0.5);
        

        svg.append("text")
        .attr("x", +region.attr('x'))
        .attr("y", y2 - 20)
        .attr("dy", "0em")
        .text("Most of the PM 2.5 in " + currentRegionData.region + " comes from");

        svg.append("text")
        .attr("x", +region.attr('x'))
        .attr("y", y2 - 20)
        .attr("dy", "1em")
        .text(currentRegionData.type + "--" + currentRegionData.value + " of the " + currentRegionData.total + " djf");

        svg.selectAll("text")
        .style("text-shadow", '0px 0px 3px #f3f3f3, 0px 0px 3px #f3f3f3, 0px 0px 3px #f3f3f3')
        .style("font-family", "Arial")
        .style("font-weight", "bold")
        .style("font-size", "8px")


    }

    /**************************************************************************
     * Function:    removeInformation(element)
     * Description: -This function is sended to the treemap is for handle
     *              the mouse out function on each Treemap.
     * Parameters:  -(None).
     * Return:      -(None).         
    **************************************************************************/
    let removeInformation = (element) => {
        /*d3.select(element)
            .transition()
            .duration(1000)
            .style('fill', '#f3f3f3')*/

        let svg = d3.select('#treemapCartogram');
        svg.select('line').remove();
        svg.selectAll('text').remove();
            
    }




    /**************************************************************************
     * Function:    getRegionFromData(regionName:String)
     * Description: -Get the data of a concrete region
     * Parameters:  -(String) regionName: Region to get the data
     * Return:      -(Object) {
     *                          region : string --> Region name
     *                          maxEmissionTypeName : string --> Max type that emits on this region
     *                          maxEmissionTypeValue : Float --> Value of max emissions
     *                        }          
    **************************************************************************/
    let getRegionFromData = (regionName) => {

        //Check paramaters
        if(regionName.lenght <= 0) return -1;       //Invalid regionName
        if(!dataProcessed) return -2;               //Data not processed 


        //Variable definition
        let returnRegion = {
            region : "",
            maxEmissionTypeName : "",
            maxEmissionTypeValue : 0
        }
        let regionFound = False;


        data.regions.forEach(region => {
            if(region.region == regionName){
                regionFound = true;
                returnRegion.region = region.region;
                returnRegion.maxEmissionTypeName = region.maxEmissionTypeName;
                returnRegion.maxEmissionTypeValue = region.maxEmissionTypeValue;
            }
        });

        return regionFound? returnRegion : -3       //Region not found       
    }







    /*************************************************************************/   
    /*                               CODE FLOW                               */
    /*************************************************************************/
    data.regions.forEach((region) => {
        
        //Create hierarchy for each node
        let hierarchy = d3.hierarchy(region, (node) => {

            return node.types;
        })
        .sum((node) => {
            return parseFloat(node.value);	
        }).sort((a,b) => {
            return parseFloat(b.value) - parseFloat(a.value);
        });
        
        //Create the tree map for the current region

        //Convert the size for the current canvas
        let canvasSizeElement = convertSize(region.width, region.height);
        
        if((canvasSizeElement < 0)) console.error("Size formating ERROR error code: " + canvasSizeElement + " function: convertSize()");
        
        //Create the treemap elements
        let createTreeMap = d3.treemap().size([canvasSizeElement.width, canvasSizeElement.height]).padding(2);
        
        createTreeMap(hierarchy);
        
        regionLeaves = hierarchy.leaves();
        
        //Extract each node (just for format)
        regionLeaves.forEach((e) => {
            let canvasCoordinates =  convertCoordinates(region.posX, region.posY);
            if(canvasCoordinates < 0) console.error("Coordinate X formating ERROR error code: " + canvasCoordinates + " fucntion convertCoordinates");
            var aux = {
                leave : e,
                regionX : canvasCoordinates.x,
                regionY : canvasCoordinates.y,
            }
            treemapData.values.push(aux);
        });
        
        //Prepare the background

        //Convert the coordinates
        let canvasCoordinates =  convertCoordinates(region.posX, region.posY);
        if(canvasCoordinates < 0) console.error("Coordinate X formating ERROR error code: " + canvasCoordinates + " fucntion convertCoordinates");

        let regionBackground = {
            borderTop  : 2,
            borderBottom: 2,
            borderLeft: 2,
            borderRight: 2,
            x: canvasCoordinates.x,
            y: canvasCoordinates.y,
            width: canvasSizeElement.width,
            height: canvasSizeElement.height,
            color: "#f3f3f3",
            region: region.region
        }
        treemapData.treemapBackground.push(regionBackground);

        //Prepare the data
        data.regions.forEach(region => {
            let maxEmissionTypeValue = 0;
            let maxEmissionTypeName = "";
            region.types.forEach(type => {
                if(type.value > maxEmissionTypeName){
                    maxEmissionTypeValue = type.value;
                    maxEmissionTypeName = type.type;
                }
            })
            region.maxEmissionTypeName = maxEmissionTypeName;
            region.maxEmissionTypeValue = maxEmissionTypeValue;
        })
        dataProcessed = true;
    })

/******************************************************************************
 *                            REACTIVE VARIABLES                              *
******************************************************************************/


</script>





<!---------------------------------------------------------------------------->
<!--                               HTML                                     -->
<!---------------------------------------------------------------------------->
<p>Aleeeeluiaa</p>
<!--<TreemapCanvas 
    data = {cartogramConfiguration['current-data']}
    width = {cartogramConfiguration['width']}
    height = {cartogramConfiguration['height']}
/>-->
<TreemapSvg
    data = {cartogramConfiguration['current-data']}
    width = {cartogramConfiguration['width']}
    height = {cartogramConfiguration['height']}
    handleMouseOver = {handleMouseOver}
    handleMouseOut = {handleMouseOut}
    handleMouseOverTreemap = {handleMouseOverTreemap}
    handleMouseOutTreemap = {handleMouseOutTreemap}
    currentRegionData = {currentRegionData}
/>





<!---------------------------------------------------------------------------->
<!--                                 CSS                                    -->
<!---------------------------------------------------------------------------->
<style>

</style>