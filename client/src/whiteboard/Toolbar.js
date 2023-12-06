import { forwardRef, useState } from "react";
import Brush from "../components/Brush/Brush";

const Toolbar = forwardRef(function Toolbar(props, ref) {
  const { onToggleNotepad } = props;
  const [isShown, setIsShown] = useState(false);
  const [toolbarClasses, setToolbarClasses] = useState("toolbar-open");
  const [arrowClass, setArrowClass] = useState("arrow-open");
  const [toolbarState, setToolbarState] = useState(true);
  const brushClick = (cursorType) => {
    // Modify CSS for the entire document
    let state = isShown ? false : true;
    setIsShown(state);
  };

  // Function to handle opening/closing toolbar
  const handleToolbar = (e) => {
    setToolbarState(toolbarState ? false : true);
    setToolbarClasses(toolbarState ? "toolbar-close" : "toolbar-open");
    setArrowClass(toolbarState ? "arrow-close" : "arrow-open");
    setIsShown(false);
  };


  return (
    <div className={toolbarClasses}>
      <div className="toolbar-container">
        <div id="toolbar" ref={ref}>
          <button id="clear" onClick={() => handleButtonClick("default")}>
            <img src={require("../assets/clear.png")} alt="clear icon" />
          </button>
          <button
            id="eraser"
            onClick={() =>
              handleButtonClick(
                `url(${require("../assets/erasercursor.png")}), auto`
              )
            }
          >
            <img src={require("../assets/eraser.png")} alt="eraser icon" />
          </button>
          <div className="color-input-wrapper">
            <input
              type="color"
              id="color-picker"
              onClick={() => handleButtonClick(`url(${require("../assets/pencilcursor.png")})0 50, auto`)}
            />
          </div>
          <Brush isShown={isShown} handleClick={brushClick}/>
          <button id="notepad" onClick={onToggleNotepad}>
            <img src={require("../assets/notepad.png")} alt="notepad icon" />
          </button>
          {/* <!-- Add more tools as needed --> */}
        </div>
      </div>
      <button className={arrowClass} onClick={handleToolbar}>
        <img
          className="arrow-icon"
          src={require("../assets/arrow.png")}
          alt="arrow icon"
        />
      </button>
    </div>
  );
});

const handleButtonClick = (cursorType) => {
  // Modify CSS for the entire document
  document.documentElement.style.cursor = cursorType;
};

export default Toolbar;
