export enum ActionTypes {
  SET_TOOL = "ui/setTool",
  SET_TOOL_COLOR = "ui/setToolColor",
  SET_TOOL_SIZE = "ui/setToolSize",
  ADJUST_TOOL_SIZE = "ui/adjustToolSize",
}

type SetToolAction = {
  type: ActionTypes.SET_TOOL;
  payload: { tool: string };
};

type SetToolColorAction = {
  type: ActionTypes.SET_TOOL_COLOR;
  payload: { color: string };
};

type SetToolSizeAction = {
  type: ActionTypes.SET_TOOL_SIZE;
  payload: { size: number };
};

type AdjustToolSizeAction = {
  type: ActionTypes.ADJUST_TOOL_SIZE;
  payload: { change: number };
};

export type Action = SetToolAction | SetToolColorAction | SetToolSizeAction | AdjustToolSizeAction;

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

export function setToolSize(size: number): SetToolSizeAction {
  return {
    type: ActionTypes.SET_TOOL_SIZE,
    payload: { size },
  };
}

export function increaseToolSize(change: number = 1): AdjustToolSizeAction {
  return {
    type: ActionTypes.ADJUST_TOOL_SIZE,
    payload: { change },
  };
}

export function decreaseToolSize(change: number = 1): AdjustToolSizeAction {
  return {
    type: ActionTypes.ADJUST_TOOL_SIZE,
    payload: { change: -change },
  };
}
