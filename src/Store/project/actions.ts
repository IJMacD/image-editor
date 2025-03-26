import { BaseLayer, CompositeLayer, InputProperties, Layer } from "../../types";

export enum ActionTypes {
    NEW_DOCUMENT = "project/newDocument",
    NEW_LAYER = "project/newLayer",
    EDIT_LAYER = "project/editLayer",
    UPDATE_CANVAS = "project/updateCanvas",
    DELETE_LAYER = "project/deleteLayer",
    NEW_COMPOSITE_LAYER = "project/newCompositeLayer",
    EDIT_COMPOSITE_LAYER = "project/editCompositeLayer",
    EDIT_COMPOSITE_LAYER_INPUT = "project/editCompositeLayerInput",
    APPEND_COMPOSITE_LAYER_INPUT = "project/appendCompositeLayerInput",
    REMOVE_COMPOSITE_LAYER_INPUT = "project/removeCompositeLayerInput",
    MOVE_COMPOSITE_LAYER_INPUT = "project/moveCompositeLayerInput",
    TRANSPLANT_COMPOSITE_LAYER_INPUT = "project/transplantCompositeLayerInput",
    NEW_COMPOSITION = "project/newComposition",
    APPLY_LAYER_FILTER = "project/applyLayerFilter",
    RESTORE_CANVAS_HISTORY = "project/restoreCanvasHistory",
}

type NewDocumentAction = { type: ActionTypes.NEW_DOCUMENT };
type NewCompositionAction = { type: ActionTypes.NEW_COMPOSITION };

type NewLayerAction = {
    type: ActionTypes.NEW_LAYER;
    payload: {
        id: number;
        parent: number;
        isComposite: boolean;
        name?: string;
        width?: number;
        height?: number;
    };
};

type EditLayerAction = {
    type: ActionTypes.EDIT_LAYER;
    payload: {
        id: number;
        properties: Partial<Omit<Layer, "id">>;
    };
};

type EditBaseLayerAction = {
    type: ActionTypes.EDIT_LAYER;
    payload: {
        id: number;
        properties: Partial<Omit<BaseLayer, "id">>;
    };
};

type UpdateCanvasAction = {
    type: ActionTypes.UPDATE_CANVAS;
    payload: {
        id: number;
        canvas: HTMLCanvasElement;
    };
};

type RestoreCanvasHistoryAction = {
    type: ActionTypes.RESTORE_CANVAS_HISTORY;
    payload: {
        id: number;
        index: number;
    };
};

type EditCompositeLayerAction = {
    type: ActionTypes.EDIT_COMPOSITE_LAYER;
    payload: {
        id: number;
        properties: Partial<Omit<CompositeLayer, "inputs">>;
    };
};

type EditCompositeLayerInputAction = {
    type: ActionTypes.EDIT_COMPOSITE_LAYER_INPUT;
    payload: {
        id: number;
        index: number;
        properties: Partial<{
            id: number;
            x: number;
            y: number;
            enabled: boolean;
            operation: GlobalCompositeOperation;
            parameters: object;
        }>;
    };
};

type AppendCompositeLayerInputAction = {
    type: ActionTypes.APPEND_COMPOSITE_LAYER_INPUT;
    payload: { id: number; childID: number };
};

type RemoveCompositeLayerInputAction = {
    type: ActionTypes.REMOVE_COMPOSITE_LAYER_INPUT;
    payload: { id: number; index: number };
};

type MoveCompositeLayerInputAction = {
    type: ActionTypes.MOVE_COMPOSITE_LAYER_INPUT;
    payload: { id: number; index: number; direction: -1 | 1 };
};

type TransplantCompositeLayerInputAction = {
    type: ActionTypes.TRANSPLANT_COMPOSITE_LAYER_INPUT;
    payload: { id: number; index: number; newLayerID: number };
};

type DeleteLayerAction = {
    type: ActionTypes.DELETE_LAYER;
    payload: { id: number };
};

type ApplyLayerFilterAction = {
    type: ActionTypes.APPLY_LAYER_FILTER;
    payload: { id: number; filter: string; value: number };
};

