//Fetching recent data

const api_url = "https://api.rootnet.in/covid19-in/stats/latest";
var coviddata = [];
async function getCases() {
    const response = await fetch(api_url);
    const data = await response.json();
    // console.log(data.data.regional);
    for (ind = 0; ind <= 32; ind++) {
        var details = {};
        details["state"] = data.data.regional[ind].loc;
        details["conf"] =
            data.data.regional[ind].confirmedCasesIndian +
            data.data.regional[ind].confirmedCasesForeign;
        details["cured"] = data.data.regional[ind].discharged;
        details["deaths"] = data.data.regional[ind].deaths;

        if (details["conf"] < 100) {
            details["color"] = "#fef0d9";
        } else if (details["conf"] >= 100 && details["conf"] < 500) {
            details["color"] = "#fdcc8a";
        } else if (details["conf"] >= 500 && details["conf"] < 1000) {
            details["color"] = "#fc8d59";
        } else if (details["conf"] >= 1000 && details["conf"] < 2000) {
            details["color"] = "#e34a33";
        } else {
            details["color"] = "#b30000";
        }
        coviddata.push(details);
    }
}

getCases().then((response) => {
    // Initialize leaflet.js
    var L = require("leaflet");
    var Chart = require("chart.js");
    // Initialize the map
    var map = L.map("map", {
        scrollWheelZoom: true,
    });
    map.dragging.disable();
    // Set the position and zoom level of the map
    map.setView([23, 82], 5);

    /*	Variety of base layers */
    var osm_mapnik = L.tileLayer("", {
        maxZoom: 10,
        minZoom: 5,
        attribution:
            '&copy; OSM Mapnik <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    geojson = L.geoJson(india, {
        style: style,
        onEachFeature: onEachFeature,
    }).addTo(map);

    function style(feature) {
        return {
            weight: 2,
            opacity: 0.7,
            color: "white",
            dashArray: "2",
            fillOpacity: 0.7,
            fillColor: getColor(feature.properties.NAME_1) || "#fef0d9",
        };
    }
    var baseLayers = {
        "OSM Mapnik": osm_mapnik,
    };
    // Add baseLayers to the map

    var overLayers = {
        "Indian States": geojson,
    };
    // Add geoJSON to the map

    L.control.layers(baseLayers, overLayers).addTo(map);

    function getColor(name) {
        for (i in coviddata) {
            if (name == coviddata[i]["state"]) {
                return coviddata[i]["color"];
            }
        }
    }
    function getStateData(name) {
        for (i in coviddata) {
            if (name == coviddata[i]["state"]) {
                return coviddata[i];
            }
        }
    }
    function getFatData(name) {
        for (i in cnExpFat) {
            if (name == cnExpFat[i]["state"]) {
                return cnExpFat[i]["expNum"];
            }
        }
    }
    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature,
        });
    }
    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }
    function resetHighlight(e) {
        geojson.resetStyle(e.target);
    }
    function highlightFeature(e) {
        var layer = e.target;
        layer.setStyle({
            weight: 5,
            color: "#666",
            dashArray: "",
            fillOpacity: 0.7,
        });
        var stateData = getStateData(layer.feature.properties.NAME_1);
        var stateName = stateData["state"];
        var fatalityData = getFatData(stateName);
        myChart.data.datasets[0]["data"] = fatalityData;
        myChart.update();
        document.getElementById("stat").innerHTML =
            "<h3>" +
            stateName +
            "</h3><br>Confirmed: " +
            stateData["conf"] +
            "<br>Deaths: " +
            stateData["deaths"] +
            "<br>Recovered: " +
            stateData["cured"] +
            "<br>";

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }

    var ctx = document.getElementById("myChart").getContext("2d");
    var myChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: [
                "0-9",
                "10-19",
                "20-29",
                "30-39",
                "40-49",
                "50-59",
                "60-69",
                "70-79",
                "80-89",
                "90+",
            ],
            datasets: [
                {
                    label: "Expected Number of Deaths at 100% infection",
                    backgroundColor: [
                        "red",
                        "red",
                        "red",
                        "red",
                        "red",
                        "red",
                        "red",
                        "red",
                        "red",
                    ],
                    data: cnExpFat[1].expNum,
                    borderWidth: 1,
                },
            ],
        },
        options: {
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                        },
                    },
                ],
            },
        },
    });
});
