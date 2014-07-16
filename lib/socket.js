'use strict';
/**
 * MODULE REGISTRATION
 * Initialise a new instance of SocketEvents.
 */

var Sockets = function (io, client, redisServer, redisClient) {
    io.set('logger', logger);

    // We are an instance of Sockets, set the values.
    this.socket = client;

    this.socket.set('heartbeat timeout', 10);
    this.socket.set('heartbeat interval', 5);

    this.redisPubSub = redisServer;

    // Init routes.
    this.init(io, client, this.redisPubSub, redisClient);
};

/**
 * ProtoType methods.
 */
Sockets.prototype = {

    /**
     * Connect the Sockets.
     */
    init: function (io, socket, redisPubSub, redisClient) {
        // Websocket events
        socket.on('data', function (callback) {
            //Do Something in Callback
        });
    },

    redisPubSub: null,

    //Instance of sockets.
    socket: null
};

// Replace the module prototype with sockets.
module.exports = Sockets;
