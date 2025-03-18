import { useContext } from "react";
import { DispatchContext, StoreContext } from "../../Store/context";
import { RibbonDivider } from "../../Widgets/RibbonDivider";
import { RibbonButton } from "../../Widgets/RibbonButton";
import { selectActiveLayer } from "../../Store/selectors";
import { isBaseLayer } from "../../util/project";
import { applyLayerFilter } from "../../Store/project/actions";

export function LayerTab () {
    const store = useContext(StoreContext);
    const dispatch = useContext(DispatchContext);

    const layer = selectActiveLayer(store);

    function handleAction (action: string) {
        if (!isBaseLayer(layer) || !layer.canvas) {
            return;
        }

        switch(action) {
            case "invert":
                dispatch(applyLayerFilter(store.ui.layers.activeLayerID, "invert", 1));
                break;
            case "greyscale":
                dispatch(applyLayerFilter(store.ui.layers.activeLayerID, "greyscale", 1));
                break;
            case "blur":
                dispatch(applyLayerFilter(store.ui.layers.activeLayerID, "blur", 4));
                break;
        }
    }

    return (
        <>
            <RibbonButton icon="🖼️" label="Export" />
            <RibbonDivider />
            <RibbonButton icon="↔️" label="Resize" />
            <RibbonDivider />
            <RibbonButton icon="☯" label="Invert" onClick={() => handleAction("invert")} />
            <RibbonButton icon="🖼" label="Greyscale" onClick={() => handleAction("greyscale")} />
            <RibbonButton icon="😵‍💫" label="Blur" onClick={() => handleAction("blur")} />
        </>
    );
}