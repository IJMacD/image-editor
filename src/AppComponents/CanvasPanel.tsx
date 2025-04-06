import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { StoreContext, DispatchContext } from "../Store/context";
import { editCompositeLayerInput, updateCanvas } from "../Store/project/actions";
import { BaseLayer, InputProperties } from "../types";
import { Editor } from "../Editor";
import checkerBoard from "../assets/bg.png";
import { isBaseLayer } from "../util/project";
import { getInputByPath, getLayerByPath } from "../util/ui";
import { selectIsMovable } from "../Store/ui/selectors";

export function CanvasPanel({ canvas, editableLayer, editableInput }: { canvas: HTMLCanvasElement | null, editableLayer?: BaseLayer, editableInput?: InputProperties }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null)
  const editorRef = useRef(new Editor)
  const [mouseDownPos, setMouseDownPos] = useState(null as {x: number, y: number}|null);
  const store = useContext(StoreContext);
  const dispatch = useContext(DispatchContext);

  if (editableLayer) {
    editorRef.current.setCanvases(editableLayer.canvas, overlayCanvasRef.current);
  }
  if (editableInput) {
    editorRef.current.setTransform(editableInput.transform);
  }

  const { tool, inputs: { selectedPath } } = store.ui;

  const pathIndex = selectedPath[selectedPath.length - 1];
  const pathParent = getLayerByPath(store.project, selectedPath.slice(0, -1));
  const pathInput = getInputByPath(store.project, selectedPath);
  const pathInputRef = useRef(new DOMMatrix([1,0,0,1,0,0]) as DOMMatrix2DInit);
  // Protect against invisible moves
  const isMovable = selectIsMovable(store)

  useEffect(() => {
    const { tool, toolOptions } = store.ui;
    editorRef.current.setTool(tool, toolOptions);
  }, [store.ui]);

  const width = canvas?.width || 512;
  const height = canvas?.height || 512;

  useEffect(() => {
    if (overlayCanvasRef.current) {
      overlayCanvasRef.current.width = width;
      overlayCanvasRef.current.height = height;
    }
  }, [width, height]);

  useEffect(() => {
    if (!canvasRef.current || canvasRef.current === canvas) {
      return;
    }

    const ctx = canvasRef.current.getContext("2d");

    if(!ctx) {
      return;
    }

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    if (canvas) {
      ctx.drawImage(canvas, 0, 0);
    }
  }, [canvas, width, height]);

  function handleMouseDown(e: React.MouseEvent<HTMLElement>) {
    if (canvasRef.current) {
      const elementOffset = canvasRef.current.getBoundingClientRect();
      const x = e.pageX - elementOffset.x;
      const y = e.pageY - elementOffset.y;

      editorRef.current.mouseDown({ x, y });

      setMouseDownPos({ x, y });

      if (tool === "move" && pathInput) {
        pathInputRef.current = pathInput.transform;
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

        const transform = DOMMatrix.fromMatrix(pathInputRef.current)
        transform.e += dx;
        transform.f += dy;

        dispatch(editCompositeLayerInput(pathParent.id, pathIndex, { transform }))
      }
    }
  }, [dispatch, mouseDownPos, editableLayer, tool, isMovable, pathParent, pathIndex]);

  const handleMouseUp = useCallback(() => {
    if (mouseDownPos && editableLayer && isBaseLayer(editableLayer)) {
      const newCanvas = editorRef.current.commit();
      if (newCanvas) {
        dispatch(updateCanvas(editableLayer.id, newCanvas));
      }
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
      className="m-8 relative border-1 inline-block"
      onMouseDown={handleMouseDown}
      style={{
        backgroundImage: `url(${checkerBoard})`,
        cursor: tool === "move" ? "move" : undefined,
      }}
    >
      <canvas
        ref={canvasRef}
      />
      <canvas
        ref={overlayCanvasRef}
        className="absolute inset-0"
        style={{
          display: mouseDownPos ? undefined : "none",
        }}
      />
    </div>
  );
}
