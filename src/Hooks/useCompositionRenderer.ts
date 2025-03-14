import { useMemo } from "react";
import { CompositeLayer, ImageProject } from "../types";
import { getLayerByID } from "../util/project";

export function useCompositionRenderer(
  composition: CompositeLayer,
  project: ImageProject
) {
  const { layers } = project;

  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = project.width;
    canvas.height = project.height;

    if (composition) {
      renderToCanvas(canvas, composition, project);
    }

    return canvas;
  }, [layers, composition]);
}

function renderToCanvas(
  canvas: HTMLCanvasElement,
  input: CompositeLayer | number,
  project: ImageProject
) {
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  if (typeof input === "number") {
    const layer = getLayerByID(project.layers, input);
    if (layer?.canvas) {
      ctx.drawImage(layer.canvas, layer.x, layer.y);
    }
    return;
  }

  ctx.globalCompositeOperation = input.operation;

  for (const c of input.inputs) {
    renderToCanvas(canvas, c, project);
  }
}
