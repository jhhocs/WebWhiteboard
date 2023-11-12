document.addEventListener('DOMContentLoaded', function () {
   let canvas = document.getElementById('whiteboard');
   let context = canvas.getContext('2d');
   let toolbar = document.getElementById('toolbar');

   const socket = io();

   socket.on('startStroke', (line) => {
      startStroke(line);
   })

   socket.on('endStroke', (line) => {
      endStroke(line);
   })

   socket.on('stroke', stroke);

   socket.on('clear', clear);

   // Set the canvas size
   const canvasOffsetX = canvas.offsetLeft;
   const canvasOffsetY = canvas.offsetTop;
   canvas.width = window.innerWidth - 2*canvasOffsetX;
   canvas.height = window.innerHeight - canvasOffsetY;

   let current = {
      drawing: false,
      color: 'black',
      lineWidth: '2',
      x: 0,
      y: 0,
   };

   function stroke(line) {
      if (!line.drawing) return;
      context.lineWidth = line.lineWidth;
      context.lineCap = 'round';
      context.strokeStyle = line.color
      context.lineTo(line.x-canvasOffsetX, line.y-canvasOffsetY);
      context.stroke();
   }

   function startStroke(line) {
      current.drawing = true;
      current.x = line.x;
      current.y = line.y;
   }

   function endStroke() {
      current.drawing = false;
      context.stroke();
      context.beginPath()
   }

   canvas.addEventListener('mousedown', function (e) {
      current.x = e.clientX;
      current.y = e.clientY;
      startStroke(current);
      socket.emit('startStroke', current)
   });

   canvas.addEventListener('mousemove', function (e) {
      current.x = e.clientX;
      current.y = e.clientY;
      stroke(current);
      socket.emit('stroke', current)
   });

   canvas.addEventListener('mouseup', function (e) {
      endStroke()
      socket.emit('endStroke')
   });

   canvas.addEventListener('mouseleave', () => {
      endStroke()
      socket.emit('endStroke')
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
      // Width picker
      if (e.target.id === 'width-picker') {
         current.lineWidth = e.target.value;
      }
   })
});
