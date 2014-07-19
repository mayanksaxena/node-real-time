'use strict';

var app = {},
    express = require("express"),
    redis = require('redis'),
    redisServer = require('./lib/redisserver'),
    radio = require('./lib/radio'),
    utility = require('./lib/util'),
    formidable = require('formidable'),
    fs = require("fs");

app.server = express();

app.server.configure(function(){
  //app.server.use('/media', express.static(__dirname + '/media'));
  app.server.use(express.static(__dirname + '/public'));
});

app.server.get("/", function(req, res){
    res.send("Hello World");
});

app.server.post("/upload", function(req, res) {
    console.log("In upload request handler");
    var form = new formidable.IncomingForm();
    form.parse(req, function(error, fields, files) {
        var uniqueFileName = utility.guid();
        var ext = files["file-0"].name.split(/[. ]+/).pop();
        uniqueFileName = uniqueFileName + "." + ext;
        console.log("parsing done:" + "public/audio/"+uniqueFileName);
        var is = fs.createReadStream(files["file-0"].path);
        var os = fs.createWriteStream("public/audio/"+uniqueFileName);

        is.pipe(os);
        is.on('end',function() {
            fs.unlinkSync(files["file-0"].path);
        });

        fs.link("public/images/"+uniqueFileName, './test.png');
        res.send({'audio': uniqueFileName});
        res.end();
    });
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


