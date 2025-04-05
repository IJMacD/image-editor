import { useMemo } from "react";
import { CompositeLayer, ImageProject } from "../types";
import { renderToCanvas } from "../Editor/renderToCanvas";

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

