import './Brush.css';
import React, { useState } from 'react';


function Brush(props) { 
  const [val, setVal] = useState(2);

    if (props.isShown) {
      return (
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
            <button id="brush" onClick={props.handleClick}>
              <img src={require("../../assets/brush.png")} alt="brush icon" />
            </button>
          </div>
      );
      
    }
    return (
      <>
        <button id="brush" onClick={props.handleClick}>
          <img src={require("../../assets/brush.png")} alt="brush icon" />
        </button>
      </>
    );;
  }
  
export default Brush;