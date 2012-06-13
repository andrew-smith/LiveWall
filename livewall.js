
//--------------------------------------------------------------
// handles the socket.io connections and live streaming

var config = require('./config');

//socket.io instance
var io;



//the canvas constructor
var Canvas = require('canvas');
//a global canvas object that will be the 'database' almost...
var canvas;

module.exports.init = function(socketio, cb)
{
    //keep reference
    io = socketio;
    
    //what to do with a new connection
    io.sockets.on('connection', function (socket) {
    
        //need to send them the live image
        sendLiveImage(socket);
        
        
        //assign listeners
        socket.on('draw', function(data) {
            drawChannel(socket, data);
        });
    });
    
    //create a global canvas to use
    canvas = new Canvas(config.canvas_width, config.canvas_height);
    
    
    //start up a cronjob to make a new image every hour (at half past
    var cronJob = require('cron').CronJob;
    new cronJob('1 30 * * * *', function(){
        var fs = require('fs')
          , out = fs.createWriteStream(__dirname + '/temp/' + new Date().toString() + '.png')
          , stream = canvas.createPNGStream();

        stream.on('data', function(chunk){
            out.write(chunk);
        });

        stream.on('end', function(){
            //create a new canvas so everyone can start again
            canvas = new Canvas(config.canvas_width, config.canvas_height);
            //tell everyone about it
            io.sockets.emit('clear', 'true');
        });
    }, null, true);
    
    cb();
}


//called when a socket sends a chunk of data
function drawChannel(socket, data) 
{
    //need to update main drawing image
    var ctx = ctx = canvas.getContext("2d"); //the context to draw to
    ctx.strokeStyle = '#' + data.fill;
    ctx.beginPath();
        ctx.moveTo(data.x1,data.y1);
        ctx.lineTo(data.x2,data.y2);
    ctx.closePath();
    ctx.stroke(); 

    //send update to all other clients
    io.sockets.emit('draw', data);
}


//sends the current live image to a socket
function sendLiveImage(socket)
{
    canvas.toDataURL('image/png', function(err, str){
        socket.emit('image', str);
    });
}