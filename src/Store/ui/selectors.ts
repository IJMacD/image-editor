import { getLayerByPath, pathToIDs } from "../../util/ui";
import { AppState } from "../reducer";

export function selectIsMovable(store: AppState) {
    const {
        layers: { activeLayerID },
        inputs: { selectedPath },
    } = store.ui;
    const pathLayer = getLayerByPath(store.project, selectedPath);
    return (
        activeLayerID !== pathLayer?.id &&
        pathToIDs(store.project, selectedPath)?.includes(activeLayerID)
    );
}
