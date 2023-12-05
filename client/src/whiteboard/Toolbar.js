import { forwardRef } from "react";
import Brush from "../components/Brush/Brush";

const Toolbar = forwardRef(function Toolbar(props, ref) {
  const { onToggleNotepad } = props;
  return (
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
            onClick={() => handleButtonClick("default")}
          />
        </div>
        <Brush />
        <button id="notepad" onClick={onToggleNotepad}>
          <img src={require("../assets/notepad.png")} alt="notepad icon" />
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

export default Toolbar;
