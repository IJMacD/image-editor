import { getCompositeLayerByID, getLayerByID, isCompositeLayer } from "../util/project";
import { AppState } from "./reducer";

export function selectActiveLayer(store: AppState) {
    return getLayerByID(
        store.project?.layers || [],
        store.ui.layers.activeLayerID
    );
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