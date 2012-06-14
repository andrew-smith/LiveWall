//static width and height
var WIDTH, HEIGHT;

//true if the mouse is down
var isMouseDown = false;

//socket.io connection
var socket;

//called when body is loaded
function canvas_init() 
{
    WIDTH = getCanvas().width();
    HEIGHT = getCanvas().height();
    
    //center container
    $('#container').center();
    
    changeColour(null, "000000");
    
    //clear rect
    var ctx = getGraphics();
    ctx.fillStyle = "#FFFFFF";  
    ctx.fillRect(0,0,WIDTH,HEIGHT); 
    
    //add enter event for chatmsg input
    $("#chatmsg").keyup(function(event){
        if(event.keyCode == 13) { //enter button
            chatBoxSubmit();
        }
    });
    
    //create random username
    $('#nametag').val('user' + Math.floor(Math.random()*1001));
    
    //start socket.io connection
    socket = io.connect(document.URL);
    
    socket.on('draw', updateDraw);
    socket.on('image', initStartImage);
    socket.on('chat', updateChat);
    
    
    //listen for disconnection
    socket.on('disconnect', function() {
        appendChat("<server> Whoops! Server went offline! *sad face*");
        appendChat("<server> Please refresh the page to attempt to reconnect");
    });
    
    //listen for when the server has disconnected and is attempting to reconnect
    socket.on('reconnecting', function(ms) {
        //this isn't implemented correctly in socket.io
    });
    
    //listen for when socket failed at reconneting
    socket.on('reconnect_failed', function(seconds) {
        //this isn't implemented correctly in socket.io
    });
    
    
    //listen for reconnection
    socket.on('reconnect', function() {
        //this will stuff things up, so instantly disconnect
        socket.disconnect();
        
        appendChat('\n\n\n');
        appendChat('<server> It appears the server is back online...');
        appendChat('<server> Reloading page now...');
        
        window.location.reload();
    });
    
    //called when canvas starts fresh
    socket.on('clear', function(data) {
        //clear rect
        var ctx = getGraphics();
        ctx.fillStyle = "#FFFFFF";  
        ctx.fillRect(0,0,WIDTH,HEIGHT);
        //tell user
        appendChat("<server> New whiteboard has been set!");
    });
    
    //tell user to wait while the server gets the latest wall
    appendChat("<server> Please wait while the wall is downloaded...");
}


//called when a chat message is received
function updateChat(data)
{
    //limit username size
    appendChat(data.user.substr(0, 10) + ": " + data.msg);
}

//adds new data to the chatbox
function appendChat(message)
{
    $('#chatbox').val($('#chatbox').val() + "\n" + message); 
    $('#chatbox').scrollTop($('#chatbox')[0].scrollHeight);
}

//sends a message to the server
function sendChat(user,msg)
{
    var data = {};
    data.user = user;
    data.msg = msg;
    socket.emit('chat', data);
}

//called when the chat box has data to send
function chatBoxSubmit()
{
    sendChat($('#nametag').val(), $('#chatmsg').val());
    $('#chatmsg').val(''); //clear the chat
}

//initial starting image (as a PNG string)
function initStartImage(imgStr)
{
    var startImage = new Image();
    startImage.src = imgStr;
    
    startImage.onload = function () {
        getGraphics().drawImage(startImage, 0, 0); 
        loadListeners()
        appendChat("<server> Wall has been downloaded! Draw away!");
    };
}

var listenersLoaded = false;
function loadListeners()
{
    if(!listenersLoaded)
    {
        //assign listeners to state that we have started
        getCanvas().mousemove(mouseMove);
        getCanvas().mousedown(mouseDown);
        getCanvas().mouseup(mouseUp);
        getCanvas().mouseenter(mouseUp);
    }

    listenersLoaded = true;
}

//updates a line from the server
function updateDraw(data) 
{
    //data will be a line to draw
    if(data.x1 && data.x2 && data.y1 && data.y2)
    {
        drawLine(data.x1, data.y1, data.x2, data.y2, data.fill);
    }
}

//draws a line
function drawLine(x1, y1, x2, y2, colour)
{
    var ctx = getGraphics();
    ctx.strokeStyle = '#'+colour;
    ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
    ctx.closePath();
    ctx.stroke();
}

//called when the color picker changes a colour
function changeColour(hsb, hex, rgb, el)
{
    current_fill = hex;
    $('#colorpickerHolder').css({'background-color' : '#'+current_fill})
}

//last coordinates
var last_x = 0;
var last_y = 0;

//current colour to fill the line with
var current_fill = "000000";

//called when the mouse moves
function mouseMove(e)
{
    var x = e.pageX - getCanvas().offset().left,
        y = e.pageY - getCanvas().offset().top;
    
    if(isMouseDown)
    {
        drawLine(last_x, last_y, x, y, current_fill);
        //send to server
        var data = {};
        data.x1 = last_x;
        data.y1 = last_y;
        data.x2 = x;
        data.y2 = y;
        data.fill = current_fill;
        
        socket.emit('draw', data);
    }
    
    last_x = x;
    last_y = y;
}


//called when the mouse is released
function mouseUp(e)
{
    isMouseDown = false;
}

//called when the mouse is clicked down
function mouseDown(e)
{
    isMouseDown = true;
}

//get a jquery canvas object (array)
function getCanvas()
{
    return $("#main_canvas");
}

//gets the graphics context for the only canvas on the page
function getGraphics()
{
    return getCanvas()[0].getContext('2d');
}


//from: http://stackoverflow.com/a/210733/462276
jQuery.fn.center = function () {
    this.css("position","absolute");
    //this.css("top", Math.max(0, (($(window).height() - this.outerHeight()) / 2) + 
    //                                            $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - this.outerWidth()) / 2) + 
                                                $(window).scrollLeft()) + "px");
    return this;
}
