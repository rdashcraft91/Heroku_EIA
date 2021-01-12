
Plotly.d3.json("/api/v1.0/price_data", function(err, rows){

    //restructured dataset
    dbDataSet = listLoop(rows[0])

    //function used to feed data to plotly charts
    function unpack(rows, key) {

        rows = dbDataSet

    return rows.map(function(row) { 
        return row[key]; });
    }

    //function to transform structure of the data loaded
    //to adapt to the plotly input format
    function listLoop(inputData){ 
        var outputData = []
        for (var i = 0; i < inputData.state.length; i++) {

            var max_loop 
            
            if (Array.isArray(inputData.state[i])) {
                    max_loop = inputData.state[i].length;
                }
                else{max_loop = 1}

            for (var j = 0; j < max_loop; j++) {
                    var object = {}
                    object.formulation = inputData.formulation[i]
                    object.fuel = inputData.fuel[i]
                    object.grade = inputData.grade[i]
                    object.state = inputData.state[i][j] 
                    object.priceList = inputData.data[i]
                    outputData.push(object)  
            }
        }
        return outputData    
    }

    //function to apply filters to get data needed for the charts
    function applyFilters(inputData, filters){

        inputData = inputData.filter(function(item) {
            for (var key in filters) {
                if (item[key] === undefined || item[key] != filters[key])
                return false;
            }
            return true;
            })
        return inputData
    }

    //filters applied on db data, to display the chloropleth chart
    var dataChloroplethFilters = {
        "formulation" : "All Formulations",
        "fuel" : "gasoline",
        "grade" : "All Grades",
    }

    //title of the chloropleth chart
    titleChloropleth = `Prices of ${dataChloroplethFilters.fuel} (USD/gal), `+
    `${dataChloroplethFilters.formulation}, `+
    `${dataChloroplethFilters.grade}`

    //data for cloropleth chart
    cloroplethDataSet = applyFilters(dbDataSet, dataChloroplethFilters)
    locationsDataSet = unpack(cloroplethDataSet, 'state')

    //get index for date from dataset used further to return the price
    function getDateIndex(cloroplethDataSet, dateSelection){
            zAllDataset = unpack(cloroplethDataSet, 'priceList')
            // console.log("zAllDataset", zAllDataset)
            zDisplayedIndex = zAllDataset[0].map(function(item,index){
                if (item[0] == dateSelection){
                    return index
                }
            })
            return zDisplayedIndex = zDisplayedIndex.filter(function(item){
                return item !== undefined
            })[0]
    }

    //starting date of the Chloropleth chart
    dateSelection = "20030526"

    //date index to take the price
    zDisplayedIndex = getDateIndex(cloroplethDataSet, dateSelection)

    //date dataset
    zDateDataSet = zAllDataset[0].map(function(row,index){
        return date = row[0]})

    zPriceDataSet = cloroplethDataSet.map(function(item){
        return item["priceList"][zDisplayedIndex][1]
    })

    //define all the frames for the chloropleth chart time slider 
    var framesCloropleth = zDateDataSet.map(function(item){
        index = getDateIndex(cloroplethDataSet,item)
        var object = {}
        try{
            object.data = [{"z" : cloroplethDataSet.map(function(item){
                return item["priceList"][index][1].toString()}
                )}]

        object.traces = [0]
        object.name = item
        //object.layout = {title: titleChloropleth}
        return object 
        }

        catch{
        }
    })
    //clean frames without data
    framesCloropleth = framesCloropleth.filter(function(item){
        return item !== undefined
    })

    //sort frames in ascending order
    framesCloropleth = framesCloropleth.sort(function(a, b){
        if (parseInt(a.name) < parseInt(b.name)){
            return -1
        }
        if (parseInt(a.name) > parseInt(b.name)){
            return 1
        }
        return 0
        
    })

    //define the chloropleth slider properties
    slidersCloropleth = [{
        currentvalue: {
          prefix: 'Date: ',
        },
        steps: framesCloropleth.map(f => ({
          label: f.name.slice(0, 4)+"-"+f.name.slice(4, 6)+"-"+f.name.slice(6, 8),
          method: 'animate',
          args: [[f.name], {frame: {duration: 0}}]
        }))
      }]
    
    //define the preliminary data to be used in the chloropleth
    var dataChloropleth = [{
        type: 'choropleth',
        locationmode: 'USA-states',
        locations: locationsDataSet,
        z: zPriceDataSet,
        text: '$/gal',
        autocolorscale: true
    }];

    //define the layout of the chloropleth chart
    var layoutChloropleth = {
    title: titleChloropleth,
        geo:{
            scope: 'usa',
            countrycolor: 'rgb(255, 255, 255)',
            showland: true,
            landcolor: 'rgb(217, 217, 217)',
            showlakes: true,
            lakecolor: 'rgb(255, 255, 255)',
            subunitcolor: 'rgb(255, 255, 255)',
            lonaxis: {},
            lataxis: {},
        },
        xaxis: {autorange: false},
        yaxis: {autorange: false},
        sliders: slidersCloropleth
    };

    //plot the chloropleth chart
    Plotly.plot('map', {
        data: dataChloropleth,
        layout: layoutChloropleth,
        frames: framesCloropleth,
        config: {showLink: false}
    });

    //build line chart

    //define filters from the data loaded
    var dataLineFilters = {
        "formulation" : "All Formulations",
        "fuel" : "gasoline",
        "grade" : "All Grades",
        "state" : "USA"
    }
 
    //filter dataset for line chart
    var lineDataSet = applyFilters(dbDataSet, dataLineFilters)

    var dateAxis = lineDataSet[0]["priceList"].map(function(row,index){
        try{
            date = 
                row[0].slice(0, 4)+"-"+
                row[0].slice(4, 6)+"-"+
                row[0].slice(6, 8)//+" 00:00:00"
            //console.log(date)
        }
        catch (err){
            console.log("row" , row, "errorindex =" , index)
        }
        return date})
    
    
    priceAxis = lineDataSet[0]["priceList"].map(function(row){return row[1]}),

    dataLineChart = [{
        x: dateAxis,
        y: priceAxis,
        type: 'scatter'
      }]
    
    var layoutLineChart = {
        title: `Prices of ${dataLineFilters.fuel}, `+
        `${dataLineFilters.formulation}, `+
        `${dataLineFilters.grade} in ${dataLineFilters.state}`,
        xaxis: {
            rangeslider: {},
            title : {text :"Date"}
        },
        yaxis: {
            fixedrange: true,
            title : {text :"Price [$/gal]"}
        }
    };
    
    
    Plotly.newPlot('chart', dataLineChart , layoutLineChart);
    
}); 

