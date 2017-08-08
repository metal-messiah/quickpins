/**
 * Created by Porter on 8/7/2017.
 */

require([
    "esri/geometry/Point",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/graphic",
    "dojo/domReady!"
], function (Point, SimpleMarkerSymbol, SimpleLineSymbol, Graphic) {

    myPin = function () {
        for (var i = 0; i < map.graphics.graphics.length; i++) {
            var pin = map.graphics.graphics[i];
            var pinID = pin.attributes.id;

            if (pinID == socket.id) {
                return pin
            }
        }

    };

    replaceExistingPin = function (graphicID, newPin) {
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
            geometry = new Point(g);
            console.log(geometry);
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
            geometry = g;
            //console.log(geometry);
            symbol = new SimpleMarkerSymbol({
                "color": [255, 255, 255, 64],
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

            /*pin = new Graphic({
             geometry: geometry,
             symbol: symbol,
             id: graphicID
             });*/

            pin = new Graphic(geometry, symbol, attr);
            replaceExistingPin(graphicID, pin);
        }


    };
});