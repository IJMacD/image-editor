import { getCompositeLayerByID, getLayerByID, isCompositeLayer } from "../util/project";
import { getInputByPath } from "../util/ui";
import { AppState } from "./reducer";

export function selectActiveLayer(store: AppState) {
    return getLayerByID(
        store.project?.layers || [],
        store.ui.layers.activeLayerID
    );
}

export function selectSelectedInput(store: AppState) {
    return getInputByPath(store.project, store.ui.inputs.selectedPath);
}

export function selectSelectedInputLayer(store: AppState) {
    const input = getInputByPath(store.project, store.ui.inputs.selectedPath);
    return input ? getLayerByID(store.project?.layers, input.id) : undefined;
}

export function selectNearestParent(store: AppState) {
    const { activeLayerID } = store.ui.layers;

    const activeLayer = getCompositeLayerByID(store.project?.layers, activeLayerID);

    if (activeLayer) {
        return activeLayerID;
    }

    const parent = store.project?.layers.find(l => isCompositeLayer(l) && l.inputs.some(i => i.id === activeLayerID));
    if (parent) {
        return parent.id;
    }

    return store.project?.compositions[0];
}