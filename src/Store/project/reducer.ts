import { CompositeLayer, ImageProject } from "../../types";
import { Action } from "../actions";
import { ActionTypes } from "./actions";

type ProjectState = ImageProject | null;

export function projectReducer(
  state: ProjectState,
  action: Action
): ProjectState {
  switch (action.type) {
    case ActionTypes.NEW_DOCUMENT:
      if (!state) {
        const width = 512;
        const height = 512;
        return {
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
            { inputs: [1], operation: "source-over", parameters: {} },
          ],
          width,
          height,
        };
      }
      break;
    case ActionTypes.NEW_LAYER:
      if (state) {
        const id = getNextLayerID(state);

        const { width, height } = state;

        const newLayer = {
          id,
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
  }
  return state;
}

function getNextLayerID(project: ImageProject) {
  return Math.max(...project.layers.map((l) => l.id), 0) + 1;
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
