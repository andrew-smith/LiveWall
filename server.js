
//--------------------------------------------------------------
var log = require('logly');
var express, //express server instance
    io;      //socket.io instance


module.exports.init = function(server, socketio, cb)
{
    express = server;
    io = socketio;

};