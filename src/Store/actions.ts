import { CompositeLayer, Layer } from "../types";

export const NEW_DOCUMENT = "newDocument";
export const NEW_LAYER = "newLayer";
export const EDIT_LAYER = "editLayer";
export const EDIT_COMPOSITE_LAYER = "editCompositeLayer";
export const NEW_COMPOSITION = "newComposition";

type NewDocumentAction = { type: "newDocument" };
type NewCompositionAction = { type: "newComposition" };
type NewLayerAction = {
  type: "newLayer";
  payload: {
    name?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  };
};
type EditLayerAction = {
  type: "editLayer";
  payload: {
    layerID: number;
    properties: Partial<Omit<Layer, "id">>;
  };
};
type EditCompositeLayerAction = {
  type: "editCompositeLayer";
  payload: {
    compositeLayer: CompositeLayer;
    properties: Partial<Omit<CompositeLayer, "inputs">>;
  };
};

export type Action =
  | NewDocumentAction
  | NewCompositionAction
  | NewLayerAction
  | EditLayerAction
  | EditCompositeLayerAction;

export function newDocument(): NewDocumentAction {
  return {
    type: NEW_DOCUMENT,
  };
}

export function newLayer(): NewLayerAction {
  return {
    type: NEW_LAYER,
    payload: {},
  };
}

export function editLayer(
  layerID: number,
  properties: Partial<Omit<Layer, "id">>
): EditLayerAction {
  return {
    type: EDIT_LAYER,
    payload: { layerID, properties },
  };
}

export function newComposition(): NewCompositionAction {
  return {
    type: NEW_COMPOSITION,
  };
}

export function editCompositeLayer(
  compositeLayer: CompositeLayer,
  properties: Partial<Omit<CompositeLayer, "inputs">>
): EditCompositeLayerAction {
  return {
    type: EDIT_COMPOSITE_LAYER,
    payload: { compositeLayer, properties },
  };
}
