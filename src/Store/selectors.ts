import { getLayerByID } from "../util/project";
import { AppState } from "./reducer";

export function selectActiveLayer(store: AppState) {
    return getLayerByID(
        store.project?.layers || [],
        store.ui.layers.activeLayerID
    );
}
