//Fetching recent data
//
const api_url = "https://api.rootnet.in/covid19-in/stats/latest";
var coviddata = [];
const dis_url = "https://api.covid19india.org/state_district_wise.json";
var covidDisData = {};
var indData = {};

var ChartFont = 15;

async function getCases() {
    // india total api ..............................
    const response = await fetch(api_url);
    const data = await response.json();
    // console.log(data.data.summary);
    indData['conf'] = data.data.summary.total;
    indData['death'] = data.data.summary.deaths;
    indData['rec'] = data.data.summary.discharged;
    document.getElementById("stat").innerHTML =
        "<h3> India Total" +
        "</h3><br>Confirmed: " +
        indData['conf'] +
        "<br>Deaths: " +
        indData['death'] +
        "<br>Recovered: " +
        indData['rec'] +
        "<br>";
    //STATE DATA FETCH
    // console.log(data.data.regional);
    for (ind = 0; ind < 32; ind++) {
        var details = {};
        details["state"] = data.data.regional[ind].loc;
        details["conf"] =
            data.data.regional[ind].confirmedCasesIndian +
            data.data.regional[ind].confirmedCasesForeign;
        details["cured"] = data.data.regional[ind].discharged;
        details["deaths"] = data.data.regional[ind].deaths;

        if (details["conf"] < 100) {
            details["color"] = "#fff7ec";
        } else if (details["conf"] >= 100 && details["conf"] < 250) {
            details["color"] = "#fee8c8";
        } else if (details["conf"] >= 250 && details["conf"] < 500) {
            details["color"] = "#fdd49e";
        } else if (details["conf"] >= 500 && details["conf"] < 1000) {
            details["color"] = "#fdbb84";
        } else if (details["conf"] >= 1000 && details["conf"] < 2000) {
            details["color"] = "#fc8d59";
        } else if (details["conf"] >= 2000 && details["conf"] < 3000) {
            details["color"] = "#ef6548";
        } else if (details["conf"] >= 3000 && details["conf"] < 4000) {
            details["color"] = "#d7301f";
        } else if (details["conf"] >= 4000 && details["conf"] < 5000) {
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
            disDetails["conf"] = Number(disData[stateNames[ind]]["districtData"][disNames[i]]["confirmed"]);
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
};
// console.log(covidDisData);
var stateJson = {
    "Andaman and Nicobar Islands": "andamannicobarislands_district.json",
    "Andhra Pradesh": "andhrapradesh_district.json",
    "Arunachal Pradesh": "arunachalpradesh_district.json",
    "Assam": "assam_district.json",
    "Bihar": "bihar_district.json",
    "Chhattisgarh": "chhattisgarh_district.json",
    "Delhi": "delhi_district.json",
    "Goa": "goa_district.json",
    "Gujarat": "gujarat_district.json",
    "Haryana": "haryana_district.json",
    "Himachal Pradesh": "himachalpradesh_district.json",
    "Jammu and Kashmir": "jammukashmir_district.json",
    "Jharkhand": "jharkhand_district.json",
    "Karnataka": "karnataka_district.json",
    "Kerala": "kerala_district.json",
    "Ladakh": "ladakh_district.json",
    "Madhya Pradesh": "madhyapradesh_district.json",
    "Maharashtra": "maharashtra_district.json",
    "Manipur": "manipur_district.json",
    "Meghalaya": "meghalaya_district.json",
    "Mizoram": "mizoram_district.json",
    "Nagaland": "nagaland_district.json",
    "Odisha": "odisha_district.json",
    "Punjab": "punjab_district.json",
    "Rajasthan": "rajasthan_district.json",
    "Sikkim": "sikkim_district.json",
    "Tamil Nadu": "tamilnadu_district.json",
    "Telangana": "telangana_district.json",
    "Tripura": "tripura_district.json",
    "Uttarakhand": "uttarakhand_district.json",
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
    // map.dragging.disable();
    // Set the position and zoom level of the map
    map.setView([23, 92], 4);

    /*	Variety of base layers */
    var osm_mapnik = L.tileLayer("", {
        maxZoom: 10,
        minZoom: 5,
        attribution:
            '&copy; OSM Mapnik <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    /* 
    INDIA ENTIRE COUNTRY & STATES LOADING AND STUFF 
    */
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
    };
    var baseLayers = {
        "OSM Mapnik": osm_mapnik,
    };
    // Add baseLayers to the map

    var overLayers = {
        "Indian States": geojson,
    };
    // Add geoJSON to the map

    L.control.layers(baseLayers, overLayers).addTo(map);
    /* 
    INDIA ENTIRE COUNTRY & STATES LOADING AND STUFF 
    */
    function getColor(name) {
        for (i in coviddata) {
            if (name == coviddata[i]["state"]) {
                return coviddata[i]["color"];
            }
        }
    };
    function getFatData(name, model) {
        if (model === "Chinese") {
            for (i in cnExpFat) {
                if (name == cnExpFat[i]["state"]) {
                    return cnExpFat[i]["expNum"];
                }
            }
        }
        if (model == "Italian") {
            for (i in itExpFat) {
                if (name == itExpFat[i]["state"]) {
                    return itExpFat[i]["expNum"];
                }
            }
        }
        if (model == "Netherlands") {
            for (i in nlExpFat) {
                if (name == nlExpFat[i]["state"]) {
                    return nlExpFat[i]["expNum"];
                }
            }
        }
        if (model == "Switzerland") {
            for (i in szExpFat) {
                if (name == szExpFat[i]["state"]) {
                    return szExpFat[i]["expNum"];
                }
            }
        }
        if (model == "Spain") {
            for (i in spExpFat) {
                if (name == spExpFat[i]["state"]) {
                    return spExpFat[i]["expNum"];
                }
            }
        }
        if (model == "South Korea") {
            for (i in skExpFat) {
                if (name == skExpFat[i]["state"]) {
                    return skExpFat[i]["expNum"];
                }
            }
        }
        if (model == "Denmark") {
            for (i in dnExpFat) {
                if (name == dnExpFat[i]["state"]) {
                    return dnExpFat[i]["expNum"];
                }
            }
        }
    };

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature,
        });

    };

    function fetchJSON(url) {
        return fetch(url).then(function (response) {
            return response.json();
        });
    };
    function getStateData(name) {
        for (i in coviddata) {
            if (name === coviddata[i]["state"]) {
                return coviddata[i];
            }
        }
        return {
            state: 'No data',
            conf: 0,
            cured: 0,
            deaths: 0,
            color: '#ffffff',
        };
    };
    var stateLevel = false;
    var STATENAME;


    async function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
        var clickedState = e.target.feature.properties.NAME_1;
        var url = "/data/stateJsonData/" + stateJson[clickedState];
        var clickedStateJson = await fetchJSON(url);
        map.removeLayer(geojson);
        stateLevel = true;
        stateLevelJson = L.geoJson(clickedStateJson, {
            style: styleState,
            onEachFeature: onEachFeature,
        }).addTo(map);
    };
    function checkState() {
        var zoom = map.getZoom();
        if (stateLevel === true && zoom < 6) {
            map.addLayer(geojson);
            map.removeLayer(stateLevelJson);
            map.setView([23, 92], 4);
            stateLevel = false;
            resetHighlight(map);
        }
    };
    setInterval(checkState, 1000);
    function resetHighlight(e) {
        if (!stateLevel) {
            geojson.resetStyle(e.target);
        }
        if (stateLevel) {
            stateLevelJson.resetStyle(e.target);
        }
        document.getElementById("stat").innerHTML =
            "<h3> India Total" +
            "</h3><br>Confirmed: " +
            indData['conf'] +
            "<br>Deaths: " +
            indData['death'] +
            "<br>Recovered: " +
            indData['rec'] +
            "<br>";
    };
    function highlightFeature(e) {
        var layer = e.target;
        // console.log(e);
        layer.setStyle({
            weight: 5,
            color: "#666",
            dashArray: "",
            fillOpacity: 0.7,
        });
        // checks if currently statelevel, if not does for state
        if (!stateLevel) {
            var model;
            var e = document.getElementById("models");
            model = e.options[e.selectedIndex].value;
            // console.log(model);
            var stateData = getStateData(layer.feature.properties.NAME_1);
            var stateName = stateData["state"];
            STATENAME = stateName;
            var fatalityData = getFatData(stateName, model);
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
        //for district, if statelevel
        if (stateLevel) {
            var distName = e.target.feature.properties.district;
            var distD = getDistData(distName);
            // console.log(distD['conf']);
            var d;
            if (distD && typeof distD.conf === 'number') {
                d = distD.conf;
            } else {
                d = 0;
            }
            document.getElementById("stat").innerHTML =
                "<h3>" +
                distName +
                "</h3><br>Confirmed: " + d;
        }
    };
    // for individual states and districts
    function styleState(feature) {
        return {
            weight: 2,
            opacity: 0.7,
            color: "white",
            dashArray: "2",
            fillOpacity: 0.7,
            fillColor: getColorDist(feature.properties.district) || "#424242",
        };
    };
    function getColorDist(dname) {
        for (i in covidDisData) {
            for (j in covidDisData[i]) {
                // console.log(covidDisData[i][j]['districtName']);
                if (dname == covidDisData[i][j]['districtName']) {
                    return covidDisData[i][j]['color'];
                }
            }
        }
    };
    function getDistData(dname) {
        for (i in covidDisData) {
            for (j in covidDisData[i]) {
                // console.log(covidDisData[i][j]);
                if (dname == covidDisData[i][j]['districtName']) {
                    return covidDisData[i][j];
                }
            }
        }
    };
    // for individual states and districts

    // Chart below
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
                    label: "Worst Case Fatality",
                    backgroundColor: 'red',
                    data: cnExpFat[1].expNum,
                    borderWidth: 1,
                },
            ],
        },
        options: {
            legend: {
                display: true,
                labels: {
                    fontSize: ChartFont,
                },
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [
                    {
                        ticks: {
                            fontSize: ChartFont,
                        },
                    },
                ],
                yAxes: [
                    {
                        ticks: {
                            fontSize: ChartFont,
                            beginAtZero: true,
                        },
                    },
                ],
            },
        },
    });



    document.getElementById("models").onchange = function () { changeModel() };

    function changeModel() {
        console.log('change');
        var model;
        var modelEle = document.getElementById("models");
        model = modelEle.options[modelEle.selectedIndex].value;
        var fatalityData = getFatData(STATENAME, model);
        myChart.data.datasets[0]["data"] = fatalityData;
        myChart.update();
    }


});



