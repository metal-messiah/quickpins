/**
 * Created by Porter on 8/7/2017.
 */

//var mult;

require([
    "esri/geometry/Point",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/graphic",
    "dojo/domReady!"
], function (Point, SimpleMarkerSymbol, SimpleLineSymbol, Graphic) {


    showAllPins = function (pins) {
        map.graphics.clear();
        jQuery.each(pins, function (index, val) {
            var pin = val.pin;
            addPin(pin.geom, pin.symbol, val.id, val.nickname)
        });


        zoomTo("pins")


    };

    myPin = function () {
        for (var i = 0; i < map.graphics.graphics.length; i++) {
            var pin = map.graphics.graphics[i];
            var pinID = pin.attributes.id;

            if (pinID == socket.id) {
                return pin
            }
        }

    };

    removePin = function (graphicID) {
        try {
            jQuery.each(map.graphics.graphics, function (i, pin) {
                // console.log(pin);

                if (pin.attributes.id == graphicID) {
                    console.log("player disconnected -- remove it");

                    map.graphics.remove(pin)


                }

            });
        }
        catch (err) {
            //do nothing for now
        }
    };


    addPin = function (geom, symbol, id, nickname) {
        nickname = nickname || null;


        var geometry = new Point(geom);
        var symbology = new SimpleMarkerSymbol(symbol);
        var attr = {id: id, nickname: nickname};
        var newPin = new Graphic(geometry, symbology, attr);
        jQuery.each(map.graphics.graphics, function (i, pin) {
            // console.log(pin);
            if (pin.attributes) {
                if (pin.attributes.id == id) {
                    console.log("one already exists -- remove it");
                    map.graphics.remove(pin)
                }
            }
        });
        map.graphics.add(newPin);
    };


})
;