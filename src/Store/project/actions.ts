import { CompositeLayer, Layer } from "../../types";

export enum ActionTypes {
  NEW_DOCUMENT = "project/newDocument",
  NEW_LAYER = "project/newLayer",
  EDIT_LAYER = "project/editLayer",
  EDIT_COMPOSITE_LAYER = "project/editCompositeLayer",
  NEW_COMPOSITION = "project/newComposition",
}

type NewDocumentAction = { type: ActionTypes.NEW_DOCUMENT };
type NewCompositionAction = { type: ActionTypes.NEW_COMPOSITION };
type NewLayerAction = {
  type: ActionTypes.NEW_LAYER;
  payload: {
    name?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  };
};
type EditLayerAction = {
  type: ActionTypes.EDIT_LAYER;
  payload: {
    layerID: number;
    properties: Partial<Omit<Layer, "id">>;
  };
};
type EditCompositeLayerAction = {
  type: ActionTypes.EDIT_COMPOSITE_LAYER;
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
    type: ActionTypes.NEW_DOCUMENT,
  };
}

export function newLayer(): NewLayerAction {
  return {
    type: ActionTypes.NEW_LAYER,
    payload: {},
  };
}

export function editLayer(
  layerID: number,
  properties: Partial<Omit<Layer, "id">>
): EditLayerAction {
  return {
    type: ActionTypes.EDIT_LAYER,
    payload: { layerID, properties },
  };
}

export function newComposition(): NewCompositionAction {
  return {
    type: ActionTypes.NEW_COMPOSITION,
  };
}

export function editCompositeLayer(
  compositeLayer: CompositeLayer,
  properties: Partial<Omit<CompositeLayer, "inputs">>
): EditCompositeLayerAction {
  return {
    type: ActionTypes.EDIT_COMPOSITE_LAYER,
    payload: { compositeLayer, properties },
  };
}
