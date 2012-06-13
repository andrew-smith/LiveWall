
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
    
    
    
    socket = io.connect(document.URL);
    
    socket.on('draw', updateDraw);
    socket.on('image', initStartImage);
}


//initial starting image (as a PNG string)
function initStartImage(imgStr)
{
    console.log(imgStr);
    
    var startImage = new Image();
    startImage.src = imgStr;
    
    startImage.onload = function () {
        getGraphics().drawImage(startImage, 0, 0); 
        
        //assign listeners to state that we have started
        getCanvas().mousemove(mouseMove);
        getCanvas().mousedown(mouseDown);
        getCanvas().mouseup(mouseUp);
        getCanvas().mouseenter(mouseUp);
    };
    
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



function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [r * 255, g * 255, b * 255];
}