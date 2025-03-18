import { BaseLayer, CompositeLayer, InputProperties } from "../../types";

export enum ActionTypes {
    NEW_DOCUMENT = "project/newDocument",
    NEW_LAYER = "project/newLayer",
    EDIT_LAYER = "project/editLayer",
    DELETE_LAYER = "project/deleteLayer",
    EDIT_COMPOSITE_LAYER = "project/editCompositeLayer",
    EDIT_COMPOSITE_LAYER_INPUT = "project/editCompositeLayerInput",
    NEW_COMPOSITION = "project/newComposition",
    APPLY_LAYER_FILTER = "project/applyLayerFilter",
}

type NewDocumentAction = { type: ActionTypes.NEW_DOCUMENT };
type NewCompositionAction = { type: ActionTypes.NEW_COMPOSITION };
type NewLayerAction = {
    type: ActionTypes.NEW_LAYER;
    payload: {
        id: number;
        name?: string;
        x?: number;
        y?: number;
        width?: number;
        height?: number;
    };
};
type EditBaseLayerAction = {
    type: ActionTypes.EDIT_LAYER;
    payload: {
        id: number;
        properties: Partial<Omit<BaseLayer, "id">>;
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
    | EditCompositeLayerAction
    | EditCompositeLayerInputAction
    | DeleteLayerAction
    | ApplyLayerFilterAction;

export function newDocument(): NewDocumentAction {
    return {
        type: ActionTypes.NEW_DOCUMENT,
    };
}

export function newLayer(id: number): NewLayerAction {
    return {
        type: ActionTypes.NEW_LAYER,
        payload: { id },
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