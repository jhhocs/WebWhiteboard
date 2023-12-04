import './Brush.css';
import React, { useState } from 'react';


function Brush() { 
  const [isShown, setIsShown] = useState(false);
  const [val, setVal] = useState(2);

  const handleButtonClick = (cursorType) => {
    // Modify CSS for the entire document
    document.documentElement.style.cursor = cursorType;
    let state = isShown ? false : true;
    setIsShown(state);
  };


    if (isShown) {
      return (
        <>
          <div className='container'>
            <div className="brush-popup">
              <label htmlFor="width-picker">Radius</label>
              <input
                value={val}
                type="number"
                id="width-picker"
                name="width-picker"
                onChange={e => setVal(e.target.value)}
              />
              <input id="width-slider-picker" type="range" onChange={e => setVal(e.target.value)}
                value={val} min="1" max="50" 
              ></input>
            </div>
            <button id="brush" onClick={() => handleButtonClick('default')}>
              <img src={require("../../assets/brush.png")} alt="brush icon" />
            </button>
          </div>
        </>
      );
      
    }
    return (
      <>
        <button id="brush" onClick={() => handleButtonClick('default')}>
          <img src={require("../../assets/brush.png")} alt="brush icon" />
        </button>
      </>
    );;
  }
  
export default Brush;