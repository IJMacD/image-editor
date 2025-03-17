export enum ActionTypes {
  SET_TOOL = "ui/setTool",
  SET_TOOL_COLOR = "ui/setToolColor",
  SET_TOOL_STROKE_COLOR = "ui/setToolStrokeColor",
  SET_TOOL_SIZE = "ui/setToolSize",
  ADJUST_TOOL_SIZE = "ui/adjustToolSize",
  SET_SHAPE = "ui/setShape",
  RIBBON_SET_TAB = "ui/ribbonSetTab",
  SET_ACTIVE_LAYER = "ui/setActiveLayer",
  SET_FILL_STROKE = "ui/setFillStroke",
}

type SetToolAction = {
  type: ActionTypes.SET_TOOL;
  payload: { tool: string };
};

type SetToolColorAction = {
  type: ActionTypes.SET_TOOL_COLOR | ActionTypes.SET_TOOL_STROKE_COLOR;
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

type SetShapeAction = {
  type: ActionTypes.SET_SHAPE;
  payload: { shape: "circle" | "rectangle" | "triangle" };
};

type RibbonSetTabAction = {
  type: ActionTypes.RIBBON_SET_TAB;
  payload: { id: string };
};

type SetActiveLayerAction = {
  type: ActionTypes.SET_ACTIVE_LAYER;
  payload: { id: number };
};

type SetFillStrokeAction = {
  type: ActionTypes.SET_FILL_STROKE;
  payload: { fillStroke: "fill" | "stroke" | "both" };
};

export type Action =
  | SetToolAction
  | SetToolColorAction
  | SetToolSizeAction
  | AdjustToolSizeAction
  | SetShapeAction
  | RibbonSetTabAction
  | SetActiveLayerAction
  | SetFillStrokeAction;

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

export function setToolStrokeColor(color: string): SetToolColorAction {
  return {
    type: ActionTypes.SET_TOOL_STROKE_COLOR,
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

export function setShape(
  shape: "circle" | "rectangle" | "triangle"
): SetShapeAction {
  return {
    type: ActionTypes.SET_SHAPE,
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
): SetFillStrokeAction {
  return {
    type: ActionTypes.SET_FILL_STROKE,
    payload: { fillStroke },
  };
}