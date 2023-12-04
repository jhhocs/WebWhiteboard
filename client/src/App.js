import { useParams } from "react-router-dom";
import { useState, useRef, useEffect, forwardRef } from "react";
import CircularCursor from "./CircularCursor";
import "./App.css";
import { socket } from "./socket";
import Brush from "./components/Brush/Brush";

const Toolbar = forwardRef(function Toolbar(props, ref) {  
  return (
    <div className="toolbar-container">
      <div id="toolbar" ref={ref}>
        <button id="clear" onClick={() => handleButtonClick('default')}>
          <img src={require("./assets/clear.png")} alt="clear icon" />
        </button>
        <button id="eraser" onClick={() => handleButtonClick(`url(${require("./assets/erasercursor.png")}), auto`)}>
          <img src={require("./assets/eraser.png")} alt="eraser icon" />
        </button>
        <div className="color-input-wrapper">
          <input type="color" id="color-picker" onClick={() => handleButtonClick('default')}/>
        </div>
        <Brush />
        <button id="notepad">
          <img src={require("./assets/notepad.png")} alt="notepad icon" input="true" type="color" id="color-picker2" />
        </button>
        {/* <!-- Add more tools as needed --> */}
      </div>
    </div>
  );
});

const handleButtonClick = (cursorType) => {
  // Modify CSS for the entire document
  document.documentElement.style.cursor = cursorType;
};

const Canvas = forwardRef(function Canvas(props, ref) {
  return <canvas ref={ref} id="whiteboard"></canvas>;
});

