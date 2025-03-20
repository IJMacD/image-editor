import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { StoreContext, DispatchContext } from "../Store/context";
import { editBaseLayer, editCompositeLayerInput } from "../Store/project/actions";
import { Layer } from "../types";
import { Editor } from "../Editor";
import checkerBoard from "../assets/bg.png";
import { isBaseLayer } from "../util/project";
import { getInputByPath, getLayerByPath } from "../util/ui";
import { selectIsMovable } from "../Store/ui/selectors";

export function CanvasPanel ({ canvas, editableLayer }: { canvas: HTMLCanvasElement|null, editableLayer?: Layer }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null)
  const editorRef = useRef(new Editor)
  const [mouseDownPos, setMouseDownPos] = useState(null as {x: number, y: number}|null);
  const store = useContext(StoreContext);
  const dispatch = useContext(DispatchContext);

  editorRef.current.setCanvases(canvasRef.current, overlayCanvasRef.current);

  const { tool, inputs: { selectedPath } } = store.ui;

  const pathIndex = selectedPath[selectedPath.length - 1];
  const pathParent = getLayerByPath(store.project, selectedPath.slice(0, -1));
  const pathInput = getInputByPath(store.project, selectedPath);
  const pathInputRef = useRef({x: 0, y: 0});
  // Protect against invisible moves
  const isMovable = selectIsMovable(store)

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
    if (canvasRef.current) {
      const elementOffset = canvasRef.current.getBoundingClientRect();
      const x = e.pageX - elementOffset.x;
      const y = e.pageY - elementOffset.y;

      editorRef.current.mouseDown({ x, y });

      setMouseDownPos({ x, y });

      if (tool === "move" && pathInput) {
        pathInputRef.current = pathInput;
      }
    }
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (mouseDownPos && canvasRef.current) {
      const elementOffset = canvasRef.current.getBoundingClientRect();
      const x = e.pageX - elementOffset.x;
      const y = e.pageY - elementOffset.y;

      if (editableLayer) {
        editorRef.current.mouseMove({ x, y }, e);
      }

      if (tool === "move" && isMovable && pathParent && typeof pathIndex === "number") {
        const dx = x - mouseDownPos.x;
        const dy = y - mouseDownPos.y;
        const x2 = pathInputRef.current.x + dx;
        const y2 = pathInputRef.current.y + dy;

        dispatch(editCompositeLayerInput(pathParent.id, pathIndex, { x: x2, y: y2 }))
      }
    }
  }, [mouseDownPos, editableLayer, tool, isMovable, pathParent, pathIndex]);

  const handleMouseUp = useCallback(() => {
    if (mouseDownPos && editableLayer && isBaseLayer(editableLayer) && canvasRef.current) {
      editorRef.current.mouseUp();
      dispatch(editBaseLayer(editableLayer.id, { canvas: canvasRef.current }));
    }
    setMouseDownPos(null);
  }, [mouseDownPos, editableLayer, dispatch]);


  useEffect(() => {
    if (mouseDownPos) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("mouseleave", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mouseleave", handleMouseUp);
      }
    }
  }, [mouseDownPos, handleMouseMove, handleMouseUp]);

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
        style={{display: mouseDownPos ? undefined : "none"}}
      />
    </div>
  );
}
