/**
 * Created by Porter on 8/7/2017.
 */
var mode, clue;

require([
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "dojo/domReady!"
], function (Query, QueryTask) {
    jQuery(function () {
            var mult;
            var countries = "http://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries_(Generalized)/FeatureServer/0";


            topicSelected = function (key) {
                socket.emit("topicSelected", {topic: key});
            };

            socket.on('topicSelected', function (data) {
                clue = data;
                jQuery.get("/app/getclue", function (resp) {
                    jQuery("#clueInfo").html(resp)
                })
            });

            socket.on('endGame', function (data) {
                jQuery("#timer").html("");
                jQuery("#next").html("");

            });

            socket.on('scores', function (data) {
                for (var i = 0; i < data.length; i++) {
                    console.log(data);
                    if (data[i].id == socket.id) {

                        var player = data[i];

                        if (player.pin.geom) {

                            if (player.category == "topics") {

                                if (player.rank) {
                                    var descriptiveText = player.country.country + " Ranked " + ordinal_suffix_of(player.rank) + " in the World for Googling " + clue;
                                }
                                else {
                                    var descriptiveText = player.country.country + " Did Not Google " + clue + " Enough to Make the List";
                                }


                                var top5 = "The Top 5 Countries Were <hr>" +
                                    player.trendScores[0].geoName + "(" + player.trendScores[0].value[0] + ")<br>" +
                                    player.trendScores[1].geoName + "(" + player.trendScores[1].value[0] + ")<br>" +
                                    player.trendScores[2].geoName + "(" + player.trendScores[2].value[0] + ")<br>" +
                                    player.trendScores[3].geoName + "(" + player.trendScores[3].value[0] + ")<br>" +
                                    player.trendScores[4].geoName + "(" + player.trendScores[4].value[0] + ")";


                                var delim = "<br><hr><br>";

                                var scoreBreakdown = "Score: " + player.trendValue + "<br>Multiplier: " + player.multiplier + "<hr>Current Round: " + formatNumber(data[i].score, 0) + "<hr>Average Score: " + formatNumber(data[i].avgScore, 2) + "<hr>Total Score: " + formatNumber(data[i].totalScore, 2);


                                jQuery("#scoreResults").html(descriptiveText + delim + top5 + delim + scoreBreakdown);

                                clue = null;
                            }
                            else if (player.category == "landmarks") {

                                if (player.rank) {
                                    var descriptiveText = "Correct! " + clue + " is located in " + player.country.country;
                                }
                                else {
                                    var descriptiveText = "Incorrect! " + clue + " is not located in " + player.country.country + ", It is in " + player.iso;
                                }
                                var delim = "<br><hr><br>";

                                var scoreBreakdown = "Score: " + player.trendValue + "<br>Multiplier: " + player.multiplier + "<hr>Current Round: " + formatNumber(data[i].score, 0) + "<hr>Average Score: " + formatNumber(data[i].avgScore, 2) + "<hr>Total Score: " + formatNumber(data[i].totalScore, 2);
                                jQuery("#scoreResults").html(descriptiveText + delim + scoreBreakdown);

                                clue = null;
                            }
                        }
                        else {
                            jQuery("#scoreResults").html("No Pin Found!!!!  No Score Added!!!")
                        }
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

                    var keyword = data.topic.keyword || "None";
                    var category = data.topic.category;
                    var c;
                    if (category == "topics") {
                        c = "Topic";
                    } else if (category == "landmarks") {
                        c = "Landmark";
                    }


                    jQuery("#next").html(c + ": <span class='nextHint'>" + keyword + "</span><hr>" + data.topic.nickname + " Will Select Next");

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
                q.outFields = ['Country', 'ISO'];
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
                        country: {
                            iso: country.attributes.ISO,
                            country: country.attributes.Country,
                            geom: country.geometry
                        }
                    });

                })
            }
        }
    );
});