export type Action =
    | NewDocumentAction
    | NewCompositionAction
    | NewLayerAction
    | EditBaseLayerAction
    | UpdateCanvasAction
    | RestoreCanvasHistoryAction
    | EditCompositeLayerAction
    | EditCompositeLayerInputAction
    | AppendCompositeLayerInputAction
    | RemoveCompositeLayerInputAction
    | MoveCompositeLayerInputAction
    | TransplantCompositeLayerInputAction
    | DeleteLayerAction
    | ApplyLayerFilterAction;

export function newDocument(): NewDocumentAction {
    return {
        type: ActionTypes.NEW_DOCUMENT,
    };
}

export function newBaseLayer(id: number, parent: number): NewLayerAction {
    return {
        type: ActionTypes.NEW_LAYER,
        payload: { id, parent, isComposite: false },
    };
}

export function newCompositeLayer(id: number, parent: number): NewLayerAction {
    return {
        type: ActionTypes.NEW_LAYER,
        payload: { id, parent, isComposite: true },
    };
}

export function editLayer(
    id: number,
    properties: Partial<Omit<Layer, "id">>
): EditLayerAction {
    return {
        type: ActionTypes.EDIT_LAYER,
        payload: { id, properties },
    };
}

export function editBaseLayer(
    id: number,
    properties: Partial<Omit<BaseLayer, "id">>
): EditBaseLayerAction {
    return {
        type: ActionTypes.EDIT_LAYER,
        payload: { id, properties },
    };
}

export function updateCanvas(
    id: number,
    canvas: HTMLCanvasElement
): UpdateCanvasAction {
    return {
        type: ActionTypes.UPDATE_CANVAS,
        payload: { id, canvas },
    };
}

export function restoreCanvasHistory(
    id: number,
    index: number
): RestoreCanvasHistoryAction {
    return {
        type: ActionTypes.RESTORE_CANVAS_HISTORY,
        payload: { id, index },
    };
}

export function undoCanvasUpdate(layer: BaseLayer) {
    const index = Math.min(
        layer.history.index + 1,
        layer.history.canvases.length
    );
    return restoreCanvasHistory(layer.id, index);
}

export function redoCanvasUpdate(layer: BaseLayer) {
    const index = Math.max(layer.history.index - 1, 0);
    return restoreCanvasHistory(layer.id, index);
}

export function newComposition(): NewCompositionAction {
    return {
        type: ActionTypes.NEW_COMPOSITION,
    };
}

export function editCompositeLayer(
    id: number,
    properties: Partial<Omit<CompositeLayer, "inputs">>
): EditCompositeLayerAction {
    return {
        type: ActionTypes.EDIT_COMPOSITE_LAYER,
        payload: { id, properties },
    };
}
export function editCompositeLayerInput(
    id: number,
    index: number,
    properties: Partial<InputProperties>
): EditCompositeLayerInputAction {
    return {
        type: ActionTypes.EDIT_COMPOSITE_LAYER_INPUT,
        payload: { id, index, properties },
    };
}

export function appendCompositeLayerInput(
    id: number,
    childID: number
): AppendCompositeLayerInputAction {
    return {
        type: ActionTypes.APPEND_COMPOSITE_LAYER_INPUT,
        payload: { id, childID },
    };
}

export function removeCompositeLayerInput(
    id: number,
    index: number
): RemoveCompositeLayerInputAction {
    return {
        type: ActionTypes.REMOVE_COMPOSITE_LAYER_INPUT,
        payload: { id, index },
    };
}

export function moveCompositeLayerInput(
    id: number,
    index: number,
    direction: -1 | 1
): MoveCompositeLayerInputAction {
    return {
        type: ActionTypes.MOVE_COMPOSITE_LAYER_INPUT,
        payload: { id, index, direction },
    };
}

export function transplantCompositeLayerInput(id: number, index: number, newLayerID: number): TransplantCompositeLayerInputAction {
    return {
        type: ActionTypes.TRANSPLANT_COMPOSITE_LAYER_INPUT,
        payload: { id, index, newLayerID, }
    }
}

export function deleteLayer(id: number): DeleteLayerAction {
    return {
        type: ActionTypes.DELETE_LAYER,
        payload: { id },
    };
}

export function applyLayerFilter(
    id: number,
    filter: string,
    value: number
): ApplyLayerFilterAction {
    return {
        type: ActionTypes.APPLY_LAYER_FILTER,
        payload: { id, filter, value },
    };
}
