import { Layer, ImageProject } from "../types";

export function getLayerByID(layers: Layer[], id: number) {
  return layers.find((l) => l.id === id);
}

export function getNextLayerID(project: ImageProject) {
  return Math.max(...project.layers.map((l) => l.id), 0) + 1;
}
