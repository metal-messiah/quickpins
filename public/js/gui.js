/**
 * Created by Porter on 8/7/2017.
 */




jQuery("#submitPin").button().click(function () {
    console.debug("SENDING PIN");
    jQuery("#submitPin").slideUp(500);
    var pin = myPin();

    sendPin(pin, pin.geometry.getLatitude(), pin.geometry.getLongitude());
});


function togglePanes(mode, userID, topic) {

    //console.log(userID);
    //console.log(topic);

    jQuery.post("/users/validate", {
            id: userID
        },
        function (userExists) {
            if (userExists) {



                if (mode != "score" && mode != 'intro') {
                    jQuery(".pane").slideUp(500);
                }



                if (mode == 'topic') {
                    jQuery("#next").hide();
                }
                else {
                    jQuery("#next").show();
                }


                if (mode == 'topic' && userID == topic.id) {

                    jQuery("#topicInfo").html(jQuery('<input/>', {
                        id: 'topicInput',
                        title: 'Enter a Topic For The Next Round',
                        placeholder: 'Enter a Topic For The Next Round'
                    }));
                    jQuery("#topic").slideDown(500);
                }
                else if (mode == 'topic' && userID != topic.id) {

                    jQuery("#topicInfo").html(jQuery('<span/>', {
                        id: 'topicInput',
                        text: topic.nickname + " is selecting the topic for the next round"
                    }));
                    jQuery("#topic").slideDown(500);
                }
                else if (mode == 'clue') {
                    map.graphics.clear();
                    zoomTo("fullExtent");
                    jQuery("#submitPin").slideDown();
                    jQuery("#clue").slideDown(500);
                }
                else if (mode == 'pin') {
                    jQuery("#pin").slideDown(500);
                }
                else if (mode == 'score') {
                    jQuery("#score").slideDown(500);
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
});
var playButton = setInterval(function () {
    if (jQuery("#nickname").val()) {
        var color = "rgb(" + randomValue(200, 255) + "," + randomValue(200, 255) + "," + randomValue(200, 255) + ")"
        jQuery("#play").animate({
            backgroundColor: color,
            color: "black"
        }).addClass('glow')
    }
    else {
        var color = "darkgray";
        jQuery("#play").css("background-color", color).click(function () {
            //do nothing})
        })
    }
}, 500);