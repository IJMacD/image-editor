import { Action } from "../actions";
import { ActionTypes } from "./actions";
import { ActionTypes as ProjectActionTypes } from "../project/actions";
import { UIState } from "../../types";

export const defaultUIState: UIState = {
    tool: "pencil",
    toolOptions: {
        color: "#000000",
        fillAlpha: 1,
        strokeColor: "#FF0000",
        strokeAlpha: 1,
        fillStroke: "fill",
        size: 1,
        feather: 0,
        shape: "circle",
        lineCap: "butt",
    },
    ribbon: {
        selectedTabID: "file",
    },
    layers: {
        activeLayerID: 1,
    },
    inputs: {
        selectedPath: [0, 0],
    },
};

export function uiReducer(state: UIState, action: Action): UIState {
    switch (action.type) {
        case ActionTypes.SET_TOOL: {
            const fillStroke = state.toolOptions.fillStroke;
            return {
                ...state,
                tool: action.payload.tool,
                toolOptions: {
                    ...state.toolOptions,
                    fillStroke:
                        action.payload.tool === "line" && fillStroke === "fill"
                            ? "both"
                            : fillStroke,
                },
                ribbon: { ...state.ribbon, selectedTabID: action.payload.tool },
            };
        }
        case ActionTypes.SET_TOOL_OPTIONS:
            return {
                ...state,
                toolOptions: { ...state.toolOptions, ...action.payload },
            };
        case ActionTypes.ADJUST_TOOL_SIZE:
            return {
                ...state,
                toolOptions: {
                    ...state.toolOptions,
                    size: Math.max(
                        state.toolOptions.size + action.payload.change,
                        1
                    ),
                },
            };
        case ActionTypes.RIBBON_SET_TAB:
            return {
                ...state,
                ribbon: { ...state.ribbon, selectedTabID: action.payload.id },
            };
        case ActionTypes.SET_ACTIVE_LAYER:
            return {
                ...state,
                layers: {
                    ...state.layers,
                    activeLayerID: action.payload.id,
                },
            };
        case ProjectActionTypes.NEW_LAYER:
            return {
                ...state,
                layers: {
                    ...state.layers,
                    activeLayerID:
                        action.payload.id || state.layers.activeLayerID,
                },
            };

        case ActionTypes.SET_SELECTED_INPUT_PATH:
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    selectedPath: action.payload.path,
                },
            };

        case ProjectActionTypes.DELETE_LAYER:
            if (state.layers.activeLayerID === action.payload.id) {
                return {
                    ...state,
                    layers: {
                        ...state.layers,
                        activeLayerID: 0,
                    },
                };
            }
            return state;
    }
    return state;
}
