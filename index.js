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

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
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

app.post('/app/getclue', function (req, res) {
    if (!req.body) return res.sendStatus(400);
    else {
        return res.send(clue)
    }
});


var users = {};

var answer = {
    lat: 41,
    lng: -110,
    spatialReference: {wkid: 102100, latestWkid: 3857},
    description: "Salt Lake City, UT"
};

var clue = {};

var settings = {
    mode: null,
    topic: {
        id: null,
        nickname: null,
        keyword: null
    }
};

var timer;
var timerLengths = {
    intro: 15,
    clue: 10,
    pin: 30,
    score: 15,
    topic: 15
};
var timerRunning = false;


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
                mult = 1;
            }
            else if (seconds < 20 && seconds >= 10) {
                mult = 2;
            }
            else {
                mult = 3;
            }
            return mult
        }
        else {
            return 0
        }
    }

    function endTimers() {
        timerRunning = false;
        clearInterval(timer);
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
                                    users[index] = new helpers.pin(users[index].nickname, users[index].score, users[index].pin.symbol, users[index].pin.rounds, users[index].hasChosen);
                                }
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
                                    var dist = pin.distance = helpers.distance(pin.lat, pin.lng, answer.lat, answer.lng);
                                    var score = pin.distance * pin.multiplier;
                                    users[index].rounds += 1;
                                    users[index].score = (users[index].score + score) / users[index].rounds;
                                    data = {
                                        id: sID,
                                        nickname: users[index].nickname,
                                        score: score,
                                        pin: pin,
                                        avgScore: users[index].score,
                                        country: pin.country
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
        users[socket.id].nickname = data.nickname;
        socket.emit('joinGame', data);
        ////console.log(Object.keys(users));
        if (!timerRunning) {
            //console.log("intro timer");
            introTimer();
        }
        //io.emit('newPlayer', data)
    });
});

http.listen(3000, function () {
    //console.log('listening on *:3000');
});

exports = module.exports = app;