
//--------------------------------------------------------------//main server function
var log = require('logly');
var express, //express server instance
    io;      //socket.io instance

//sets up all functions
module.exports.init = function(server, socketio, cb)
{
    express = server;
    io = socketio;
    cb();
};