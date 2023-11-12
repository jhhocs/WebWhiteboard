document.addEventListener('DOMContentLoaded', function () {
   var canvas = document.getElementById('whiteboard');
   var context = canvas.getContext('2d');

   let toolbar = document.getElementById('toolbar');

   const socket = io();

   socket.on('draw', (line) => {
      drawLine(line.x0, line.y0, line.x1, line.y1, line.color, line.emit);
   });

   socket.on('clear', clear);

   // Set the canvas size
   const canvasOffsetX = canvas.offsetLeft;
   const canvasOffsetY = canvas.offsetTop;
   canvas.width = window.innerWidth - canvasOffsetX;
   canvas.height = window.innerHeight - document.getElementById('toolbar').offsetHeight - canvasOffsetY;

   var drawing = false;
   var current = {
      color: 'black',
   };

   function drawLine (x0, y0, x1, y1, color, emit) {
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.strokeStyle = color;
      context.lineWidth = 2;
      context.stroke();
      context.closePath();

      if (!emit) { return; }
      // This will be used for real-time event handling
      let line = {
         x0: x0,
         y0: y0,
         x1: x1,
         y1: y1,
         color: color,
         emit: false
      }

      socket.emit('draw', line);
 
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

   function clear() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      console.log("clear");
   }

   toolbar.addEventListener('click', (e) => {
      // Clear tool
      if(e.target.id === 'clear') {
         clear()
         socket.emit('clear');
      }
      // Eraser tool
      if (e.target.id === 'eraser') {
         current.color = '#FFFFFF';
      }
   })

   toolbar.addEventListener('change', (e) => {
      // Color picker
      if (e.target.id === 'color-picker') {
         current.color = e.target.value;
      }
   })
});
