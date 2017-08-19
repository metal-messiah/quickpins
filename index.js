/**
 * Created by Porter on 8/4/2017.
 */

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var fs = require('fs');
var countdown = require('countdown');
var request = require('request');
var helpers = require(__dirname + "/js/helpers");
var topics = require(__dirname + "/js/topics");
var trends = require(__dirname + "/js/trends");

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/app/gettopics', function (req, res) {
    if (!req.body) return res.sendStatus(400);
    else {

        var category = settings.categories[Math.floor(Math.random() * settings.categories.length)];
        var t = topics.getTopics(category);
        randomTopics = t;
        settings.topic.category = category;
        return res.send({data: t, category: category})
    }
});

app.post('/app/settopic', function (req, res) {
    if (!req.body) return res.sendStatus(400);
    else {
        clue = req.body.key;
        var category = req.body.category;
        var landmarkISO = req.body.iso;
        var url = req.body.url;
        settings.topic.keyword = clue;
        settings.topic.category = category;
        settings.topic.iso = landmarkISO;
        settings.topic.url = url;

        userInput = true;

        if (category == "topics") {
            trends.getTrendResults(clue, function (err, results) {
                results = JSON.parse(results);
                var scores = results.default.geoMapData;
                trendScores = scores;
            });
        }

        if (category == "landmarks") {
            landmarkCountry = landmarkISO;
        }

        return res.send("You've Selected <span class='hint'>" + clue + "</span> for the Next Round")
    }
});

app.get('/app/getclue', function (req, res) {
    if (!req.body) return res.sendStatus(400);
    else {
        if (settings.topic.category == "topics") {
            return res.send("Select Where You Think the Term <span class='hint'>" + clue + "</span> is Googled Most Often")
        }
        else if (settings.topic.category == "landmarks") {
            return res.send("In What Country Can You Find <span class='hint'>" + clue + "</span>?<br><br><div class='landmarkClue' style='background-image:url(" + settings.topic.url + ")'></div>")
        }
    }
});

app.post('/users/validate', function (req, res) {
    if (!req.body) return res.sendStatus(400);
    else {
        var userID = req.body.id;
        if (users[userID]) {
            if (users[userID].nickname) {
                return res.send(true)
            }
            else {
                return res.send(false)
            }
        } else {
            return res.send(false)
        }
    }
});

app.post('/users/symbol', function (req, res) {
    if (!req.body) return res.sendStatus(400);
    else {
        var userID = req.body.id;
        if (users[userID]) {
            if (users[userID].nickname) {
                return res.send(users[userID].pin.symbol)
            }
            else {
                return res.send(false)
            }
        }
        else {
            return res.send(false)
        }
    }
});

app.post('/users/getuser', function (req, res) {
    if (!req.body) return res.sendStatus(400);
    else {
        var userID = req.body.id;
        if (users[userID]) {
            if (users[userID].nickname) {
                return res.send(users[userID])
            }
            else {
                return res.send(false)
            }
        } else {
            return res.send(false)
        }
    }
});

app.post('/app/restart', function (req, res) {
    if (!req.body) return res.sendStatus(400);
    else {
        if (Object.keys(users).length == 1) {
            //console.log("intro timer");
            introTimer();
        }
    }
});

app.post('/app/mode', function (req, res) {
    if (!req.body) return res.sendStatus(400);
    else {
        return res.send(settings.mode)
    }
});

var users, userInput, randomTopics, trendScores, clue, settings, timer, timerLengths, timerRunning;
function init() {
    users = {};

    userInput = false;

    randomTopics = null;

    trendScores = null;

    landmarkCountry = null;

    clue = "";

    settings = {
        mode: null,
        topic: {
            id: null,
            nickname: null,
            keyword: null,
            category: null,
            iso: null
        },
        categories: ["topics", "landmarks"]
    };

    timer = null;

    timerLengths = {
        intro: 15,
        clue: 10,
        pin: 30,
        score: 15,
        topic: 15
    };
    timerRunning = false;
}

init();

