import { BaseLayer, ImageProject } from "../../types";
import { getNextLayerID, isCompositeLayer } from "../../util/project";
import { Action } from "../actions";
import { ActionTypes } from "./actions";

type ProjectState = ImageProject | null;

const width = 512;
const height = 512;

export const defaultProjectState: ImageProject = {
  layers: [
    {
      id: 0,
      name: "Output 0",
      width,
      height,
      inputs: [
        {
          id: 1,
          x: 0,
          y: 0,
          enabled: true,
          operation: "source-over" as GlobalCompositeOperation,
          parameters: {},
        },
      ],
    },
    {
      id: 1,
      name: "Layer 1",
      width,
      height,
      canvas: null,
    },
  ],
  compositions: [0],
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

        const newLayer: BaseLayer = {
          name: `Layer ${id}`,
          width,
          height,
          canvas: null,
          ...action.payload,
        };

        const firstComposition = state.layers.find(
          (l) => l.id === state.compositions[0]
        );

        return {
          ...state,
          layers: [
            ...state.layers.map((l) =>
              l === firstComposition && "inputs" in l
                ? {
                    ...l,
                    inputs: [
                      ...l.inputs,
                      {
                        id,
                        x: 0,
                        y: 0,
                        enabled: true,
                        operation: "source-over" as GlobalCompositeOperation,
                        parameters: {},
                      },
                    ],
                  }
                : l
            ),
            {
              ...newLayer,
              canvas: null,
            },
          ],
        };
      }
      break;
    case ActionTypes.NEW_COMPOSITION:
      if (state) {
        const id = getNextLayerID(state);
        const { width, height } = state;
        return (
          state && {
            ...state,
            layers: [
              ...state.layers,
              { id, name: `Output ${id}`, width, height, inputs: [] },
            ],
            compositions: [...state.compositions, id],
          }
        );
      }
      break;

    case ActionTypes.EDIT_LAYER:
      return (
        state && {
          ...state,
          layers: state.layers.map((l) =>
            l.id === action.payload.id
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
          layers: state.layers.map((l) =>
            l.id === action.payload.id
              ? {
                  ...l,
                  ...action.payload.properties,
                }
              : l
          ),
        }
      );
    case ActionTypes.EDIT_COMPOSITE_LAYER_INPUT:
      return (
        state && {
          ...state,
          layers: state.layers.map((l) =>
            l.id === action.payload.id && isCompositeLayer(l)
              ? {
                  ...l,
                  inputs: l.inputs.map((input, i) =>
                    i === action.payload.index
                      ? { ...input, ...action.payload.properties }
                      : input
                  ),
                }
              : l
          ),
        }
      );

    case ActionTypes.DELETE_LAYER:
      return (
        state && {
          ...state,
          layers: state.layers
            .filter((l) => l.id !== action.payload.id)
            .map((l) =>
              "inputs" in l &&
              l.inputs.some((input) => input.id === action.payload.id)
                ? {
                    ...l,
                    inputs: l.inputs.filter(
                      (input) => input.id !== action.payload.id
                    ),
                  }
                : l
            ),
          compositions: state.compositions.filter(
            (id) => id !== action.payload.id
          ),
        }
      );
  }
  return state;
}
