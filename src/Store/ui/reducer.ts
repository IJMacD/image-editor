import { Action } from "../actions";
import { ActionTypes } from "./actions";

export type UIState = {
  tool: string;
  toolOptions: {
    color: string;
    width: number;
  };
};

export function uiReducer(state: UIState, action: Action): UIState {
  switch (action.type) {
    case ActionTypes.SET_TOOL_COLOR:
      return {
        ...state,
        toolOptions: { ...state.toolOptions, color: action.payload.color },
      };
    case ActionTypes.SET_TOOL_WIDTH:
      return {
        ...state,
        toolOptions: { ...state.toolOptions, width: action.payload.width },
      };
  }
  return state;
}
