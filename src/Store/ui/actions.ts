import { ToolOptions } from "../../types";

export enum ActionTypes {
  SET_TOOL = "ui/setTool",
  SET_TOOL_OPTIONS = "ui/setToolOptions",
  ADJUST_TOOL_SIZE = "ui/adjustToolSize",
  RIBBON_SET_TAB = "ui/ribbonSetTab",
  SET_ACTIVE_LAYER = "ui/setActiveLayer",
}

type SetToolAction = {
  type: ActionTypes.SET_TOOL;
  payload: { tool: string };
};

type SetToolOptionsAction = {
  type: ActionTypes.SET_TOOL_OPTIONS;
  payload: Partial<ToolOptions>;
};

type AdjustToolSizeAction = {
  type: ActionTypes.ADJUST_TOOL_SIZE;
  payload: { change: number };
};

type RibbonSetTabAction = {
  type: ActionTypes.RIBBON_SET_TAB;
  payload: { id: string };
};

type SetActiveLayerAction = {
  type: ActionTypes.SET_ACTIVE_LAYER;
  payload: { id: number };
};

export type Action =
  | SetToolAction
  | SetToolOptionsAction
  | AdjustToolSizeAction
  | RibbonSetTabAction
  | SetActiveLayerAction;

export function setTool(tool: string): SetToolAction {
  return {
    type: ActionTypes.SET_TOOL,
    payload: { tool },
  };
}

export function setToolOptions(options: Partial<ToolOptions>): SetToolOptionsAction {
  return {
    type: ActionTypes.SET_TOOL_OPTIONS,
    payload: options,
  };
}

export function setToolColor(color: string): SetToolOptionsAction {
  return {
    type: ActionTypes.SET_TOOL_OPTIONS,
    payload: { color },
  };
}

export function setToolStrokeColor(color: string): SetToolOptionsAction {
  return {
    type: ActionTypes.SET_TOOL_OPTIONS,
    payload: { strokeColor: color },
  };
}

export function setToolSize(size: number): SetToolOptionsAction {
  return {
    type: ActionTypes.SET_TOOL_OPTIONS,
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

export function setShape(
  shape: "circle" | "rectangle" | "triangle"
): SetToolOptionsAction {
  return {
    type: ActionTypes.SET_TOOL_OPTIONS,
    payload: { shape },
  };
}

export function setRibbonTab(id: string): RibbonSetTabAction {
  return {
    type: ActionTypes.RIBBON_SET_TAB,
    payload: { id },
  };
}

export function setActiveLayer(id: number): SetActiveLayerAction {
  return {
    type: ActionTypes.SET_ACTIVE_LAYER,
    payload: { id },
  };
}

export function setFillStroke(
  fillStroke: "fill" | "stroke" | "both"
): SetToolOptionsAction {
  return {
    type: ActionTypes.SET_TOOL_OPTIONS,
    payload: { fillStroke },
  };
}