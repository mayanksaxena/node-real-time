'use strict';
var socket = require('./socket');
/**
 * MODULE REGISTRATION
 * Initialise Main Functionality of Radio.
 */
var Radio = function(io, redisServer, redisClient) {
	this.io = io;
	this.redisServer = redisServer;
	this.redisClient = redisClient;
	this.init();
};

/**
 * ProtoType methods.
 */
Radio.prototype = {
	init: function() {
		var self = this;
		//Subscribe Channels
		self.redisServer.subscribe('queue updated');
		self.redisServer.subscribe('remove match from game screen');
		self.redisServer.subscribe('emit game results');

		//Get Message and Throw
		self.redisServer.on('message', function (channel, message) {
		    console.log('Sockets: Message recieved from pubsub channel ' + channel, message);
		    self.io.sockets.emit(channel, message);
		});

		//Check that new Client is Connected.
		self.io.sockets.on('connection', function(client){
		    console.log(client.id + " socket connected");
		    //Init and bind socket events
		    var sockets = new Sockets(self.io, client, self.redisServer, self.redisClient);
		});
	}
}

// Replace the module prototype with Radio.
module.exports = Radio;