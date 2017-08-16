/**
 * Created by Porter on 8/15/2017.
 */
const googleTrends = require('google-trends-api');


module.exports = {
    getTrendResults: function (keyword, callback) {
        var today = new Date();
        var pastYear = today.getFullYear() - 1;

        googleTrends.interestByRegion({
            keyword: keyword,
            startTime: new Date(pastYear, today.getMonth(), today.getDay()),
            endTime: today,
            resolution: "COUNTRY"
        }, callback)
    }
};

