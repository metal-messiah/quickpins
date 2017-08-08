/**
 * Created by Porter on 8/4/2017.
 */

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    console.log(socket.id + " joined the server -- loading login page");

    socket.on('pin', function (data) {
        console.log(data);
        io.emit('pin', data);
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});

exports = module.exports = app;