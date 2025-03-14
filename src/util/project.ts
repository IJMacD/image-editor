import { Layer } from "../types";

export function getLayerByID(layers: Layer[], id: number) {
  return layers.find((l) => l.id === id);
}
