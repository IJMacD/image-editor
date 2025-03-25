import { Editor } from "../../Editor";
import { ImageProject, Quad } from "../../types";
import {
    getInputID,
    getLayerID,
    getNextLayerID,
    isBaseLayer,
    isCompositeLayer,
} from "../../util/project";
import { Action } from "../actions";
import { ActionTypes } from "./actions";

type ProjectState = ImageProject | null;

const width = 512;
const height = 512;
const defaultProjectLayer0ID = getLayerID();
const defaultProjectLayer1ID = getLayerID();
const defaultProjectInputID = getInputID();

export const defaultProjectState: ImageProject = {
    layers: [
        {
            id: defaultProjectLayer0ID,
            name: "Image",
            width,
            height,
            inputs: [defaultProjectInputID],
        },
        {
            id: defaultProjectLayer1ID,
            name: "Layer 1",
            width,
            height,
            canvas: null,
        },
    ],
    inputs: [
        {
            inputID: defaultProjectInputID,
            id: defaultProjectLayer1ID,
            enabled: true,
            transform: new DOMMatrix([1, 0, 0, 1, 0, 0]),
            operation: "source-over" as GlobalCompositeOperation,
            filter: "",
            parameters: {},
            nonLinear: [
                [0, 0],
                [width, 0],
                [width, height],
                [0, height],
            ],
        },
    ],
    compositions: [defaultProjectLayer0ID],
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

                const { id, inputID, isComposite, parent, ...rest } =
                    action.payload;

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
                          canvas: null,
                          ...rest,
                      };

                return {
                    ...state,
                    layers: [
                        ...state.layers.map((l) =>
                            l.id === parent && "inputs" in l
                                ? {
                                      ...l,
                                      inputs: [...l.inputs, inputID],
                                  }
                                : l
                        ),
                        newLayer,
                    ],
                    inputs: [
                        ...state.inputs,
                        {
                            inputID,
                            id,
                            enabled: true,
                            transform: new DOMMatrix([1, 0, 0, 1, 0, 0]),
                            operation:
                                "source-over" as GlobalCompositeOperation,
                            filter: "",
                            parameters: {},
                            nonLinear: [
                                [0, 0],
                                [width, 0],
                                [width, height],
                                [0, height],
                            ] as Quad,
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
                    inputs: state.inputs.map((input) =>
                        input.id === action.payload.id
                            ? {
                                  ...input,
                                  ...action.payload.properties,
                              }
                            : input
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
                                          nonLinear: [
                                              [0, 0],
                                              [width, 0],
                                              [width, height],
                                              [0, height],
                                          ],
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

        case ActionTypes.DELETE_LAYER:
            const affectedInputs =
                state?.inputs
                    .filter((input) => input.id === action.payload.id)
                    .map((input) => input.inputID) || [];
            return (
                state && {
                    ...state,
                    layers: state.layers
                        .filter((l) => l.id !== action.payload.id)
                        .map((l) =>
                            "inputs" in l &&
                            l.inputs.some((input) =>
                                affectedInputs.includes(input)
                            )
                                ? {
                                      ...l,
                                      inputs: l.inputs.filter(
                                          (input) =>
                                              !affectedInputs.includes(input)
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
