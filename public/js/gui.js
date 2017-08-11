/**
 * Created by Porter on 8/7/2017.
 */




jQuery("#submitPin").button().click(function () {
    console.debug("SENDING PIN");
    var pin = myPin()
    sendPin(pin, pin.geometry.getLatitude(), pin.geometry.getLongitude());
});


function togglePanes(mode, userID) {

    jQuery.post("/users/validate", {
            id: userID
        },
        function (userExists) {
            if (userExists) {
                if (mode != "score" && mode != 'intro') {
                    jQuery(".pane").slideUp(500);
                }
                if (mode == 'clue') {
                    map.graphics.clear();
                    zoomTo("fullExtent");
                    jQuery("#submitPin").slideDown();
                }

                if (mode != 'intro') {
                    jQuery("#" + mode).slideDown(500);
                }
            }
        }
    );


}

jQuery("#nickname").tooltip();

jQuery("#play").click(function () {
    var nickname = jQuery("#nickname").val();
    if (nickname) {
        var data = {
            nickname: nickname
        };
        joinGame(data);
        clearInterval(playButton);
    }
})