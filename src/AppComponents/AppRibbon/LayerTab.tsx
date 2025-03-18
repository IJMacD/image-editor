import { useContext } from "react";
import { StoreContext } from "../../Store/context";
import { RibbonDivider } from "../../Widgets/RibbonDivider";
import { RibbonButton } from "../../Widgets/RibbonButton";
import { selectActiveLayer } from "../../Store/selectors";
import { isBaseLayer } from "../../util/project";
import { Editor } from "../../Editor";

export function LayerTab () {
    const store = useContext(StoreContext);

    const layer = selectActiveLayer(store);

    function handleAction (action: string) {
        if (!isBaseLayer(layer) || !layer.canvas) {
            return;
        }

        switch(action) {
            case "invert":
                Editor.invert(layer.canvas, 1);
                break;
            case "greyscale":
                Editor.greyscale(layer.canvas, 1);
                break;
            case "blur":
                Editor.blur(layer.canvas, 4);
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