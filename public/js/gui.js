/**
 * Created by Porter on 8/7/2017.
 */

jQuery("#submitPin").button().click(function () {
    console.debug("SENDING PIN");
    sendPin(myPin());
});
