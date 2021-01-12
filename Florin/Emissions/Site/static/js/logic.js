// Creating map object
var myMap = L.map("map", {
  center: [38.8659868,-103.6690731],
  zoom: 3
});

// Adding tile layer
// L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "mapbox.streets",
//   accessToken: API_KEY
// }).addTo(myMap);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);



// Load in geojson data
// var geoData = "static/data/Median_Household_Income_2016.geojson";
var geoData = "static/data/gz_2010_us_040_00_20m.geojson";

L.geoJson(geoData).addTo(myMap)

// function getColor(d) {
//   return d > 0.5 ? '#800026' :
//          d > 0.6  ? '#BD0026' :
//          d > 0.7  ? '#E31A1C' :
//          d > 0.8  ? '#FC4E2A' :
//          d > 0.9   ? '#FD8D3C' :
//          d > 1   ? '#FEB24C' :
//          d > 2   ? '#FED976' :
//                     '#FFEDA0';
// }


// var geojson;



// // Grab data with d3
// d3.json(geoData, function(data) {

//   //get petroleum price data
//   price_path = "/api/v1.0/price_data"
//   d3.json(price_path, function(priceData){

//     function listLoop(data, priceData){ 
//       for (var i = 0; i < priceData.state_code.length; i++) {

//         for (var j = 0; j < priceData.state_code[i].length; j++) {
//           for (var k = 0; k < data.features.length; k++)
//             if (data.features[k].properties.STATE == priceData.state_code[i]){
//               data.features[k].properties.price =  priceData.data[i][5][1]
//               data.features[k].properties.date =  priceData.data[i][5][0]
//               console.log(data.features[k].properties.price);
//               break
//             }
//             else{
//               data.features[k].properties.price = "1"
//             }
          
//         }

//       }
//     return data
//     }

//     data = listLoop(data, priceData[0])
    
//     console.log("priceData", priceData)
//     console.log("data", data)
//     // Create a new choropleth layer
//     geojson = L.choropleth(data, {
      
//       // Define what  property in the features to use
//       valueProperty: "price",

//       // Set color scale
//       scale: ["#ffffb2", "#b10026"],

//       // Number of breaks in step range
//       steps: 0.01,

//       // q for quartile, e for equidistant, k for k-means
//       mode: "q",
//       style: {
//         // Border color
//         fillColor: getColor(valueProperty),
//         color: "#fff",
//         weight: 1,
//         fillOpacity: 0.8
//       },

//       // Binding a pop-up to each layer
//       onEachFeature: function(feature, layer) {
//         layer.bindPopup("State: " + feature.properties.NAME + "<br>CensusArea:<br>" +
//           "$" + feature.properties.price);
//       }
//     }).addTo(myMap);

//     // Set up the legend
//     var legend = L.control({ position: "bottomright" });
//     legend.onAdd = function() {
//       var div = L.DomUtil.create("div", "info legend");
//       var limits = geojson.options.limits;
//       var colors = geojson.options.colors;
//       var labels = [];

//       // Add min & max
//       var legendInfo = "<h1>Median Income</h1>" +
//         "<div class=\"labels\">" +
//           "<div class=\"min\">" + limits[0] + "</div>" +
//           "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
//         "</div>";

//       div.innerHTML = legendInfo;

//       limits.forEach(function(limit, index) {
//         labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
//       });

//       div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//       return div;
//     };

//     // Adding legend to the map
//     legend.addTo(myMap);
//   })
// });
