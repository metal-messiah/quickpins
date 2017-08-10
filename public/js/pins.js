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


    /*replaceExistingPin = function (graphicID, newPin) {
     //console.log(newPin);
     jQuery.each(map.graphics.graphics, function (i, pin) {
     // console.log(pin);

     if (pin.attributes.id == graphicID) {
     console.log("one already exists -- remove it");

     map.graphics.remove(pin)


     }

     });

     map.graphics.add(newPin);
     };


     handleMarker = function (g, s, graphicID) {
     var pin, geometry, symbol, attr;
     console.log(g, s);
     if (g && s) {
     console.debug("POINT EXISTS ALREADY");
     geometry = new Point(g);
     //console.log(geometry);
     symbol = new SimpleMarkerSymbol({
     "color": s.color,
     "size": s.size,
     "angle": s.angle,
     "xoffset": s.xoffset,
     "yoffset": s.yoffset,
     "type": s.type,
     "style": s.style,
     "outline": s.outline
     });
     attr = {id: graphicID};
     pin = new Graphic(geometry, symbol, attr);

     replaceExistingPin(graphicID, pin);
     }
     else {
     console.debug("BRAND NEW POINT");
     geometry = g;
     var r = randomValue(0, 255);
     var g = randomValue(0, 255);
     var b = randomValue(0, 255);
     //console.log(geometry);
     symbol = new SimpleMarkerSymbol({
     "color": [r, g, b, 64],
     "size": 12,
     "angle": -30,
     "xoffset": 0,
     "yoffset": 0,
     "type": "esriSMS",
     "style": "esriSMSCircle",
     "outline": {
     "color": [0, 0, 0, 255],
     "width": 1,
     "type": "esriSLS",
     "style": "esriSLSSolid"
     }
     });

     attr = {id: graphicID};
     mySymbol = symbol;

     pin = new Graphic({
     geometry: geometry,
     symbol: symbol,
     id: graphicID
     });

     pin = new Graphic(geometry, symbol, attr);
     replaceExistingPin(graphicID, pin);
     }


     };*/
})
;