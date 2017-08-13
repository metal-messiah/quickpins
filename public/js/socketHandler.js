/**
 * Created by Porter on 8/7/2017.
 */
var mode;
require([
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "dojo/domReady!"
], function (Query, QueryTask) {
    jQuery(function () {
            var mult;
            var countries = "http://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries_(Generalized)/FeatureServer/0"

            socket.on('endGame', function (data) {
                jQuery("#timer").html("");
                jQuery("#next").html("");

            });

            socket.on('scores', function (data) {
                for (var i = 0; i < data.length; i++) {
                    console.log(data);
                    if (data[i].id == socket.id) {
                        jQuery("#scoreResults").html("Current Score - " + formatNumber(data[i].score, 2) + " Miles Off<hr>Average Score - " + formatNumber(data[i].avgScore, 2) + " Miles Off")
                    }
                }
                showAllPins(data);

            });


            socket.on('timer', function (data) {
                mult = data.mult;
                if (mode != data.mode) {
                    mode = data.mode;

                    togglePanes(mode, socket.id, data.topic);
                }
                jQuery("#timer").html(data.seconds);
                if (data.topic.nickname) {
                    jQuery("#next").html(data.topic.nickname + " Will Select The Next Topic");
                }
            });

            socket.on('joinGame', function (data) {

                jQuery.post("/app/mode",
                    function (mode) {
                        console.log(mode);
                        if (mode) {
                            jQuery('#signIn').slideUp(500);
                            jQuery("#" + mode).slideDown(500);
                        }
                    }
                );
                console.debug(data.nickname);
            });

            joinGame = function (data) {
                console.debug("SENDING OBJ to SERVER");
                socket.emit('joinGame', data);
            };

            socket.on('removeFromGame', function (data) {
                removePin(data.id)
            });


            socket.on('pin', function (data) {
                addPin(data.geom, data.symbol, data.id, data.nickname)
            });


            sendPin = function (marker, lat, lng) {

                var q = new Query();
                q.geometry = marker.geometry;
                q.outFields = ['Country'];
                q.returnGeometry = true; //could return if google trends uses geometry instead of keywords for countries
                var qT = new QueryTask(countries);
                qT.execute(q, function (resp) {
                    var country = resp.features[0];


                    console.debug("SENDING OBJ to SERVER");
                    jQuery("#submitPin").slideUp(500);
                    //console.log(marker);
                    socket.emit('pin', {
                        geom: marker.geometry,
                        symbol: marker.symbol,
                        id: socket.id,
                        mult: mult,
                        lat: lat,
                        lng: lng,
                        country: {country: country.attributes.Country, geom: country.geometry}
                    });

                })
            }
        }
    );
})