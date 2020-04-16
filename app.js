//Fetching recent data
//
const api_url = "https://api.rootnet.in/covid19-in/stats/latest";
var coviddata = [];

const dis_url = "https://api.covid19india.org/state_district_wise.json";
var covidDisData = {};

async function getCases() {
    //STATE DATA FETCH
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

        if (details["conf"] < 50) {
            details["color"] = "#fff7ec";
        } else if (details["conf"] >= 50 && details["conf"] < 100) {
            details["color"] = "#fee8c8";
        } else if (details["conf"] >= 100 && details["conf"] < 250) {
            details["color"] = "#fdd49e";
        } else if (details["conf"] >= 250 && details["conf"] < 500) {
            details["color"] = "#fdbb84";
        } else if (details["conf"] >= 500 && details["conf"] < 750) {
            details["color"] = "#fc8d59";
        } else if (details["conf"] >= 750 && details["conf"] < 1000) {
            details["color"] = "#ef6548";
        } else if (details["conf"] >= 1000 && details["conf"] < 1500) {
            details["color"] = "#d7301f";
        } else if (details["conf"] >= 1500 && details["conf"] < 2000) {
            details["color"] = "#b30000";
        } else {
            details["color"] = "#8a0000";
            // details["color"] = "#000000";
        }
        coviddata.push(details);
    }
    const response2 = await fetch(dis_url);
    const disData = await response2.json();
    // Array of statenames
    stateNames = Object.keys(disData);

    for (ind = 0; ind < stateNames.length; ind++) {
        disNames = Object.keys(disData[stateNames[ind]]["districtData"]);
        covidDisData[stateNames[ind]] = [];

        for (i = 0; i < disNames.length; i++) {
            disDetails = {};
            disDetails["districtName"] = disNames[i];
            disDetails["conf"] = Number(
                disData[stateNames[ind]]["districtData"][disNames[i]][
                    "confirmed"
                ]
            );
            if (disDetails["conf"] < 50) {
                disDetails["color"] = "#fff7ec";
            } else if (disDetails["conf"] >= 50 && disDetails["conf"] < 100) {
                disDetails["color"] = "#fee8c8";
            } else if (disDetails["conf"] >= 100 && disDetails["conf"] < 150) {
                disDetails["color"] = "#fdd49e";
            } else if (disDetails["conf"] >= 150 && disDetails["conf"] < 200) {
                disDetails["color"] = "#fdbb84";
            } else if (disDetails["conf"] >= 200 && disDetails["conf"] < 500) {
                disDetails["color"] = "#fc8d59";
            } else if (disDetails["conf"] >= 500 && disDetails["conf"] < 750) {
                disDetails["color"] = "#ef6548";
            } else if (disDetails["conf"] >= 750 && disDetails["conf"] < 1000) {
                disDetails["color"] = "#d7301f";
            } else if (
                disDetails["conf"] >= 1000 &&
                disDetails["conf"] < 1500
            ) {
                disDetails["color"] = "#b30000";
            } else {
                disDetails["color"] = "#8a0000";
            }
            covidDisData[stateNames[ind]].push(disDetails);
        }
    }
}
var stateJson = {
    "Andaman and Nicobar Islands": "andamannicobarislands_district.json",
    "Andhra Pradesh": "andhrapradesh_district.json",
    "Arunachal Pradesh": "arunachalpradesh_district.json",
    Assam: "assam_district.json",
    Bihar: "bihar_district.json",
    Chhattisgarh: "chhattisgarh_district.json",
    Delhi: "delhi_district.json",
    Goa: "goa_district.json",
    Gujarat: "gujarat_district.json",
    Haryana: "haryana_district.json",
    "Himachal Pradesh": "himachalpradesh_district.json",
    "Jammu and Kashmir": "jammukashmir_district.json",
    Jharkhand: "jharkhand_district.json",
    Karnataka: "karnataka_district.json",
    Kerala: "kerala_district.json",
    Ladakh: "ladakh_district.json",
    "Madhya Pradesh": "madhyapradesh_district.json",
    Maharashtra: "maharashtra_district.json",
    Manipur: "manipur_district.json",
    Meghalaya: "meghalaya_district.json",
    Mizoram: "mizoram_district.json",
    Nagaland: "nagaland_district.json",
    Odisha: "odisha_district.json",
    Punjab: "punjab_district.json",
    Rajasthan: "rajasthan_district.json",
    Sikkim: "sikkim_district.json",
    "Tamil Nadu": "tamilnadu_district.json",
    Telangana: "telangana_district.json",
    Tripura: "tripura_district.json",
    Uttarakhand: "uttarakhand_district.json",
    "Uttar Pradesh": "uttarpradesh_district.json",
    "West Bengal": "westbengal_district.json",
};
getCases().then((response) => {
    // Initialize leaflet.js
    var L = require("leaflet");
    var Chart = require("chart.js");
    // Initialize the map
    var map = L.map("map", {
        scrollWheelZoom: true,
    });
    // map.dragging.disable();s
    // Set the position and zoom level of the map
    map.setView([23, 90], 4.5);

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
            fillColor: getColor(feature.properties.NAME_1) || "#b39c68",
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
    function fetchJSON(url) {
        return fetch(url).then(function (response) {
            return response.json();
        });
    }
    var stateLevel = false;

    async function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
        var clickedState = e.target.feature.properties.NAME_1;
        var url = "/data/stateJsonData/" + stateJson[clickedState];
        var clickedStateJson = await fetchJSON(url);
        map.removeLayer(geojson);
        stateLevel = true;
        stateLevelJson = L.geoJson(clickedStateJson, {
            style: style,
            onEachFeature: onEachFeature,
        }).addTo(map);
    }
    function checkState() {
        var zoom = map.getZoom();
        if (stateLevel === true && zoom < 6) {
            map.addLayer(geojson);
            map.removeLayer(stateLevelJson);
            map.setView([23, 90], 4.5);
        }
    }
    setInterval(checkState, 1000);
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
            legend: {
                display: true,
                labels: {
                    fontSize: 40,
                },
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [
                    {
                        ticks: {
                            fontSize: 40,
                        },
                    },
                ],
                yAxes: [
                    {
                        ticks: {
                            fontSize: 40,
                            beginAtZero: true,
                        },
                    },
                ],
            },
        },
    });
});
