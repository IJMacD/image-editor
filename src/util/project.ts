import { Layer, ImageProject, CompositeLayer, BaseLayer } from "../types";

export function getLayerByID(layers: Layer[], id: number) {
  return layers.find((l) => l.id === id);
}

export function getCompositeLayerByID(
  layers: Layer[],
  id: number
): CompositeLayer | undefined {
  return layers.find(
    (l) => l.id === id && isCompositeLayer(l)
  ) as CompositeLayer;
}

export function getNextLayerID(project: ImageProject) {
  return Math.max(...project.layers.map((l) => l.id), 0) + 1;
}

export function isBaseLayer(layer: Layer | undefined): layer is BaseLayer {
    return typeof layer !== "undefined" && "canvas" in layer;
}

export function isCompositeLayer(
    layer: Layer | undefined
): layer is CompositeLayer {
    return typeof layer !== "undefined" && "inputs" in layer;
}
