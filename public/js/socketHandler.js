/**
 * Created by Porter on 8/7/2017.
 */
jQuery(function () {
    var mult;
    var mode;

    socket.on('scores', function (data) {
        for (var i = 0; i < data.length; i++) {
            console.log(data[i]);
        }
        showAllPins(data);

    });


    socket.on('timer', function (data) {
        mult = data.mult;
        if (mode != data.mode) {
            mode = data.mode;

            togglePanes(mode, socket.id);
        }
        jQuery("#timer").html(data.seconds);
    });

    socket.on('joinGame', function (data) {

        jQuery.post("/app/mode",
            function (mode) {
                console.log(mode);
                if (mode) {
                    jQuery('#signIn').hide(500);
                    jQuery("#" + mode).show(500);
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
        //console.log(data.geom, data.symbol, data.id);
        handleMarker(data.geom, data.symbol, data.id);
    });


    sendPin = function (marker) {
        console.debug("SENDING OBJ to SERVER");
        jQuery("#submitPin").hide();
        //console.log(marker);
        socket.emit('pin', {geom: marker.geometry, symbol: marker.symbol, id: socket.id, mult: mult, dist: 0});
    }
});