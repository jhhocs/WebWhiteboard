// https://stackoverflow.com/questions/44270239/how-to-get-socket-id-of-a-connection-on-client-side

import io from "socket.io-client"
setTimeout(() => {
   let canvas = document.getElementById('whiteboard');
   let context = canvas.getContext('2d');
   let toolbar = document.getElementById('toolbar');
   let sessionID;
   let current;

   const socket = io.connect("https://webwhiteboard.onrender.com");
   //const socket = io.connect("http://localhost:3001"); // For local testing

   socket.on('connect', () => {
      sessionID = socket.id;

      current = {
         drawing: false,
         color: 'black',
         lineWidth: '2',
         x: 0,
         y: 0,
         sessionID: sessionID
      };
   });

   socket.on('startStroke', (line) => {
      if (line.sessionID == sessionID) {
         return;
      }
      startStroke(line);
   })

   socket.on('endStroke', (line) => {
      if (line.sessionID == sessionID) {
         return;
      }
      endStroke(line);
   })

   socket.on('stroke', (line) => {
      if (line.sessionID == sessionID) {
         return;
      }
      stroke(line);
   });

   socket.on('clear', clear);

   // Set the canvas size
   const canvasOffsetX = canvas.offsetLeft;
   const canvasOffsetY = canvas.offsetTop;
   canvas.width = window.innerWidth - 2*canvasOffsetX;
   canvas.height = window.innerHeight - canvasOffsetY;

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

   function endStroke(line) {
      current.drawing = false;
      context.stroke();
      context.beginPath();
   }

   canvas.addEventListener('mousedown', function (e) {
      current.x = e.clientX;
      current.y = e.clientY;
      startStroke(current);
      // if(!current.emit) {
      //    console.log("Don't emit");
      //    return;
      // }
      //current.emit = false;
      socket.emit('startStroke', current);
      //current.emit = true;
   });

   canvas.addEventListener('mousemove', function (e) {
      current.x = e.clientX;
      current.y = e.clientY;
      stroke(current);
      //if(!current.emit) return;

      //current.emit = false;
      socket.emit('stroke', current);
      //current.emit = true;
   });

   canvas.addEventListener('mouseup', function (e) {
      endStroke(current);
      // if(!current.emit) return;

      // current.emit = false;
      socket.emit('endStroke', current);
      //current.emit = true;
   });

   canvas.addEventListener('mouseleave', () => {
      endStroke(current);
      // if(!current.emit) return;

      // current.emit = false;
      socket.emit('endStroke', current);
      //current.emit = true;
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
}, "500")