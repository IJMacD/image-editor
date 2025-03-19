import { useContext, useState } from "react";
import { isCompositeLayer } from "../util/project";
import { DispatchContext, StoreContext } from "../Store/context";
import { Layer } from "../types";
import { appendCompositeLayerInput } from "../Store/project/actions";

export function LayerPropertiesPanel({ layer }: { layer: Layer }) {
    const store = useContext(StoreContext);
    const dispatch = useContext(DispatchContext);

    const { project } = store;

    const nonRootLayers = project?.layers.filter(l => !project.compositions.includes(l.id) && l.id !== layer.id) || [];

    const [selectedInsertLayer, setSelectedInsertLayer] = useState(nonRootLayers[0]?.id);

    function handleInsertInput() {
        if (isCompositeLayer(layer) && typeof selectedInsertLayer === "number") {
            dispatch(appendCompositeLayerInput(layer.id, selectedInsertLayer));
        }
    }

    return (
        <div>
            <b>{layer.name}</b>
            <p>{layer.width}×{layer.height}</p>
            {isCompositeLayer(layer) &&
                <div>
                    <select value={selectedInsertLayer} onChange={e => setSelectedInsertLayer(+e.target.value)}>
                        {
                            nonRootLayers.map((layer) => <option key={layer.id} value={layer.id}>{layer.name}</option>)
                        }
                    </select>
                    <button onClick={handleInsertInput} className={`rounded-sm m-1 px-2 bg-gray-100 border-1 border-gray-400 hover:bg-gray-200`}>➕</button>
                </div>
            }
        </div>
    )
}