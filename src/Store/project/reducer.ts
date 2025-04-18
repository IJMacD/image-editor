import { Editor } from "../../Editor";
import { ImageProject } from "../../types";
import {
    getNextLayerID,
    isBaseLayer,
    isCompositeLayer,
} from "../../util/project";
import { Action } from "../actions";
import { ActionTypes } from "./actions";

type ProjectState = ImageProject | null;

const width = 512;
const height = 512;

export const defaultProjectState: ImageProject = {
    layers: [
        {
            id: 0,
            name: "Image",
            width,
            height,
            inputs: [
                {
                    id: 1,
                    enabled: true,
                    transform: new DOMMatrix([1, 0, 0, 1, 0, 0]),
                    operation: "source-over" as GlobalCompositeOperation,
                    filter: "",
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
            history: {
                canvases: [],
                index: 0,
            },
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

                const {
                    id,
                    isComposite,
                    parent,
                    canvas = null,
                    ...rest
                } = action.payload;

                const { width, height } = canvas || state;

                const newLayer = isComposite
                    ? {
                          id,
                          name: `Composition ${id}`,
                          width,
                          height,
                          inputs: [],
                          ...rest,
                      }
                    : {
                          id,
                          name: `Layer ${id}`,
                          width,
                          height,
                          canvas,
                          history: {
                              canvases: canvas ? [canvas] : [],
                              index: -1,
                          },
                          ...rest,
                      };

                return {
                    ...state,
                    layers: [
                        ...state.layers.map((l) =>
                            l.id === parent && "inputs" in l
                                ? {
                                      ...l,
                                      inputs: [
                                          ...l.inputs,
                                          {
                                              id,
                                              enabled: true,
                                              transform: new DOMMatrix([
                                                  1, 0, 0, 1, 0, 0,
                                              ]),
                                              operation:
                                                  "source-over" as GlobalCompositeOperation,
                                              filter: "",
                                              parameters: {},
                                          },
                                      ],
                                  }
                                : l
                        ),
                        newLayer,
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
                            {
                                id,
                                name: `Output ${id}`,
                                width,
                                height,
                                inputs: [],
                            },
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

        case ActionTypes.UPDATE_CANVAS:
            return (
                state && {
                    ...state,
                    layers: state.layers.map((l) =>
                        l.id === action.payload.id && isBaseLayer(l)
                            ? {
                                  ...l,
                                  canvas: action.payload.canvas,
                                  history: {
                                      canvases:
                                          l.canvas === action.payload.canvas
                                              ? l.history.canvases
                                              : [
                                                    action.payload.canvas,
                                                    ...l.history.canvases.slice(
                                                        l.history.index
                                                    ),
                                                ],
                                      index: 0,
                                  },
                              }
                            : l
                    ),
                }
            );

        case ActionTypes.RESTORE_CANVAS_HISTORY:
            return (
                state && {
                    ...state,
                    layers: state.layers.map((l) =>
                        l.id == action.payload.id && isBaseLayer(l)
                            ? {
                                  ...l,
                                  canvas: l.history.canvases[
                                      action.payload.index
                                  ],
                                  history: {
                                      ...l.history,
                                      index: action.payload.index,
                                  },
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
                                          ? {
                                                ...input,
                                                ...action.payload.properties,
                                            }
                                          : input
                                  ),
                              }
                            : l
                    ),
                }
            );

        case ActionTypes.APPEND_COMPOSITE_LAYER_INPUT: {
            if (action.payload.childID === action.payload.id) {
                // TODO: also check for loops
                return state;
            }

            return (
                state && {
                    ...state,
                    layers: state.layers.map((layer) =>
                        layer.id === action.payload.id &&
                        isCompositeLayer(layer)
                            ? {
                                  ...layer,
                                  inputs: [
                                      ...layer.inputs,
                                      {
                                          id: action.payload.childID,
                                          enabled: true,
                                          transform: new DOMMatrix([
                                              1, 0, 0, 1, 0, 0,
                                          ]),
                                          operation: "source-over",
                                          filter: "",
                                          parameters: {},
                                      },
                                  ],
                              }
                            : layer
                    ),
                }
            );
        }

        case ActionTypes.REMOVE_COMPOSITE_LAYER_INPUT: {
            return (
                state && {
                    ...state,
                    layers: state.layers.map((layer) =>
                        layer.id === action.payload.id &&
                        isCompositeLayer(layer)
                            ? {
                                  ...layer,
                                  inputs: [
                                      ...layer.inputs.slice(
                                          0,
                                          action.payload.index
                                      ),
                                      ...layer.inputs.slice(
                                          action.payload.index + 1
                                      ),
                                  ],
                              }
                            : layer
                    ),
                }
            );
        }

        case ActionTypes.MOVE_COMPOSITE_LAYER_INPUT: {
            return (
                state && {
                    ...state,
                    layers: state.layers.map((layer) => {
                        if (
                            layer.id === action.payload.id &&
                            isCompositeLayer(layer)
                        ) {
                            const inputs = [...layer.inputs];
                            const { index, direction } = action.payload;

                            if (
                                direction < 0
                                    ? index <= 0
                                    : index >= inputs.length - 1
                            ) {
                                return layer;
                            }

                            const input = inputs[index];
                            inputs[index] = inputs[index + direction];
                            inputs[index + direction] = input;

                            return {
                                ...layer,
                                inputs,
                            };
                        }
                        return layer;
                    }),
                }
            );
        }

        case ActionTypes.TRANSPLANT_COMPOSITE_LAYER_INPUT: {
            const oldParentLayer = state?.layers.find(
                (l) => l.id === action.payload.id
            );
            const input = isCompositeLayer(oldParentLayer)
                ? oldParentLayer.inputs[action.payload.index]
                : undefined;
            return (
                state && {
                    ...state,
                    layers: state.layers.map((layer) => {
                        if (
                            layer.id === action.payload.id &&
                            isCompositeLayer(layer)
                        ) {
                            const newInputs = [
                                ...layer.inputs.slice(0, action.payload.index),
                                ...layer.inputs.slice(action.payload.index + 1),
                            ];
                            return { ...layer, inputs: newInputs };
                        } else if (
                            layer.id === action.payload.newLayerID &&
                            isCompositeLayer(layer) &&
                            input
                        ) {
                            return {
                                ...layer,
                                inputs: [...layer.inputs, input],
                            };
                        } else {
                            return layer;
                        }
                    }),
                }
            );
        }

        case ActionTypes.DELETE_LAYER:
            return (
                state && {
                    ...state,
                    layers: state.layers
                        .filter((l) => l.id !== action.payload.id)
                        .map((l) =>
                            "inputs" in l &&
                            l.inputs.some(
                                (input) => input.id === action.payload.id
                            )
                                ? {
                                      ...l,
                                      inputs: l.inputs.filter(
                                          (input) =>
                                              input.id !== action.payload.id
                                      ),
                                  }
                                : l
                        ),
                    compositions: state.compositions.filter(
                        (id) => id !== action.payload.id
                    ),
                }
            );

        case ActionTypes.APPLY_LAYER_FILTER: {
            if (!state) {
                return state;
            }

            return {
                ...state,
                layers: state.layers.map((l) => {
                    if (
                        l.id === action.payload.id &&
                        isBaseLayer(l) &&
                        l.canvas
                    ) {
                        let canvas = l.canvas;
                        switch (action.payload.filter) {
                            case "invert":
                                canvas = Editor.invert(
                                    l.canvas,
                                    action.payload.value
                                );
                                break;
                            case "greyscale":
                                canvas = Editor.greyscale(
                                    l.canvas,
                                    action.payload.value
                                );
                                break;
                            case "blur":
                                canvas = Editor.blur(
                                    l.canvas,
                                    action.payload.value
                                );
                                break;
                        }
                        return { ...l, canvas };
                    }

                    return l;
                }),
            };
        }
    }
    return state;
}
