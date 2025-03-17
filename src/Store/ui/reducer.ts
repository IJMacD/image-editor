import { Action } from "../actions";
import { ActionTypes } from "./actions";

export type UIState = {
  tool: string;
  toolOptions: {
    color: string;
    size: number;
  };
};

export const defaultUIState: UIState = {
  tool: "pencil",
  toolOptions: {
    color: "black",
    size: 1,
  },
};

export function uiReducer(state: UIState, action: Action): UIState {
  switch (action.type) {
    case ActionTypes.SET_TOOL:
      return {
        ...state,
        tool: action.payload.tool,
      };
    case ActionTypes.SET_TOOL_COLOR:
      return {
        ...state,
        toolOptions: { ...state.toolOptions, color: action.payload.color },
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
  }
  return state;
}
