'use strict';

var app = {},
    express = require("express"),
    redis = require('redis'),
    redisServer = require('./lib/redisserver'),
    radio = require('./lib/radio');

app.server = express();

app.server.get("/", function(req, res){
    res.send("Hello World");
});

app.redisServer = new redisServer();
app.redisClient = new redisServer();

var env = process.env.NODE_ENV || 'development';

// Routes
var port = process.env.PORT || 8000; // Use the port that Heroku provides or default to 5000

//Create the server
var io = require('socket.io').listen(app.server.listen(port));
//Created new instance of radio.
var myradio = new radio(io, app.redisServer, app.redisClient);


