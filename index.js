'use strict';

var app = {},
    express = require("express"),
    redis = require('redis'),
    redisServer = require('./lib/redisserver');

app.server = express();

app.server.get("/", function(req, res){
    res.send("Hello World");
});

app.redisServer = new redisServer();
app.redisClient = new redisServer();

var env = process.env.NODE_ENV || 'development';

// Routes
var port = process.env.PORT || 8000; // Use the port that Heroku provides or default to 5000


var io = require('socket.io').listen(app.server.listen(port));

app.redisServer.subscribe('queue updated');
app.redisServer.subscribe('remove match from game screen');
app.redisServer.subscribe('emit game results');

app.redisServer.on('message', function (channel, message) {
    console.log('Sockets: Message recieved from pubsub channel ' + channel, message);
    io.sockets.emit(channel, message);
});

io.sockets.on('connection', function(client){
    console.log(client.id + " socket connected");
    //Init and bind socket events
    //var sockets = new Sockets(io, client, app.redisServer, app.redisClient);
});


