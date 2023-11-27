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
    console.log(toolbar);
    console.log(canvas);

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
            x: 0,
            y: 0,
            sessionID: userID
          }
        };
    
        socket.on('startStroke', (line) => {
          if (line.sessionID === userID) {
            return;
          }
          startStroke(line);
        })
    
        socket.on('endStroke', (line) => {
            if (line.sessionID === userID) {
              return;
            }
            endStroke(line);
        })
    
        socket.on('stroke', (line) => {
          if (line.sessionID === userID) {
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

          socket.emit('startStroke', current);
        });
    
        canvas.addEventListener('mousemove', function (e) {
            current.x = e.clientX;
            current.y = e.clientY;
            stroke(current);

            socket.emit('stroke', current);
        });
    
        canvas.addEventListener('mouseup', function (e) {
            endStroke(current);

            socket.emit('endStroke', current);
        });
    
        canvas.addEventListener('mouseleave', () => {
            endStroke(current);

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
    }
  }, []);

  return (
    <div className="App">
      <Toolbar ref = {toolbarRef}/>
      <Canvas ref = {canvasRef}/>
    </div>
  
  );
}


export default App;
