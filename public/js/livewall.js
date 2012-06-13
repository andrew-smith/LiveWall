
//static width and height
var WIDTH, HEIGHT;

//true if the mouse is down
var isMouseDown = false;

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
    
    getCanvas().center();
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
        var ctx = getGraphics();
        ctx.beginPath();
            ctx.moveTo(last_x,last_y);
            ctx.lineTo(x,y);
        ctx.closePath();
        ctx.stroke();
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
