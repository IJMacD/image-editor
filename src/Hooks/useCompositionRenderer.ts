import { useMemo } from "react";
import { CompositeLayer, ImageProject } from "../types";
import { getLayerByID, isCompositeLayer } from "../util/project";

export function useCompositionRenderer(
  compositeLayer: CompositeLayer,
  project: ImageProject | null
) {

  return useMemo(() => {
    const canvas = document.createElement("canvas");

    if (compositeLayer && project) {
      canvas.width = compositeLayer.width;
      canvas.height = compositeLayer.height;
      renderToCanvas(canvas, compositeLayer, project);
    }

    return canvas;
  }, [compositeLayer, project]);
}

function renderToCanvas(
  canvas: HTMLCanvasElement,
  layer: CompositeLayer,
  project: ImageProject
) {
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  for (const c of layer.inputs) {
    const layer = getLayerByID(project.layers, c.id);
    ctx.globalCompositeOperation = c.operation;
    ctx.filter = c.filter || "none";
    ctx.setTransform(c.transform);

    if (c.enabled && layer) {
        if (isCompositeLayer(layer)) {
            const subCanvas = document.createElement("canvas");
            subCanvas.width = layer.width;
            subCanvas.height = layer.height;
            renderToCanvas(subCanvas, layer, project);
            ctx.drawImage(subCanvas, 0, 0);
        } else if (layer.canvas) {
            ctx.drawImage(layer.canvas, 0, 0);
        }
    }
  }
}
