
//--------------------------------------------------------------//main server function
var log = require('logly');

//config file
var config = require('./config');

//the file system
var fs = require('fs');

//live wall handler
var livewall = require('./livewall');
var express, //express server instance
    io;      //socket.io instance

//sets up all functions
module.exports.init = function(server, socketio, cb)
{
    express = server;
    io = socketio;
    
    //set up main page
    express.get('/', pageLog, pageRequested_index);
    //load javascript
    express.get('/js/*', pageLog, loadAnyPage);
    //css
    express.get('/css/*', pageLog, loadAnyPage);
    //images
    express.get('/images/*', pageLog, loadAnyPage);
    
    //load everything else (ie 404 error)
    express.get('*', pageLog, pageRequested_404);
    
    //init the live wall
    livewall.init(io, cb);
};

//logs the page that was requested
function pageLog(req, res, next) {
    var pageName = req.url;
    log.verbose("Requested: " + pageName);
    next();
}

//load index page
function pageRequested_index(req, res) {
    var params = {};
    //send the canvas width and height
    params.canvas_width = config.canvas_width;
    params.canvas_height = config.canvas_height;
    res.render(config.web.public_dir + "/index.jade", params);
};


//attempts to load any page
function loadAnyPage(req, res) {
    var scriptName = config.web.public_dir + req.url.split("?", 2)[0];
    fs.readFile(scriptName, function(error, data) {
        if(error) //will be thrown if file not found
        {            
            pageRequested_404(req, res);
        }
        else
        {
            res.contentType(scriptName);
            res.send(data);
        }
    });
}


//called when file cannot be found
function pageRequested_404(req, res) {

    var params = {};

    params.url = req.originalUrl;
    params.status = 404;
    params.pageTitle = "ERROR: " + params.status;
    params.errormsg = "Cannot find page " + params.url;
    log.warn("Page not found: " + params.url);

    res.render(config.web.public_dir + 'error.jade', params);

}
