import { CompositeLayer, ImageProject } from "../../types";
import { Action } from "../actions";
import { ActionTypes } from "./actions";

type ProjectState = ImageProject | null;

const width = 512;
const height = 512;

export const defaultProjectState = {
  layers: [
    {
      id: 1,
      name: "Layer 1",
      x: 0,
      y: 0,
      width,
      height,
      canvas: null,
    },
  ],
  compositions: [
    { inputs: [1], operation: "source-over" as GlobalCompositeOperation, parameters: {} },
  ],
  width,
  height,
};

export function projectReducer(
  state: ProjectState,
  action: Action
): ProjectState {
  switch (action.type) {
    case ActionTypes.NEW_DOCUMENT:
      if (!state) {
        return defaultProjectState;
      }
      break;
    case ActionTypes.NEW_LAYER:
      if (state) {
        const { width, height } = state;

        const { id } = action.payload;  

        const newLayer = {
          name: `Layer ${id}`,
          x: 0,
          y: 0,
          width,
          height,
          ...action.payload,
        };

        const compositions = [
          {
            ...state.compositions[0],
            inputs: [...state.compositions[0].inputs, id],
          },
          ...state.compositions.slice(1),
        ];

        return {
          ...state,
          layers: [
            ...state.layers,
            {
              ...newLayer,
              canvas: null,
            },
          ],
          compositions,
        };
      }
      break;
    case ActionTypes.NEW_COMPOSITION:
      return (
        state && {
          ...state,
          compositions: [
            ...state.compositions,
            { inputs: [], operation: "source-over", parameters: {} },
          ],
        }
      );

    case ActionTypes.EDIT_LAYER:
      return (
        state && {
          ...state,
          layers: state.layers.map((l) =>
            l.id === action.payload.layerID
              ? {
                  ...l,
                  ...action.payload.properties,
                }
              : l
          ),
        }
      );

    case ActionTypes.EDIT_COMPOSITE_LAYER:
      return (
        state && {
          ...state,
          compositions: replaceComposition(
            state.compositions,
            action.payload.compositeLayer,
            action.payload.properties
          ),
        }
      );

    case ActionTypes.DELETE_LAYER:
      return (
        state && {
          ...state,
          layers: state.layers.filter(l => l.id !== action.payload.id),
          compositions: removeLayerFromCompositions(state.compositions, action.payload.id),
        }
      )
  }
  return state;
}

function replaceComposition(
  compositions: CompositeLayer[],
  compositeLayer: CompositeLayer,
  properties: Partial<Omit<CompositeLayer, "inputs">>
): CompositeLayer[] {
  return compositions.map((c) => {
    if (c === compositeLayer) {
      return { ...compositeLayer, ...properties };
    }
    return {
      ...c,
      inputs: replaceCompositionInner(c.inputs, compositeLayer, properties),
    };
  });
}

function replaceCompositionInner(
  compositions: (CompositeLayer | number)[],
  compositeLayer: CompositeLayer,
  properties: Partial<Omit<CompositeLayer, "inputs">>
): (CompositeLayer | number)[] {
  return compositions.map((c) => {
    if (typeof c === "number") {
      return c;
    }
    if (c === compositeLayer) {
      return { ...compositeLayer, ...properties };
    }
    return {
      ...c,
      inputs: replaceCompositionInner(c.inputs, compositeLayer, properties),
    };
  });
}

function removeLayerFromCompositions(compositions: CompositeLayer[], layerID: number): CompositeLayer[] {
  return compositions.map(c => ({
    ...c,
    inputs: c.inputs.map(cc => typeof cc === "number" ? cc : removeLayerFromCompositions([cc], layerID)[0]).filter(i => i !== layerID),
  }))
}