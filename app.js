// Initialize leaflet.js
var L = require('leaflet');

// Initialize the map
var map = L.map('map', {
  scrollWheelZoom: true
});

// Set the position and zoom level of the map
map.setView([23, 82], 5);

/*	Variety of base layers */
var osm_mapnik = L.tileLayer('', {
  maxZoom: 10,
  minZoom: 4,
  attribution: '&copy; OSM Mapnik <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

geojson = L.geoJson(india, {
  style: style
}).addTo(map);

function style(feature) {
  return {
    weight: 2,
    opacity: 0.7,
    color: 'white',
    dashArray: '2',
    fillOpacity: 0.7,
    fillColor: getColor(feature.properties.NAME_1) || '#fef0d9'
  };
}
var baseLayers = {
  "OSM Mapnik": osm_mapnik,
};
// Add baseLayers to the map

var overLayers = {
  "Indian States": geojson
};
// Add geoJSON to the map

L.control.layers(baseLayers, overLayers).addTo(map);

function getColor(name) {
  for (i in coviddata) {
    if (name == coviddata[i]['state']) {
      return coviddata[i]['color']
    }
  }
}
