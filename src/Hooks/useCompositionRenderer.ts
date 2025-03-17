import { useMemo } from "react";
import { CompositeLayer, ImageProject } from "../types";
import { getLayerByID, isCompositeLayer } from "../util/project";

export function useCompositionRenderer(
  compositeLayer: CompositeLayer,
  project: ImageProject
) {
  const { layers } = project;

  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = project.width;
    canvas.height = project.height;

    if (compositeLayer) {
      renderToCanvas(canvas, compositeLayer, project);
    }

    return canvas;
  }, [layers, compositeLayer]);
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

    if (layer) {
      if (isCompositeLayer(layer)) {
        renderToCanvas(canvas, layer, project);
      } else if (layer.canvas) {
        ctx.drawImage(layer.canvas, c.x, c.y);
      }
    }
  }
}
