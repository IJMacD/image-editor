import { MouseEvent, useContext, useEffect, useRef, useState } from "react";
import { StoreContext, DispatchContext } from "../Store/context";
import { editLayer } from "../Store/project/actions";
import { Layer } from "../types";

export function CanvasPanel ({ canvas, editableLayer }: { canvas: HTMLCanvasElement|null, editableLayer?: Layer }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mouseDown, setMouseDown] = useState(null as { x: number, y: number }|null);
  const store = useContext(StoreContext);
  const dispatch = useContext(DispatchContext);

  const toolColor = store.ui.toolOptions.color;
  const toolWidth = store.ui.toolOptions.width;

  useEffect(() => {
    if (!canvasRef.current || canvasRef.current === canvas) {
      return;
    }

    const ctx = canvasRef.current.getContext("2d");

    if(!ctx) {
      return;
    }

    if (editableLayer) {
      canvasRef.current.width = editableLayer.width;
      canvasRef.current.height = editableLayer.height;
    }
    else if (canvas) {
      canvasRef.current.width = canvas.width;
      canvasRef.current.height = canvas.height;
    }

    if (canvas) {
      ctx.drawImage(canvas, 0, 0);
    }
  }, [canvas]);

  function handleMouseDown (e: MouseEvent<HTMLCanvasElement>) {
    if (editableLayer) {
      const x = e.pageX - e.currentTarget.offsetLeft;
      const y = e.pageY - e.currentTarget.offsetTop;
      setMouseDown({ x, y });
    }
  }

  function handleMouseMove (e: MouseEvent<HTMLCanvasElement>) {
    if (mouseDown && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");

      if (!ctx) {
        return;
      }

      const { x: prevX, y: prevY } = mouseDown;

      const x = e.pageX - e.currentTarget.offsetLeft;
      const y = e.pageY - e.currentTarget.offsetTop;

      setMouseDown({ x, y });

      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(x, y);

      ctx.strokeStyle = toolColor;
      ctx.lineWidth = toolWidth;
      ctx.lineCap = "round"
      ctx.stroke();
    }
  }

  function handleMouseUp () {
    if (mouseDown && editableLayer && canvasRef.current) {
      setMouseDown(null);
      dispatch(editLayer(editableLayer.id, { canvas: canvasRef.current }));
    }
  }

  return <canvas
    ref={canvasRef}
    className="m-4 border-1"
    onMouseDown={handleMouseDown}
    onMouseMove={handleMouseMove}
    onMouseUp={handleMouseUp}
    onMouseLeave={handleMouseUp}
  />;
}