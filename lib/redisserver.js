'use strict';

var url = require('url');

/**
 * Initialise a new instance of RedisServer.
 */
var RedisServer = function () {
    this.init();
};

RedisServer.prototype = {

    init: function () {
        this.ConfigSettings = {
            "ConnectionString": "redis://:@127.0.0.1:6379/",
            "databaseNumber": 0
        };

        var redisUrl = url.parse(this.ConfigSettings.ConnectionString),
            redisAuth = redisUrl.auth.split(':');

        this.RedisClient = require('redis').createClient(redisUrl.port, redisUrl.hostname);

        this.RedisClient.auth(redisAuth[1]);
        this.RedisClient.select(this.ConfigSettings.databaseNumber, function (err, res) {
            if (err) {
                console.error(err);
            }
        });
    },

    /**
     * Register this instance of the redis client as a Pub/Sub one way only client.
     * @param name "channel" channel name to register too.
     */
    subscribe: function (channel) {
        this.RedisClient.subscribe(channel);
    },

    /**
     * When on pub/sub mode redis client will receive message on this event.
     * @param "channel" channel name.
     * @param "callback" callback to be called when a message is received.
     */
    on: function (channel, callback) {
        this.RedisClient.on(channel, callback);
    },

    /**
     * Sends a message to specific channel.
     * @param "channel" channel name.
     * @param "message" message to be sent.
     */
    publish: function (channel, message) {
        this.RedisClient.publish(channel, message);
    },

    /**
     * Removes subscription to specific channel.
     * @param "channel" channel name.
     */
    unsubscribe: function (channel) {
        this.RedisClient.unsubscribe(channel);
    },

    /**
     * To set the value or update the value of key in redis.
     * @param "key" redis key.
     * @param "value" Value of the key..
     */
    set: function (key, value) {
        this.RedisClient.set(key, value);
    },

    /**
     * To delete key in redis.
     * @param "key" Key name.
     */
    del: function (key, callback) {
        this.RedisClient.del(key);

        if (callback) {
            callback();
        }
    },

    /**
     * To get the value of key from redis.
     * @param "key" Key name.
     * @param "callback" callback to be called when a value is received.
     */
    get: function (key, callback) {
        this.RedisClient.get(key, function (err, data) {
            if (err) {
                //callback when error occured.
                process.nextTick(function () {
                    callback(err);
                });
            } else {
                //callback when data is received.
                process.nextTick(function () {
                    callback(data);
                });
            }
        });
    },

    /**
     * To watch the key in redis.
     * @param "key" Key name.
     */
    watch: function (key) {
        this.RedisClient.watch(key);
    },

    /**
     * To apply multi commands and execute that commands in  redis.
     * @param "key" Key name.
     * @param "value" Value to be set in the key.
     * @param "callback" callback to be called when a value is received.
     */
    multi: function (key, value, callback) {
        var multi = this.RedisClient.multi();
        multi.set(key, value);
        multi.exec(function (err, res) {
            if (err) {
                callback(null);
            } else {
                callback(value);
            }
        });
    }
};

module.exports = RedisServer;
