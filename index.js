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
            console.log("intro timer");
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


function randomValue(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function distance(lat1, lon1, lat2, lon2, unit) {
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
}

function Pin(nickname, score, symbol, rounds) {
    this.nickname = nickname || null;
    this.score = score || 0;
    this.rounds = rounds || 0;
    this.pin = {
        geom: null,
        symbol: symbol || {
            "color": {"r": randomValue(0, 255), "g": randomValue(0, 255), "b": randomValue(0, 255), "a": 1},
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
        lng: 0
    }
}

var users = {};

var answer = {
    lat: 41,
    lng: -110,
    spatialReference: {wkid: 102100, latestWkid: 3857},
    description: "Salt Lake City, UT"
};

var clue = {

};

var settings = {
    mode: null
};

var timer;
var timerLengths = {
    intro: 15,
    clue: 10,
    pin: 30,
    score: 15
};
var timerRunning = false;


io.on('connection', function (socket) {
    function multiplier(seconds, mode) {
        if (mode == "pin") {
            var mult;
            //console.log(seconds)
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
                                mult: multiplier(timerLengths.intro - ts.seconds, "intro")
                            });
                        }
                        if (ts.seconds == 0) {
                            console.log("START INTRO");
                            settings.mode = "intro";
                        }
                        if (ts.seconds >= timerLengths.intro) {
                            console.log("END INTRO -- START GAME TIMERS");
                            clearInterval(timer);
                            clueTimer();
                        }
                    }
                );
        }
        else {
            console.log("No Users -- Don't Run Game")
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
                                    mult: multiplier(timerLengths.clue - ts.seconds, "clue")

                                }
                            );
                        }
                        if (ts.seconds == 0) {
                            console.log("START CLUE");
                            settings.mode = "clue";
                            for (var index in users) {
                                if (users.hasOwnProperty(index)) {
                                    // clear the pins for each user
                                    users[index] = new Pin(users[index].nickname, users[index].score, users[index].pin.symbol, users[index].pin.rounds);
                                }
                            }

                        }
                        if (ts.seconds >= timerLengths.clue) {
                            console.log("END CLUE -- START PINNING");
                            clearInterval(timer);
                            pinTimer();
                        }
                    }
                );
        }
        else {
            console.log("No Users -- Don't Run Game")
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
                            //console.log(multiplier(30 - ts.seconds, "pin"))
                            io.emit('timer', {
                                    seconds: timerLengths.pin - ts.seconds,
                                    mode: "pin",
                                    mult: multiplier(timerLengths.pin - ts.seconds, "pin")

                                }
                            );
                        }
                        if (ts.seconds == 0) {
                            console.log("START PINNING");
                            settings.mode = "pin";
                        }
                        if (ts.seconds % (timerLengths.pin / 3) == 0) {
                            console.log(ts.seconds + " seconds - change multiplier");
                        }
                        if (ts.seconds >= timerLengths.pin) {

                            console.log("END PINNING -- START SCORING");
                            clearInterval(timer);
                            scoreTimer();
                        }
                    }
                )
            ;
        }
        else {
            console.log("No Users -- Don't Run Game")
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
                                    mult: multiplier(timerLengths.score - ts.seconds, "score")

                                }
                            );
                        }
                        if (ts.seconds == 0) {
                            console.log("START SCORE");
                            settings.mode = "score";

                            var scores = [];

                            for (var index in users) {
                                if (users.hasOwnProperty(index)) {
                                    var sID = index;
                                    var pin = users[index].pin;
                                    var dist = pin.distance = distance(pin.lat, pin.lng, answer.lat, answer.lng);
                                    var score = pin.distance * pin.multiplier;
                                    users[index].rounds += 1;
                                    users[index].score = (users[index].score + score) / users[index].rounds;
                                    data = {
                                        id: sID,
                                        nickname: users[index].nickname,
                                        score: score,
                                        pin: pin,
                                        avgScore: users[index].score
                                    };
                                    scores.push(data);
                                }
                            }
                            io.emit('scores', scores);

                            //console.log(users[socket.id].nickname + " - " + users[socket.id].multiplier)
                        }
                        if (ts.seconds >= timerLengths.score) {
                            console.log("END SCORE -- START NEXT CLUE");
                            clearInterval(timer);
                            clueTimer();
                        }
                        else {
                            //do nothing
                        }
                    }
                )
            ;
        }
        else {
            console.log("No Users -- Don't Run Game")
        }
    }

    console.log(socket.id + " joined the server -- loading login page");
    users[socket.id] = new Pin();

    socket.on('disconnect', function () {
        console.log('user disconnected');
        delete users[socket.id];
        io.emit('removeFromGame', {id: socket.id});
        if (Object.keys(users).length == 0) {
            endTimers();
        }
    });

    socket.on('pin', function (data) {
        //console.log("MULTIPLIER IS - " + data.mult);
        users[socket.id].pin.geom = data.geom;
        //users[socket.id].pin.symbol = data.symbol;
        users[socket.id].pin.multiplier = data.mult;
        users[socket.id].pin.lat = data.lat;
        users[socket.id].pin.lng = data.lng;
        //console.log(users[socket.id]);
        //io.emit('pin', data);
    });

    socket.on('joinGame', function (data) {
        console.log(data.nickname + " is ready to join the game -- socket id = " + socket.id);
        users[socket.id].nickname = data.nickname;
        socket.emit('joinGame', data);
        //console.log(Object.keys(users));
        if (!timerRunning) {
            console.log("intro timer");
            introTimer();
        }
        //io.emit('newPlayer', data)
    });
})
;

http.listen(3030, function () {
    console.log('listening on *:3000');
});

exports = module.exports = app;