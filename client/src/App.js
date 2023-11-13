import './App.css';

//const socket = io.connect("https://websocket-test-ad1c.onrender.com");

function ToolBar() {
  return (
    <div id="toolbar">
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
}

function App() {
  return (
    <div className="App">

      <ToolBar/>

      <canvas id="whiteboard"></canvas>

      {/* <script src="/socket.io/socket.io.js"></script> */}
      <script src={require("./javascript/script.js")}></script>
    </div>
    
  );
}

export default App;
