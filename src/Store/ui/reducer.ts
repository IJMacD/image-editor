import { Action } from "../actions";
import { ActionTypes } from "./actions";
import { ActionTypes as ProjectActionTypes } from "../project/actions";

export type UIState = {
  tool: string;
  toolOptions: {
    color: string;
    size: number;
    shape: "circle" | "rectangle" | "triangle";
  };
  ribbon: {
    seletedTabID: string;
  },
  layers: {
    activeLayerID: number,
  }
};

export const defaultUIState: UIState = {
  tool: "pencil",
  toolOptions: {
    color: "black",
    size: 1,
    shape: "circle",
  },
  ribbon: {
    seletedTabID: "file"
  },
  layers: {
    activeLayerID: 1,
  }
};

export function uiReducer(state: UIState, action: Action): UIState {
  switch (action.type) {
    case ActionTypes.SET_TOOL:
      return {
        ...state,
        tool: action.payload.tool,
        ribbon: { ...state.ribbon, seletedTabID: action.payload.tool },
      };
    case ActionTypes.SET_TOOL_COLOR:
      return {
        ...state,
        toolOptions: { ...state.toolOptions, ...action.payload },
      };
    case ActionTypes.SET_TOOL_SIZE:
      return {
        ...state,
        toolOptions: { ...state.toolOptions, size: Math.max(action.payload.size, 1) },
      };
    case ActionTypes.ADJUST_TOOL_SIZE:
      return {
        ...state,
        toolOptions: { ...state.toolOptions, size: Math.max(state.toolOptions.size + action.payload.change, 1) },
      };
    case ActionTypes.SET_SHAPE:
      return {
        ...state,
        toolOptions: { ...state.toolOptions, ...action.payload }
      }
    case ActionTypes.RIBBON_SET_TAB:
      return {
        ...state,
        ribbon: { ...state.ribbon, seletedTabID: action.payload.id }
      }
    case ActionTypes.SET_ACTIVE_LAYER:
      return {
        ...state,
        layers: {
          ...state.layers,
          activeLayerID: action.payload.id,
        }
      }
    case ProjectActionTypes.NEW_LAYER:
      return { ...state, layers: { ...state.layers, activeLayerID: action.payload.id || state.layers.activeLayerID } }

  }
  return state;
}
