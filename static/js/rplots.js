// // Get Data for All State's Renewable Energy Use
var StateUrl = `/api/v1.0/state_energy`;

d3.json(StateUrl).then(function (data) {
  
  console.log(data);
  // Delete id field in State Data
  delete data[0]._id;
  delete data[1]._id;
  delete data[2]._id;

  console.log(data[0]);

  buildStateSunburstPlot(data[0]);

  // Create List of All States
  var allStateData = data[0];
  var allStates = Object.keys(allStateData);

  // Call function to populate dropdownlist with years in data set
  PopulateDropDownStates(allStates);   

  // Send State Data to State Bar
  buildStateBar();

  // Sent Production Data to Production Plot
  buildProductionPlot(data[1], data[2]);

  // console.log(allStates);
});

function buildStateSunburstPlot(data) {

  console.log(data);

  var consumption_data = data;

  var consumption_entries = Object.entries(consumption_data);

  console.log(consumption_entries);

  var commonSource = []

  consumption_entries.forEach(function(state){
      
      console.log(state);

      console.log(state[1]);
      var sourceStates = state[1];
      console.log(sourceStates);
      var maxSource = Object.keys(sourceStates).reduce((a, b) => sourceStates[a] > sourceStates[b] ? a : b);
      console.log(`${state[0]}: ${maxSource}`);
      var new_result = {};
      new_result[`${state[0]}`] = maxSource
      new_result['BTU'] = sourceStates[`${maxSource}`]
      commonSource.push(new_result);
    });
  
  console.log(commonSource);
  
  // var traces = []

  var labels = []
  var parents = []
  var values = []
  labels.push("Renewable Sources");

  var bioTotal = 0;
  var hydroTotal = 0;
  var geoTotal = 0;
  var solarTotal = 0;
  var windTotal = 0;

  commonSource.forEach(function(result) {
    if (Object.values(result)[0] === 'Biomass') {
      bioTotal += Object.values(result)[1];
    }
    else if (Object.values(result)[0] === 'Hydro') {
      hydroTotal += Object.values(result)[1];
    }
    else if (Object.values(result)[0] === 'Geothermal') {
      geoTotal += Object.values(result)[1];
    }
    else if (Object.values(result)[0] === 'Solar') {
      solarTotal += Object.values(result)[1];
    }
    else {
      windTotal += Object.values(result)[1];
    }
  })
  
  commonSource.forEach(function (result){
    if (labels.includes(Object.values(result)[0])) {
      
    }
    else {
      labels.push(Object.values(result)[0]);
    }
  });

  parents.push("", "Renewable Sources", "Renewable Sources", "Renewable Sources", "Renewable Sources");
  values.push("", hydroTotal, bioTotal, solarTotal, windTotal);

  commonSource.forEach(function(result) {
        
    labels.push(Object.keys(result)[0]);
    parents.push(Object.values(result)[0]);
    values.push(Object.values(result)[1]);
      
  });
  
  console.log(labels, parents, values)
  
  var data = [
    {
      "type": "sunburst",
      "labels": labels,
      "parents": parents,
      "values":  values,
      "leaf": {"opacity": 0.4},
      "marker": {"line": {"width": 2}},
      "branchvalues": 'total',
      "insidetextorientation": "horizontal"
    }];  
  var layout = {
    "margin": {"l": 0, "r": 0, "b": 0, "t": 30},
    "title": "Most Used Renewable Energy Source by State",
    sunburstcolorway:['#8c564b', '#7f7f7f', '#e377c2', '#bcbd22']
  };

  Plotly.newPlot('totalStateplot', data, layout, {showSendToCloud: true})
  
};

// Populate Dropdown with List of States
function PopulateDropDownStates(statesDropDown) {

// Create variable containing the selected id 
var ddlIDs = document.getElementById("selStateEnergy");

// ddlIDs.options.length = 0;

console.log(statesDropDown);

// Loop through and add each year to the DropDownList
statesDropDown.forEach((state) => {
    // Create an option tag
  var option = document.createElement("OPTION");
  // Set subject ID in text property
  option.innerHTML = state;
  // Set subject ID in value property
  option.value = state;
  // Add the option element to DropDownList
  ddlIDs.options.add(option);
  });
};

