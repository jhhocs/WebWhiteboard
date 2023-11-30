const CircularCursor = ({ position }) => {
  const cursorStyle = {
    left: `${position.x}px`,
    top: `${position.y}px`,
    position: "absolute",
    pointerEvents: "none",
    backgroundColor: "transparent",
    border: "1px solid black",
    height: "20px",
    width: "20px",
    borderRadius: "50%",
    zIndex: 1000,
  };

  return <div style={cursorStyle}></div>;
};

export default CircularCursor;