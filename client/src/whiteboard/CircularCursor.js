const CircularCursor = ({ position, size }) => {
  const cursorStyle = {
    left: `${position.x -(size / 2)}px`,
    top: `${position.y- (size / 2)}px`,
    position: "absolute",
    pointerEvents: "none",
    backgroundColor: "transparent",
    border: "1px solid black",
    height: `${size}px`,
    width: `${size}px`,
    borderRadius: "50%",
    zIndex: 1000,
  };

  return <div style={cursorStyle}></div>;
};

export default CircularCursor;