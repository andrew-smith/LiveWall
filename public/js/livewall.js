
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
    
    //assign listeners
    getCanvas().mousemove(mouseMove);
    getCanvas().mousedown(mouseDown);
    getCanvas().mouseup(mouseUp);
    getCanvas().mouseenter(mouseUp);
    
    //clear rect
    var ctx = getGraphics();
    ctx.fillStyle = "#FFFFFF";  
    ctx.fillRect(0,0,WIDTH,HEIGHT); 
    
    //center canvas
    getCanvas().center();
    
    alert(document.URL);
    socket = io.connect(document.URL);
    
    socket.on('draw', updateDraw);
}




//updates a line from the server
function updateDraw(data) 
{
    //data will be a line to draw
    if(data.x1 && data.x2 && data.y1 && data.y2)
    {
        drawLine(data.x1, data.y1, data.x2, data.y2);
    }
}

//draws a line
function drawLine(x1, y1, x2, y2)
{
    var ctx = getGraphics();
    ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
    ctx.closePath();
    ctx.stroke();
}


//last coordinates
var last_x = 0;
var last_y = 0;

//called when the mouse moves
function mouseMove(e)
{
    var x = e.pageX - getCanvas().offset().left,
        y = e.pageY - getCanvas().offset().top;
    
    if(isMouseDown)
    {
        drawLine(last_x, last_y, x, y);
        //send to server
        var data = {};
        data.x1 = last_x;
        data.y1 = last_y;
        data.x2 = x;
        data.y2 = y;
        
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
    this.css("top", Math.max(0, (($(window).height() - this.outerHeight()) / 2) + 
                                                $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - this.outerWidth()) / 2) + 
                                                $(window).scrollLeft()) + "px");
    return this;
}
