import { forwardRef } from "react";

const Canvas = forwardRef(function Canvas(props, ref) {
    return <canvas ref={ref} id="whiteboard"></canvas>;
});

export default Canvas;