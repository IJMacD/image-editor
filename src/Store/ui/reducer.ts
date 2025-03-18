import { Action } from "../actions";
import { ActionTypes } from "./actions";
import { ActionTypes as ProjectActionTypes } from "../project/actions";
import { UIState } from "../../types";

export const defaultUIState: UIState = {
    tool: "pencil",
    toolOptions: {
        color: "#000000",
        strokeColor: "#FF0000",
        fillStroke: "fill",
        size: 1,
        shape: "circle",
        lineCap: "butt",
    },
    ribbon: {
        selectedTabID: "file",
    },
    layers: {
        activeLayerID: 1,
    },
};

export function uiReducer(state: UIState, action: Action): UIState {
    switch (action.type) {
        case ActionTypes.SET_TOOL:
            return {
                ...state,
                tool: action.payload.tool,
                ribbon: { ...state.ribbon, selectedTabID: action.payload.tool },
            };
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
                    size: Math.max(state.toolOptions.size + action.payload.change, 1),
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
                    activeLayerID: action.payload.id || state.layers.activeLayerID,
                },
            };
    }
    return state;
}
