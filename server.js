
//--------------------------------------------------------------//main server function
var log = require('logly');

//config file
var config = require('./config');

//the file system
var fs = require('fs');
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
    express.get('/js/*', pageLog, pageRequested_js);
    
    //load everything else (ie 404 error)
    express.get('*', pageLog, pageRequested_404);
    cb();
};

//logs the page that was requested
function pageLog(req, res, next) {
    var pageName = req.url;
    log.verbose("Requested: " + pageName);
    next();
}

//load index page
function pageRequested_index(req, res) {

    
    var options = {};
    res.render(config.web.public_dir + "/index.jade", options);
};


//load a javascript page
function pageRequested_js(req, res) {
    
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



function pageRequested_404(req, res) {

    var params = {};

    params.url = req.originalUrl;
    params.status = 404;
    params.pageTitle = "ERROR: " + params.status;
    params.errormsg = "Cannot find page " + params.url;
    log.warn("Page not found: " + params.url);

    res.render(config.web.public_dir + 'error.jade', params);

}