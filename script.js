document.addEventListener('DOMContentLoaded', function () {
   var canvas = document.getElementById('whiteboard');
   var context = canvas.getContext('2d');
   var colorPicker = document.getElementById('color-picker');
   var clearButton = document.getElementById('clear');
   var eraserButton = document.getElementById('eraser');

   // Set the canvas size
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight - document.getElementById('toolbar').offsetHeight;

   var drawing = false;
   var current = {
      color: 'black'
   };

   var drawLine = function (x0, y0, x1, y1, color, emit) {
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.strokeStyle = color;
      context.lineWidth = 2;
      context.stroke();
      context.closePath();

      if (!emit) { return; }
      // This will be used for real-time event handling
   };

   canvas.addEventListener('mousedown', function (e) {
      drawing = true;
      current.x = e.clientX - canvas.offsetLeft;
      current.y = e.clientY - canvas.offsetTop;
   });

   canvas.addEventListener('mousemove', function (e) {
      if (!drawing) { return; }
      drawLine(current.x, current.y, e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, current.color, true);
      current.x = e.clientX - canvas.offsetLeft;
      current.y = e.clientY - canvas.offsetTop;
   });

   canvas.addEventListener('mouseup', function (e) {
      if (!drawing) { return; }
      drawing = false;
      drawLine(current.x, current.y, e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, current.color, true);
   });

   canvas.addEventListener('mouseleave', function (e) {
      drawing = false;
   });

   // Change the current color
   colorPicker.addEventListener('change', function (e) {
      current.color = e.target.value;
   });

   // Clear the canvas
   clearButton.addEventListener('click', function () {
      context.clearRect(0, 0, canvas.width, canvas.height);
   });

   // Eraser tool
   eraserButton.addEventListener('click', function () {
      current.color = '#ffffff'; // Set the current color to white (or the background color of your canvas)
   });
});
