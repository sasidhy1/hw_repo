function magColor(val) {
  switch (Math.floor(val)) {
    case 0: color = "#B7F34D";
      break;
    case 1: color = "#E1F34D";
      break;
    case 2: color = "#F3DB4D";
      break;
    case 3: color = "#F3BA4D";
      break;
    case 4: color = "#EE834F";
      break;
    case 5: color = "#EC4646";
  }
  return color;
}

var url1 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// var url2 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

d3.json(url1, function(data) {
  earthquakes = createFeatures(data.features);
});


function createFeatures(earthquakeData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.mag + " Earthquake, " + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
			radius: feature.properties.mag*4,
			fillColor: magColor(feature.properties.mag),
			color: "#000",
			weight: 0.5,
			opacity: 1,
			fillOpacity: 0.8
        });
    }
  });

  createMap(earthquakes);
}

function createMap(earthquakes) {

  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Satellite Map": satellitemap
  };

  var overlayMaps = {
    Earthquakes: earthquakes,
  };

  var map = L.map("map", {
	center: [40, -100],
	zoom: 4.1,
    layers: [streetmap, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = [];
    var labels = ["0-1","1-2","2-3","3-4","4-5","5+"];
    
    var legendInfo = "<p>Magnitude Scale</p>"

    div.innerHTML = legendInfo;
    
    labels.forEach(function(label, index) {
      limits.push("<li style=\"background-color: " + magColor(index) + "\">" + label + "</li>");
    });
    
    div.innerHTML += "<ul>" + limits.join("") + "</ul>";
    
    return div;
  };
  
  // Adding legend to the map
  legend.addTo(map);
}