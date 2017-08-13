/**
 * Created by Porter on 8/4/2017.
 */
var map, mySymbol = null, nickname = null; //eventually set symbol based on server object

require([
    "esri/map",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "dojo/domReady!"
], function (Map, Query, QueryTask) {
    map = new Map("mapDiv", {
        center: [0, 0],
        zoom: 2,
        basemap: "hybrid",
        autoResize: true,
        fadeOnZoom: true,
        fitExtent: true,
        logo: false,
        minZoom: 2,
        nav: false,
        showAttribution: false,
        slider: false
    });

    // map creates an empty graphic for some reason. delete it.
    map.on("load", function () {
        map.graphics.remove(map.graphics.graphics[0])
    });

    map.on("click", function (evt) {

        if (jQuery("#submitPin").is(":visible")) {

            var geom = evt.mapPoint;

            if (mySymbol && nickname) {
                addPin(geom, mySymbol, socket.id, nickname)
            }
            else {
                nickname = jQuery("#nickname").val();
                jQuery.post("/users/symbol", {
                        id: socket.id
                    },
                    function (symbol) {
                        if (symbol) {
                            mySymbol = symbol;
                            addPin(geom, mySymbol, socket.id, nickname)
                        }
                    }
                );
            }

        }
        else {
            //dont add a point, one has already been submitted to the server!!!
        }


    });

    zoomTo = function (key) {
        if (key == "fullExtent") {
            map.setExtent(map.getLayer("layer0").fullExtent)

        }
        if (key == "pins") {
            var graphicsExtent = esri.graphicsExtent(map.graphics.graphics);

            map.setExtent(graphicsExtent);
            window.setTimeout(function () {
                map.setZoom(map.getZoom() - 1)
            }, 1000);

        }
    };


});