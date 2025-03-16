export enum ActionTypes {
  SET_TOOL = "ui/setTool",
  SET_TOOL_COLOR = "ui/setToolColor",
  SET_TOOL_WIDTH = "ui/setToolWidth",
}

type SetToolAction = {
  type: ActionTypes.SET_TOOL;
  payload: { tool: string };
};

type SetToolColorAction = {
  type: ActionTypes.SET_TOOL_COLOR;
  payload: { color: string };
};

type SetToolWidthAction = {
  type: ActionTypes.SET_TOOL_WIDTH;
  payload: { width: number };
};

export type Action = SetToolAction | SetToolColorAction | SetToolWidthAction;

export function setTool(tool: string): SetToolAction {
  return {
    type: ActionTypes.SET_TOOL,
    payload: { tool },
  };
}
export function setToolColor(color: string): SetToolColorAction {
  return {
    type: ActionTypes.SET_TOOL_COLOR,
    payload: { color },
  };
}

export function setToolWidth(width: number): SetToolWidthAction {
  return {
    type: ActionTypes.SET_TOOL_WIDTH,
    payload: { width },
  };
}
