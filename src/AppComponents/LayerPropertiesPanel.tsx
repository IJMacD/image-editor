import { useContext, useEffect, useState } from "react";
import { isCompositeLayer } from "../util/project";
import { DispatchContext, StoreContext } from "../Store/context";
import { Layer } from "../types";
import { appendCompositeLayerInput, editLayer } from "../Store/project/actions";

export function LayerPropertiesPanel({ layer }: { layer: Layer }) {
    const store = useContext(StoreContext);
    const dispatch = useContext(DispatchContext);

    const { project } = store;

    const nonRootLayers = project?.layers.filter(l => !project.compositions.includes(l.id) && l.id !== layer.id) || [];

    const firstNonRootLayerID = nonRootLayers[0]?.id;
    const [selectedInsertLayer, setSelectedInsertLayer] = useState(firstNonRootLayerID);

    useEffect(() => {
        if (typeof selectedInsertLayer === "undefined" && typeof firstNonRootLayerID === "number") {
            setSelectedInsertLayer(firstNonRootLayerID);
        }
    }, [selectedInsertLayer, firstNonRootLayerID])

    function handleRename() {
        const name = prompt("Enter name", layer.name);
        if (name) {
            dispatch(editLayer(layer.id, { name }))
        }
    }

    function handleInsertInput() {
        if (isCompositeLayer(layer) && typeof selectedInsertLayer === "number") {
            dispatch(appendCompositeLayerInput(layer.id, selectedInsertLayer));
        }
    }

    function handleResize () {
        const width = parseInt(prompt("Enter width", layer.width.toString()) || "");
        if (width) {
            const height = parseInt(prompt("Enter height", layer.height.toString()) || "");

            if (height) {
                dispatch(editLayer(layer.id, { width, height }))
            }
        }
    }

    return (
        <div className="p-2 border-b-1 border-b-gray-200">
            <h2 className="font-bold text-xl">
                {layer.name}
                <button onClick={handleRename} className="ml-2 cursor-pointer">✎</button>
            </h2>
            <b>Layer Properties</b>
            <p>{layer.width}×{layer.height} <button onClick={handleResize} className="px-2 border-1 border-gray-400 bg-gray-200 rounded">Resize</button></p>
            {isCompositeLayer(layer) &&
                <div className="whitespace-nowrap">
                    <label>
                        <span className="mr-1">Add Layer</span>
                        <select value={selectedInsertLayer||nonRootLayers[0].id} onChange={e => setSelectedInsertLayer(+e.target.value)} className="border-1 rounded border-gray-300">
                            <option />
                            {
                                nonRootLayers.map((layer) => <option key={layer.id} value={layer.id}>{layer.name}</option>)
                            }
                        </select>
                    </label>
                    <button onClick={handleInsertInput} className={`rounded-sm m-1 px-2 bg-gray-100 border-1 border-gray-400 hover:bg-gray-200`}>➕</button>
                </div>
            }
        </div>
    )
}