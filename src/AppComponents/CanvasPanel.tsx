import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { StoreContext, DispatchContext } from "../Store/context";
import { editBaseLayer, editCompositeLayerInput } from "../Store/project/actions";
import { InputProperties, Layer } from "../types";
import { Editor } from "../Editor";
import checkerBoard from "../assets/bg.png";
import { isBaseLayer } from "../util/project";
import { getInputByPath, getLayerByPath } from "../util/ui";
import { selectIsMovable } from "../Store/ui/selectors";

export function CanvasPanel ({ canvas, editableLayer, input }: { canvas: HTMLCanvasElement|null, editableLayer?: Layer, input?: InputProperties }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null)
  const editorRef = useRef(new Editor)
  const [mouseDownPos, setMouseDownPos] = useState(null as {x: number, y: number}|null);
  const store = useContext(StoreContext);
  const dispatch = useContext(DispatchContext);

  const [overlayMouseDownPos, setOverlayMouseDownPos] = useState(null as {x: number, y: number}|null);
  const inputHandleRef = useRef(-1);

  editorRef.current.setCanvases(canvasRef.current, overlayCanvasRef.current);

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

  useEffect(() => {
    if (input) {
      const ctx = overlayCanvasRef.current?.getContext("2d");

      if (!ctx) {
        return;
      }

      ctx.strokeStyle = "#666666";
      ctx.setLineDash([4,4])
      ctx.beginPath()
      for (const p of input.nonLinear) {
        ctx.lineTo(p[0], p[1]);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#0000FF";
      ctx.strokeStyle = "#DDDDFF";
      ctx.lineWidth = 2;
      for (const p of input.nonLinear) {
        ctx.beginPath()
        ctx.arc(p[0], p[1], 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

    }
  }, [input])

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
      document.addEventListener("pointermove", handleMouseMove);
      document.addEventListener("pointerup", handleMouseUp);
      document.addEventListener("pointerleave", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mouseleave", handleMouseUp);
        document.removeEventListener("pointermove", handleMouseMove);
        document.removeEventListener("pointerup", handleMouseUp);
        document.removeEventListener("pointerleave", handleMouseUp);
      }
    }
  }, [mouseDownPos, handleMouseMove, handleMouseUp]);

  function handleOverlayMouseDown(e: React.MouseEvent) {
    if (input && overlayCanvasRef.current) {
      const elementOffset = overlayCanvasRef.current.getBoundingClientRect();
      const x = e.pageX - elementOffset.x;
      const y = e.pageY - elementOffset.y;

      for (let i = 0; i < 4; i++) {
        const p = input.nonLinear[i];
        const dx = x - p[0];
        const dy = y - p[1];
        const r2 = dx * dx + dy * dy;
        if (r2 < 100) {
          setOverlayMouseDownPos({ x, y });
          inputHandleRef.current = i;
        }
      }
    }
  }

  const handleOverlayMouseMove = useCallback((e: MouseEvent) => {
    if (overlayMouseDownPos && overlayCanvasRef.current && inputHandleRef.current >= 0) {
      const elementOffset = overlayCanvasRef.current.getBoundingClientRect();
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
      dispatch(editCompositeLayerInput())
    }
  }, [mouseDownPos, editableLayer, tool, isMovable, pathParent, pathIndex]);

  const handleOverlayMouseUp = useCallback(() => {
    if (mouseDownPos && editableLayer && isBaseLayer(editableLayer) && canvasRef.current) {
      editorRef.current.mouseUp();
      dispatch(editBaseLayer(editableLayer.id, { canvas: canvasRef.current }));
    }
    setMouseDownPos(null);
  }, [mouseDownPos, editableLayer, dispatch]);

  useEffect(() => {
    if (overlayMouseDownPos) {
      document.addEventListener("mousemove", handleOverlayMouseMove);
      document.addEventListener("mouseup", handleOverlayMouseUp);
      document.addEventListener("mouseleave", handleOverlayMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleOverlayMouseMove);
        document.removeEventListener("mouseup", handleOverlayMouseUp);
        document.removeEventListener("mouseleave", handleOverlayMouseUp);
      }
    }
  }, [overlayMouseDownPos, handleMouseMove, handleMouseUp]);

  return (
    <div
      className="m-4 relative border-1 inline-block"
      onMouseDown={handleMouseDown}
      onPointerDown={handleMouseDown}
      style={{backgroundImage: `url(${checkerBoard})`}}
    >
      <canvas
        ref={canvasRef}
      />
      <canvas
        ref={overlayCanvasRef}
        className="absolute inset-0"
        style={{display: input||mouseDownPos ? undefined : "none"}}
        onMouseDown={handleOverlayMouseDown}
      />
    </div>
  );
}
