/**
 * Created by Porter on 8/7/2017.
 */
jQuery(function () {

    socket.on('change-content', function (data) {
        var path = data.path;
        jQuery('body').load(path);
    });

    socket.on('pin', function (data) {
        //console.log(data.geom, data.symbol, data.id);
        handleMarker(data.geom, data.symbol, data.id);
    });


    sendPin = function (marker) {
        console.debug("SENDING OBJ to SERVER");
        //console.log(marker);
        socket.emit('pin', {geom: marker.geometry, symbol: marker.symbol, id: socket.id});
    }
});