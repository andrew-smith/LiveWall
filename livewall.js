
//--------------------------------------------------------------
// handles the socket.io connections and live streaming

//socket.io instance
var io;

module.exports.init = function(socketio, cb)
{
    //keep reference
    io = socketio;
    
    //what to do with a new connection
    io.sockets.on('connection', function (socket) {
    
        //need to send them the live image
        
        
        //assign listeners
        socket.on('draw', function(data) {
            drawChannel(socket, data);
        });
    });
    
    
    
    cb();
}


//called when a socket sends a chunk of data
function drawChannel(socket, data) 
{
    //need to update main drawing image

    //send update to all other clients
    io.sockets.emit('draw', data);
}