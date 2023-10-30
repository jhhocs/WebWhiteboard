const canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
var mouseDown = false;

canvas.onmousedown = () => {
    mouseDown = true;
}
canvas.onmouseup = () => {
    mouseDown = false;
}

canvas.onmousemove = (event) => {
    if(!mouseDown) {
        return;
    }
    draw(event);
}

function draw(event) {
    console.log("draw");
    var pos = getMousePosition(canvas, event);
  
    context.fillStyle = "#000000";
    context.fillRect (pos.x, pos.y, 2, 2);
  }

function getMousePosition(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}