// Build Bar Chart for Each State's Usage
function buildStateBar() {

d3.json(StateUrl).then(function (data) {

  // Delete id field in State Data
  delete data[0]._id;

  // Create List of All States
  var allStateData = data[0];

  console.log(allStateData); 

  // D3 select tag
  var dropdownMenu = d3.select("#selStateEnergy");

  // Assign the value of the dropdown menu option to a variable
  var stateSelection = dropdownMenu.property("value");

  console.log(stateSelection);

  var stateEntries = Object.entries(allStateData); 

  console.log(stateEntries);

  var barBio = 0;
  var barGeo = 0;
  var barHydro = 0;
  var barSolar = 0;
  var barWind = 0;

  stateEntries.forEach(function(state){
      
    var stateData = Object.values(state);

    barBio += Object.values(stateData[1])[0];
    barGeo += Object.values(stateData[1])[1];
    barHydro += Object.values(stateData[1])[2];
    barSolar += Object.values(stateData[1])[3];
    barWind += Object.values(stateData[1])[4];
  
  });


  stateEntries.forEach(function(state){
    
    var stateData = Object.values(state);

    if (stateSelection === state[0]) {
 
      console.log(stateData);

      var titleBar = `${state[0]} Renewable Energy Use`
      var trace = {
        type: "bar",
        x: Object.keys(stateData[1]),
        y: Object.values(stateData[1]),
        marker:{
          color: ['#8c564b', '#17becf', '#7f7f7f', '#bcbd22', '#e377c2']
        }
      }
      console.log(trace);
      var data = [trace];
      // Create Layout
      var layout = {
        title: titleBar,
        xaxis: {
          title: "Energy Source",
        },
        yaxis: {
          title: 'British Thermal Units (BTU)',
          autorange: true,
        }
      };

      // Add Plot
      Plotly.newPlot("stateBar", data, layout);
    }
    else if (stateSelection === 'All') {

      var titleBar = `All States Renewable Energy Use`
      var trace = {
        type: "bar",
        x: Object.keys(stateData[1]),
        y: [barBio, barGeo, barHydro, barSolar, barWind],
        marker:{
          color: ['#8c564b', '#17becf', '#7f7f7f', '#bcbd22', '#e377c2']
        }
      }
      var data = [trace];
      // Create Layout
      var layout = {
        title: titleBar,
        xaxis: {
          title: "Energy Source",
        },
        yaxis: {
          title: 'British Thermal Units (BTU)',
          autorange: true,
        }
      };
      // Add Plot
      Plotly.newPlot("stateBar", data, layout);
    }
  })  
});
}

function buildProductionPlot(production, population){
    console.log(production);
    state_production = Object.entries(production);
    state_population = Object.entries(population)
    var dataset = [];
    var labels = [];
    var colors=[];
    var nColors=50;

    for (var i=0; i<nColors; i++)
      colors.push('#'+Math.floor(Math.random()*16777215).toString(16));
    var ctx = document.getElementById('stateProdPlot').getContext('2d');

    state_production.forEach(function(state){
      var x_value = {'y': state[1]} 
      dataset.push(x_value);
    })

    state_production.forEach(function(state){
      labels.push(state[0]);
    })

    // console.log(labels);

    // console.log(dataset);

    for (var i=0; i < 51; i++) {
      // var y_value = {'y': state_population[1][i]}
      dataset[i]['x'] = (state_population[i][1])
    }
    
    console.log(dataset);
    var polarArea = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
            // label: ,
            data: dataset,
            // backgroundColor: ['Red', 'Red', 'Red', 'Red', 'Blue', 'Blue', 'Blue', 'Blue', 'Blue', 'Red', 'Red', 'Blue', 'Red', 'Red', 'Blue', 'Red', 'Red', 'Red', 'Red', 'Blue', 'Blue', 'Blue', 'Red', 'Blue', 'Red', 'Red', 'Red', 'Red', 'Red', 'Red', 'Blue', 'Blue', 'Blue', 'Blue', 'Blue', 'Red', 'Red', 'Blue', 'Red', 'Blue', 'Red', 'Red', 'Red', 'Red', 'Red', 'Blue', 'Blue', 'Blue', 'Red', 'Red', 'Red'],
            backgroundColor: colors,
            pointRadius: 10,
        }],
        labels: labels,
    },
    options: {
      tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              var label = data.labels[tooltipItem.index];
              return label + ': (' + tooltipItem.xLabel + ', ' + tooltipItem.yLabel + ')';
            }
          }
        },
      legend: {
          display: false,
      },
      title: {
        text: 'Total Renewable Energy Production by State Population',
        fontSize: 24,
        fontStyle: 'bold',
        display: true,
      },
      scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom',
                scaleLabel: {
                  display: true,
                  labelString: 'State Population'
                }
            }], 
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'British Thermal Units (BTU) Produced'
              }
          }], 
        }
    }
});
}