import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { StoreContext, DispatchContext } from "../Store/context";
import { editLayer } from "../Store/project/actions";
import { Layer } from "../types";
import { Editor } from "../Editor";
import checkerBoard from "../assets/bg.png";

export function CanvasPanel ({ canvas, editableLayer }: { canvas: HTMLCanvasElement|null, editableLayer?: Layer }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null)
  const editorRef = useRef(new Editor)
  const [isMouseDown, setIsMouseDown] = useState(false);
  const store = useContext(StoreContext);
  const dispatch = useContext(DispatchContext);

  editorRef.current.setCanvases(canvasRef.current, overlayCanvasRef.current);

  useEffect(() => {
    const { tool, toolOptions } = store.ui;
    editorRef.current.setTool(tool, toolOptions);
  }, [store.ui]);

  useEffect(() => {
    if (!canvasRef.current || !overlayCanvasRef.current || canvasRef.current === canvas) {
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

    overlayCanvasRef.current.width = canvasRef.current.width;
    overlayCanvasRef.current.height = canvasRef.current.height;

    if (canvas) {
      ctx.drawImage(canvas, 0, 0);
    }
  }, [canvas, editableLayer]);

  function handleMouseDown(e: React.MouseEvent<HTMLElement>) {
    if (canvasRef.current && editableLayer) {
      const elementOffset = canvasRef.current.getBoundingClientRect();
      const x = e.pageX - elementOffset.x;
      const y = e.pageY - elementOffset.y;

      editorRef.current.mouseDown({ x, y }, e.nativeEvent);

      setIsMouseDown(true);
    }
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isMouseDown && canvasRef.current) {
      const elementOffset = canvasRef.current.getBoundingClientRect();
      const x = e.pageX - elementOffset.x;
      const y = e.pageY - elementOffset.y;

      editorRef.current.mouseMove({ x, y }, e);
    }
  }, [isMouseDown]);

  const handleMouseUp = useCallback(() => {
    if (isMouseDown && editableLayer && canvasRef.current) {
      editorRef.current.mouseUp();
      dispatch(editLayer(editableLayer.id, { canvas: canvasRef.current }));
      setIsMouseDown(false);
    }
  }, [isMouseDown, editableLayer, dispatch]);


  useEffect(() => {
    if (isMouseDown) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("mouseleave", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mouseleave", handleMouseUp);
      }
    }
  }, [isMouseDown, handleMouseMove, handleMouseUp]);

  return (
    <div
      className="m-4 relative border-1 inline-block"
      onMouseDown={handleMouseDown}
      style={{backgroundImage: `url(${checkerBoard})`}}
    >
      <canvas
        ref={canvasRef}
      />
      <canvas
        ref={overlayCanvasRef}
        className="absolute inset-0"
      />
    </div>
  );
}