io.on('connection', function (socket) {


    function topicHandler() {

        var hasNotChosen = [];
        for (key in users) {
            if (users.hasOwnProperty(key) && users[key].nickname) {
                //console.log(users[key].nickname + " Has Chosen? -- " + users[key].hasChosen)
                if (!users[key].hasChosen) {
                    hasNotChosen.push({id: key, nickname: users[key].nickname})
                }
            }
        }
        if (hasNotChosen.length) {
            //console.log("HASNT CHOSEN HAS LENGTH");
            var randomUserID = hasNotChosen[Math.floor(Math.random() * hasNotChosen.length)];
            settings.topic.id = randomUserID.id;
            settings.topic.nickname = randomUserID.nickname;
            //console.log(users[settings.topic.id].hasChosen);
            users[settings.topic.id].hasChosen = true;
            //console.log(users[settings.topic.id].hasChosen);
        }
        else {
            //console.log("HASNT CHOSEN DOESNT HAVE LENGTH");
            for (key in users) {
                if (users.hasOwnProperty(key) && users[key].nickname) {
                    users[key].hasChosen = false;
                    hasNotChosen.push({id: key, nickname: users[key].nickname})
                }
            }
            var randomUserID = hasNotChosen[Math.floor(Math.random() * hasNotChosen.length)];
            settings.topic.id = randomUserID.id;
            settings.topic.nickname = randomUserID.nickname;
            //console.log(users[settings.topic.id].hasChosen);
            users[settings.topic.id].hasChosen = true;
            //console.log(users[settings.topic.id].hasChosen);

        }
        //console.log("TOPIC HANDLER -- " + settings.topic.id + " - " + settings.topic.nickname);

    }


    function multiplier(seconds, mode) {
        if (mode == "pin") {
            var mult;
            ////console.log(seconds)
            if (seconds >= 20) {
                mult = 3;
            }
            else if (seconds < 20 && seconds >= 10) {
                mult = 2;
            }
            else {
                mult = 1;
            }
            return mult
        }
        else {
            return 0
        }
    }

    function endTimers() {
        console.log("NO USERS -- END GAME -- SET ALL SETTINGS TO DEFAULTS");
        clearInterval(timer);
        init();
        io.emit('endGame', {})
    }

    function introTimer() {

        if (Object.keys(users).length) {
            timerRunning = true;
            var now = new Date();
            timer =
                countdown(
                    now,
                    function (ts) {
                        if (timerLengths.intro - ts.seconds) {
                            io.emit('timer', {
                                seconds: timerLengths.intro - ts.seconds,
                                mode: "intro",
                                mult: multiplier(timerLengths.intro - ts.seconds, "intro"),
                                topic: settings.topic
                            });
                        }
                        if (ts.seconds == 0) {
                            //console.log("START INTRO");
                            settings.mode = "intro";

                        }
                        if (ts.seconds == 2) {
                            if (!settings.topic.id) {
                                topicHandler();
                            }
                        }
                        if (ts.seconds >= timerLengths.intro) {
                            //console.log("END INTRO -- START GAME TIMERS");
                            clearInterval(timer);
                            topicTimer();
                        }
                    }
                );
        }
        else {
            //console.log("No Users -- Don't Run Game")
        }
    }

    function topicTimer() {
        if (Object.keys(users).length) {
            timerRunning = true;
            var now = new Date();
            timer =
                countdown(
                    now,
                    function (ts) {
                        if (timerLengths.topic - ts.seconds) {
                            io.emit('timer', {
                                    seconds: timerLengths.topic - ts.seconds,
                                    mode: "topic",
                                    mult: multiplier(timerLengths.topic - ts.seconds, "topic"),
                                    topic: settings.topic
                                }
                            );
                        }
                        if (ts.seconds == 0) {
                            //console.log("START TOPIC");
                            settings.mode = "topic";
                            //console.log(settings.topic);
                            //console.log(users[settings.topic.id].hasChosen)


                        }
                        if (ts.seconds >= timerLengths.topic) {
                            //console.log("END TOPIC -- START CLUE");
                            clearInterval(timer);
                            clueTimer();
                        }
                    }
                );
        }
        else {
            //console.log("No Users -- Don't Run Game")
        }
    }

    function clueTimer() {
        if (Object.keys(users).length) {
            timerRunning = true;
            var now = new Date();
            timer =
                countdown(
                    now,
                    function (ts) {
                        if (timerLengths.clue - ts.seconds) {
                            io.emit('timer', {
                                    seconds: timerLengths.clue - ts.seconds,
                                    mode: "clue",
                                    mult: multiplier(timerLengths.clue - ts.seconds, "clue"),
                                    topic: settings.topic

                                }
                            );
                        }
                        if (ts.seconds == 0) {
                            //console.log("START CLUE");
                            topicHandler();


                            settings.mode = "clue";
                            for (var index in users) {
                                if (users.hasOwnProperty(index)) {
                                    // clear the pins for each user
                                    //console.log("chosen? -- " + users[index].hasChosen)
                                    users[index] = new helpers.pin(users[index].nickname, users[index].score, users[index].pin.symbol, users[index].rounds, users[index].hasChosen);
                                }
                            }


                            //check to see if a user input a topic, if not, randomly choose from randomTopics
                            if (!userInput) {

                                var topic = randomTopics[Math.floor(Math.random() * randomTopics.length)];


                                if (settings.topic.category == "topics") {
                                    clue = topic;
                                    settings.topic.keyword = clue;
                                    trends.getTrendResults(clue, function (err, results) {
                                        results = JSON.parse(results);
                                        var scores = results.default.geoMapData;
                                        trendScores = scores;
                                    });
                                }
                                if (settings.topic.category == "landmarks") {
                                    clue = topic.name;
                                    settings.topic.keyword = clue;
                                    var iso = topics.getLandmarkCounty(clue);
                                    landmarkCountry = iso;
                                    settings.topic.iso = iso;
                                    trendScores = null;
                                }
                                io.emit('topicSelected', topic)
                            }


                        }
                        if (ts.seconds >= timerLengths.clue) {
                            //console.log("END CLUE -- START PINNING");
                            clearInterval(timer);
                            pinTimer();
                        }
                    }
                );
        }
        else {
            //console.log("No Users -- Don't Run Game")
        }
    }

    function pinTimer() {
        if (Object.keys(users).length) {
            timerRunning = true;
            var now = new Date();
            timer =
                countdown(
                    now,
                    function (ts) {
                        if (timerLengths.pin - ts.seconds) {
                            ////console.log(multiplier(30 - ts.seconds, "pin"))
                            io.emit('timer', {
                                    seconds: timerLengths.pin - ts.seconds,
                                    mode: "pin",
                                    mult: multiplier(timerLengths.pin - ts.seconds, "pin"),
                                    topic: settings.topic

                                }
                            );
                        }
                        if (ts.seconds == 0) {
                            //console.log("START PINNING");
                            settings.mode = "pin";
                            userInput = false;
                        }
                        if (ts.seconds % (timerLengths.pin / 3) == 0) {
                            //console.log(ts.seconds + " seconds - change multiplier");
                        }
                        if (ts.seconds >= timerLengths.pin) {

                            //console.log("END PINNING -- START SCORING");
                            clearInterval(timer);
                            scoreTimer();
                        }
                    }
                )
            ;
        }
        else {
            //console.log("No Users -- Don't Run Game")
        }
    }

    function scoreTimer() {
        if (Object.keys(users).length) {
            timerRunning = true;
            var now = new Date();
            timer =
                countdown(
                    now,
                    function (ts) {
                        if (timerLengths.score - ts.seconds) {
                            io.emit('timer', {
                                    seconds: timerLengths.score - ts.seconds,
                                    mode: "score",
                                    mult: multiplier(timerLengths.score - ts.seconds, "score"),
                                    topic: settings.topic

                                }
                            );
                        }
                        if (ts.seconds == 0) {
                            //console.log("START SCORE");
                            settings.mode = "score";


                            var scores = [];

                            for (var index in users) {
                                if (users.hasOwnProperty(index)) {
                                    var sID = index;
                                    var pin = users[index].pin;

                                    //var dist = pin.distance = helpers.distance(pin.lat, pin.lng, answer.lat, answer.lng);
                                    //var score = pin.distance * pin.multiplier;
                                    var score = 0;
                                    var trendValue = 0;

                                    if (pin.country) {
                                        //console.log(pin.country);
                                        //console.log(trendScores);
                                        if (settings.topic.category == "topics") {
                                            var rank = 0;
                                            var counter = 1;
                                            for (var i = 0; i < trendScores.length; i++) {
                                                if (pin.country.iso == trendScores[i].geoCode) {
                                                    score = trendScores[i].value * pin.multiplier;
                                                    trendValue = trendScores[i].value;
                                                    rank = counter;
                                                }
                                                else {
                                                    counter++
                                                }
                                            }
                                            if (!trendValue) {
                                                rank = 0
                                            }
                                        }
                                        if (settings.topic.category == "landmarks") {
                                            var rank = 0;
                                            var counter = 1;
                                            if (pin.country.iso == landmarkCountry) {
                                                score = 100 * pin.multiplier;
                                                trendValue = 100;
                                                rank = 1;
                                            }
                                            else {
                                                score = 0;
                                                trendValue = 0;
                                                rank = 0;
                                            }
                                        }

                                    }


                                    users[index].rounds = users[index].rounds + 1;
                                    users[index].score = (users[index].score + score);
                                    users[index].avgScore = users[index].score / users[index].rounds;
                                    data = {
                                        id: sID,
                                        nickname: users[index].nickname,
                                        score: score,
                                        pin: pin,
                                        totalScore: users[index].score,
                                        avgScore: users[index].avgScore,
                                        country: pin.country,
                                        multiplier: pin.multiplier,
                                        trendScores: trendScores,
                                        trendValue: trendValue,
                                        rank: rank,
                                        clue: clue,
                                        category: settings.topic.category,
                                        iso: landmarkCountry || null
                                    };
                                    scores.push(data);

                                }
                            }
                            io.emit('scores', scores);

                            ////console.log(users[socket.id].nickname + " - " + users[socket.id].multiplier)
                        }
                        if (ts.seconds >= timerLengths.score) {
                            //console.log("END SCORE -- START NEXT CLUE");
                            clearInterval(timer);
                            topicTimer();
                        }
                        else {
                            //do nothing
                        }
                    }
                )
            ;
        }
        else {
            //console.log("No Users -- Don't Run Game")
        }
    }


    //console.log(socket.id + " joined the server -- loading login page");
    users[socket.id] = new helpers.pin();


    socket.on('disconnect', function () {
        //console.log('user disconnected');
        delete users[socket.id];
        io.emit('removeFromGame', {id: socket.id});
        if (Object.keys(users).length == 0) {
            endTimers();
        }
        else {
            var active = false;
            for (key in users) {
                if (users[key].nickname) {
                    active = true;
                }
            }
            if (!active) {
                endTimers();
            }
        }
    });

    socket.on('pin', function (data) {
        ////console.log("MULTIPLIER IS - " + data.mult);
        users[socket.id].pin.geom = data.geom;
        //users[socket.id].pin.symbol = data.symbol;
        users[socket.id].pin.multiplier = data.mult;
        users[socket.id].pin.lat = data.lat;
        users[socket.id].pin.lng = data.lng;
        users[socket.id].pin.country = data.country;
        ////console.log(users[socket.id]);
        io.emit('pin', {
            geom: users[socket.id].pin.geom,
            symbol: users[socket.id].pin.symbol,
            id: socket.id,
            nickname: users[socket.id].nickname
        })
    });

    socket.on('joinGame', function (data) {
        //console.log(data.nickname + " is ready to join the game -- socket id = " + socket.id);
        if (data.nickname) {
            if (users[socket.id]) {
                users[socket.id].nickname = data.nickname;
                socket.emit('joinGame', data);
                ////console.log(Object.keys(users));
                if (!timerRunning) {
                    console.log("1st User Joined!! Start the Game!!!");
                    introTimer();
                }
            }
        }
        //io.emit('newPlayer', data)
    });

    socket.on('topicSelected', function (data) {
        if (data) {
            clue = data.topic;
            io.emit('topicSelected', data.topic)
        }
    });
});

http.listen(3000, function () {
    //console.log('listening on *:3000');
});

exports = module.exports = app;