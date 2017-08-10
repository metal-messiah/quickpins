/**
 * Created by Porter on 8/7/2017.
 */



jQuery("#submitPin").button().click(function () {
    console.debug("SENDING PIN");
    sendPin(myPin());
});


function togglePanes(mode, userID) {

    jQuery.post("/users/validate", {
            id: userID
        },
        function (userExists) {
            if (userExists) {
                if (mode != "score" && mode != 'intro') {
                    jQuery(".pane").hide(500);
                }
                if (mode == 'clue') {
                    map.graphics.clear();
                    zoomTo("fullExtent");
                    jQuery("#submitPin").show();
                }

                if (mode != 'intro') {
                    jQuery("#" + mode).show(500);
                }
            }
        }
    );


}