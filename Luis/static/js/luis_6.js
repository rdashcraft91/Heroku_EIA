
function buildEnergyPricesPlot() {
    var dataUrl = '/api/v1.0/energy_prices';

    d3.json(dataUrl).then(function(data) {

    // D3 select tag
    var dropdownMenu = d3.select("#selElectricPrices");
    // Assign the value of the dropdown menu option to a variable
    var category_selection = dropdownMenu.property("value");
    // Set up data for production and consumption
    var residentialData = data[0];
    var commercialData = data[1];
    var industrialData = data[2];
    var allData = data[3];
    var dataset = []

    console.log(commercialData);

    // Choose Dataset based on selection    
    if (category_selection == 'residential') {

        dataset = residentialData;
        var titleName = "Residential Electricity Prices";
    }

    else if(category_selection == 'commercial') {

        dataset = commercialData;
        var titleName = "Commercial Electricity Prices";
    }

    else if(category_selection == 'industrial') {

        dataset = industrialData;
        var titleName = "Industrial Electricity Prices";
    }

    else if(category_selection == 'all') {

        dataset = allData;
        var titleName = "TotalElectricity Prices";
    }

    // Loop through keys in dataset and delete _id key so we dont plot it
    var keys = Object.keys(dataset)
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] === '_id') {
        keys.splice(i, 1);
        }
    };

    // Plot chart
    var traces = []

    // Loop through each key in dictionary and create a trace which is stored in traces (list)
    keys.forEach(function(key){
      var trace = {
        type: "scatter",
        mode: "lines",
        name: key,
        x: dataset[key].data.map(row => row[0]),
        y: dataset[key].data.map(row => row[1])
      }
      traces.push(trace)

    });

    // Create properties for layout of graph
    var layout = {
      title: titleName,
      xaxis: {
        title: "Year",
        type: "date",
      },
      yaxis: {
        title: 'Cents Per kWh',
        autorange: true,
        type: "linear"
      }
    };

    Plotly.newPlot("Electricplot", traces, layout);

  });
}

// On change to the DOM, call buildEnergyPlot()
d3.selectAll("#selElectricPrices").on("change", buildEnergyPricesPlot());


buildEnergyPricesPlot();
