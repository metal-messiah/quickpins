/**
 * Created by Porter on 8/12/2017.
 */
module.exports = {
    randomValue: function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
    },
    distance: function (lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        //no unit returns as miles
        if (unit == "K") {
            dist = dist * 1.609344;
        }
        if (unit == "N") {
            dist = dist * 0.8684;
        }
        return dist
    },
    pin: function (nickname, score, symbol, rounds, hasChosen) {
        this.nickname = nickname || null;
        this.score = score || 0;
        this.rounds = rounds || 0;
        this.hasChosen = hasChosen || false;
        this.pin = {
            geom: null,
            symbol: symbol || {
                "color": {
                    "r": module.exports.randomValue(0, 255),
                    "g": module.exports.randomValue(0, 255),
                    "b": module.exports.randomValue(0, 255),
                    "a": 1
                },
                "angle": 30,
                "type": "simplemarkersymbol",
                "style": "circle",
                "outline": {
                    "color": {"r": 0, "g": 0, "b": 0, "a": 1},
                    "width": 1,
                    "type": "simplelinesymbol",
                    "style": "solid"
                },
                "size": 16,
                "xoffset": 0,
                "yoffset": 0
            },
            multiplier: 0,
            distance: 0,
            lat: 89.99,
            lng: 0,
            country: null
        }
    }
};