function App() {
  let { roomID } = useParams();
  let userID = socket.id;
  // console.log(roomID);

  const toolbarRef = useRef(null);
  const canvasRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 }); // Cursor position state
  const [cursorSize, setCursorSize] = useState(2);
  const [isNotepadActive, setIsNotepadActive] = useState(false);
  const [notepadContent, setNotepadContent] = useState("");
  const [toolbarClasses, setToolbarClasses] = useState("toolbar-open");
  const [arrowClass, setArrowClass] = useState("arrow-open")
  const [toolbarState, setToolbarState] = useState(true);

  // Additional state for tracking sticky note position
  const [stickyNotePosition, setStickyNotePosition] = useState({
    top: 50,
    left: 50,
  });

  const [isDragging, setIsDragging] = useState(false);

  // Function to handle opening/closing toolbar
  const handleToolbar = (e) => {
    setToolbarState(toolbarState ? false : true);
    setToolbarClasses(toolbarState ? "toolbar-close" : "toolbar-open");
    setArrowClass(toolbarState ? "arrow-close" : "arrow-open");
  }

  // Function to handle dragging start
  const handleDragStart = (e) => {
    setIsDragging(true);
  };
  
  // Function to handle dragging end
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  // Function to handle dragging
  const handleDrag = (e) => {
    if (isDragging) {
      const newTop = e.clientY - 10; // Adjust the offset as needed
      const newLeft = e.clientX - 10; // Adjust the offset as needed
      setStickyNotePosition({ top: newTop, left: newLeft });
    }
  };
  
    useEffect(() => {
      document.addEventListener("mousemove", handleDrag);
      document.addEventListener("mouseup", handleDragEnd);
  
      return () => {
        document.removeEventListener("mousemove", handleDrag);
        document.removeEventListener("mouseup", handleDragEnd);
      };
  }, [isDragging]);

  useEffect(() => {
    const toolbar = toolbarRef.current;
    const canvas = canvasRef.current;
    if (userID) {
      start();
    }

    // Handles case where user joins from Home screen
    if(socket.connected) {
      socket.emit("joinRoom", roomID);
    }

    socket.on("connect", () => {
      userID = socket.id;
      // console.log(userID);
      socket.emit("joinRoom", roomID);
      start();
    });

    function start() {
      let context = canvas.getContext("2d");
      let current = {
        room: roomID,
        line: {
          drawing: false,
          color: "black",
          lineWidth: "2",
          lastx: 0,
          lasty: 0,
          x: 0,
          y: 0,
          userID: userID,
        },
      };

      socket.on("startStroke", (line) => {
        if (line.userID === userID) {
          return;
        }
        startStroke(line);
      });

      socket.on("endStroke", (line) => {
        if (line.userID === userID) {
          return;
        }
        emitEndStroke(line);
      });

      socket.on("stroke", (line) => {
        if (line.userID === userID) {
          return;
        }
        stroke(line);
      });

      socket.on("loadImage", (dataURL) => {
        var img = new Image();
        img.src = dataURL;
        img.onload=start;
        function start() {
          context.drawImage(img, 0, 0)
        } 
      });

      socket.on("clear", clear);

      // Set the canvas size
      const canvasOffsetX = canvas.offsetLeft;
      const canvasOffsetY = canvas.offsetTop;
      canvas.width = window.innerWidth - 2 * canvasOffsetX;
      canvas.height = window.innerHeight - canvasOffsetY;

      function stroke(line) {
        if (!line.drawing) return;
        context.lineWidth = line.lineWidth;
        context.lineCap = "round";
        context.strokeStyle = line.color;
        context.beginPath();
        context.moveTo(line.lastx - canvasOffsetX, line.lasty - canvasOffsetY);
        context.lineTo(line.x - canvasOffsetX, line.y - canvasOffsetY);
        context.stroke();
      }

      function startStroke(line) {
        current.line.drawing = true;
        current.line.x = line.x;
        current.line.y = line.y;
        //   context.strokeStyle = line.color;
      }

      function endStroke(line) {
        current.line.drawing = false;
        context.stroke();
      }

      function emitEndStroke(line) {
        context.stroke();
        context.beginPath();
      }

      canvas.addEventListener("mousedown", function (e) {
        current.line.lastx = current.line.x;
        current.line.lasty = current.line.y;
        current.line.x = e.clientX;
        current.line.y = e.clientY;
        startStroke(current.line);
        stroke(current.line);

        // socket.emit('startStroke', current);
      });

      canvas.addEventListener("mousemove", function (e) {
        current.line.lastx = current.line.x;
        current.line.lasty = current.line.y;
        current.line.x = e.clientX;
        current.line.y = e.clientY;
        stroke(current.line);

        socket.emit("stroke", current);
      });

      canvas.addEventListener("mouseup", function (e) {
        endStroke(current.line);

        var dataURL = canvas.toDataURL();
        socket.emit("image", {room: roomID, dataURL: dataURL})
        socket.emit("endStroke", current);
      });

      canvas.addEventListener("mouseleave", () => {
        endStroke(current.line);

        socket.emit("endStroke", current);
      });
      
      // canvas.addEventListener("mouseenter", () => {

      // });

      function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        console.log("clear");
      }

      toolbar.addEventListener("click", (e) => {
        // Clear tool
        if (e.target.id === "clear") {
          clear();
          socket.emit("clear", roomID);
        }
        // Eraser tool
        if (e.target.id === "eraser") {
          current.line.color = "#FFFFFF";
        }
        // Color picker w/out changing color
        if (e.target.id === "color-picker") {
          current.line.color = e.target.value;
        }
        // Notepad tool
        if (e.target.id === "notepad") {
          toggleNotepad();
        }
      });

      toolbar.addEventListener("change", (e) => {
        // Color picker
        if (e.target.id === "color-picker") {
          current.line.color = e.target.value;
        }
        // Width picker
        if (e.target.id === "width-picker") {
          current.line.lineWidth = e.target.value;
          setCursorSize(e.target.value)
        }
        if (e.target.id === "width-slider-picker") {
          current.line.lineWidth = e.target.value;
          setCursorSize(e.target.value)
        }
      });

      function toggleNotepad() {
        setIsNotepadActive((prev) => !prev);
        
        if (!isNotepadActive) {
          // Set initial sticky note position when notepad becomes active
          setStickyNotePosition({
            top: 50, // Set the desired initial top position
            left: 50, // Set the desired initial left position
          });
        }
      
        reduceCanvasSize();
      }

      function reduceCanvasSize() {
        // Adjust canvas size for notepad
        const notepadWidth = 300;
        const canvasWidth = isNotepadActive ? window.innerWidth - notepadWidth : window.innerWidth;

        canvas.width = canvasWidth;

        // Adjust textarea/input width
        const textarea = document.querySelector("textarea");
        if (textarea) {
          textarea.style.width = isNotepadActive ? notepadWidth + "px" : "100%";
        }
      }

      function clearCanvas() {
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        console.log("clear");
      }

      // Add event listener for mouse movement
      const moveCursor = (e) => {
        setCursorPosition({ x: e.pageX, y: e.pageY });
      };
      document.addEventListener("mousemove", moveCursor);

      // Cleanup
      return () => {
        document.removeEventListener("mousemove", moveCursor);
      };
    }
  }, []);

  return (
    <div className="App">
      {isNotepadActive && (
        <div
          style={{
            position: "absolute",
            top: `${stickyNotePosition.top}px`,
            left: `${stickyNotePosition.left}px`,
            zIndex: 2,
          }}
          onMouseDown={handleDragStart}
        >
          <textarea
            value={notepadContent}
            onChange={(e) => setNotepadContent(e.target.value)}
            placeholder="Type here..."
            style={{
              width: isNotepadActive ? "300px" : "100%",
              height: "200px", // Adjust the height as needed
              border: "1px solid #ccc",
              padding: "10px",
              resize: "none",
              background: "yellow"
            }}
          />
        </div>
      )}
      <CircularCursor position={cursorPosition} size={cursorSize}/>
      <div className={toolbarClasses}>
        <Toolbar ref={toolbarRef}/>
        <button className={arrowClass} onClick={handleToolbar}>
          <img className="arrow-icon" src={require("./assets/arrow.png")} alt="arrow icon" />
        </button>
      </div>
      <Canvas ref={canvasRef}/>
    </div>
  );
}

export default App;