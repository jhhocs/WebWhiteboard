import { useParams } from 'react-router-dom';
import { useRef, useEffect, forwardRef } from 'react'
import './App.css';
import { socket } from './socket';

const Toolbar = forwardRef(function Toolbar(props, ref) {  

  return (
    <div id="toolbar" ref = {ref}>
        <button id="clear">
            <img src={require("./assets/clear.png")} alt="clear icon"/>
        </button>
        <div className="color-input-wrapper">
            <input type="color" id="color-picker"/>
        </div>
        <button id="eraser">
            <img src={require("./assets/eraser.png")} alt="eraser icon"/>
        </button>
        <label htmlFor="width-picker">Radius</label>
        <input defaultValue="2" type="number" id="width-picker" name="width-picker"/>
        {/* <!-- Add more tools as needed --> */}
      </div>
  );
});

const Canvas = forwardRef(function Canvas(props, ref) {
  return (
      <canvas ref = {ref} id="whiteboard"></canvas>
  );
});

function App() {
  let { roomID } = useParams();
  let userID = socket.id;
  console.log(roomID)

  const toolbarRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const toolbar = toolbarRef.current;
    const canvas = canvasRef.current

    if(userID) {
      start();
    }
  
    socket.on('connect', () => {
      userID = socket.id
      // console.log(userID);
      socket.emit("joinRoom", roomID);
      start();
    });

    function start() {
    
        let context = canvas.getContext('2d');
        let current = {
          room: roomID,
          line: {
            drawing: false,
            color: 'black',
            lineWidth: '2',
            lastx: 0,
            lasty: 0,
            x: 0,
            y: 0,
            userID: userID
          }
        };
    
        socket.on('startStroke', (line) => {

          if (line.userID === userID) {
            return;
          }
          startStroke(line);
        })
    
        socket.on('endStroke', (line) => {
            if (line.userID === userID) {
              return;
            }
            emitEndStroke(line);
        })
    
        socket.on('stroke', (line) => {
          if (line.userID === userID) {
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
          context.moveTo(line.lastx-canvasOffsetX, line.lasty-canvasOffsetY);
          context.lineTo(line.x-canvasOffsetX, line.y-canvasOffsetY);
          context.stroke();
        }
    
        function startStroke(line) {
          current.line.drawing = true;
          current.line.x = line.x;
          current.line.y = line.y;
          context.strokeStyle = line.color;
        }
    
        function endStroke(line) {
          current.line.drawing = false;
          context.stroke();
          context.beginPath();
        }

        function emitEndStroke(line) {
          context.stroke();
          context.beginPath();
        }
    
        canvas.addEventListener('mousedown', function (e) {
          current.line.lastx = current.line.x;
          current.line.lasty = current.line.y;
          current.line.x = e.clientX;
          current.line.y = e.clientY;
          startStroke(current.line);

          // socket.emit('startStroke', current);
        });
    
        canvas.addEventListener('mousemove', function (e) {
            current.line.lastx = current.line.x;
            current.line.lasty = current.line.y;
            current.line.x = e.clientX;
            current.line.y = e.clientY;
            stroke(current.line);

            socket.emit('stroke', current);
        });
    
        canvas.addEventListener('mouseup', function (e) {
            endStroke(current.line);

            socket.emit('endStroke', current);
        });
    
        canvas.addEventListener('mouseleave', () => {
            endStroke(current.line);

            socket.emit('endStroke', current);
        });
    
        function clear() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            console.log("clear");
        }


      toolbar.addEventListener('click', (e) => {
        // Clear tool
        if(e.target.id === 'clear') {
          clear()
          socket.emit('clear', roomID);
        }
        // Eraser tool
        if (e.target.id === 'eraser') {
          current.line.color = '#FFFFFF';
        }
      })
  
      toolbar.addEventListener('change', (e) => {
          // Color picker
          if (e.target.id === 'color-picker') {
            current.line.color = e.target.value;
          }
          // Width picker
          if (e.target.id === 'width-picker') {
            current.line.lineWidth = e.target.value;
          }
      })
    }
  }, []);

  return (
    <div className="App">
      <Toolbar ref = {toolbarRef}/>
      <Canvas ref = {canvasRef} />
    </div>
  
  );
}


export default App;
