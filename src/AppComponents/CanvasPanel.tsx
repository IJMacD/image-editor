import { MouseEvent, useContext, useEffect, useRef, useState } from "react";
import { ProjectDispatchContext } from "../Store/context";
import { editLayer } from "../Store/actions";
import { Layer } from "../types";

export function CanvasPanel ({ canvas, editableLayer }: { canvas: HTMLCanvasElement|null, editableLayer?: Layer }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mouseDown, setMouseDown] = useState(false);
  const dispatch = useContext(ProjectDispatchContext);

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

  function handleMouseDown () {
    if (editableLayer) {
      setMouseDown(true);
    }
  }

  function handleMouseMove (e: MouseEvent<HTMLCanvasElement>) {
    if (mouseDown && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");

      if (!ctx) {
        return;
      }

      const x = e.pageX - e.currentTarget.offsetLeft;
      const y = e.pageY - e.currentTarget.offsetTop;

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function handleMouseUp () {
    if (mouseDown && editableLayer && canvasRef.current) {
      setMouseDown(false);
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