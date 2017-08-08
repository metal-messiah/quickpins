/**
 * Created by Porter on 8/4/2017.
 */
var map;

require([
    "esri/map",
    "esri/geometry/Point",
    "dojo/domReady!"
], function (Map, MapView, Point) {
    map = new Map("mapDiv", {
        center: [-118, 34.5],
        zoom: 8,
        basemap: "hybrid"
    });

    // map creates an empty graphic for some reason. delete it.
    map.on("load", function () {
        map.graphics.remove(map.graphics.graphics[0])
    });

    map.on("click", function (evt) {
        handleMarker(evt.mapPoint, null, socket.id)
    })


});