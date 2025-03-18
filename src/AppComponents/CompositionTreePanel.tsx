import { useContext } from "react";
import { CompositeLayer, ImageProject } from "../types";
import { getLayerByID, isCompositeLayer } from "../util/project";
import { DispatchContext } from "../Store/context";
import { deleteLayer, editBaseLayer, editCompositeLayerInput } from "../Store/project/actions";

export function CompositionTreePanel ({ project }: { project: ImageProject}) {
    const dispatch = useContext(DispatchContext);

    return (
        <ul className="bg-white p-4">
            {
                project.compositions.map((id, i) => {
                    const compositeLayer = project.layers.find(l => l.id === id && isCompositeLayer(l)) as CompositeLayer|undefined;

                    function handleRename () {
                        if (compositeLayer) {
                            const name = prompt("Enter name", compositeLayer.name);
                            if (name) {
                                dispatch(editBaseLayer(compositeLayer.id, { name }))
                            }
                        }
                    }

                    return compositeLayer ?
                        <li key={i}>
                            <b>{compositeLayer.name}</b>
                            <button onClick={handleRename} className="ml-2 cursor-pointer">✎</button>
                            <CompositionTree compositeLayer={compositeLayer} project={project} />
                        </li> :
                        <li key={i} className="text-red">Cannot find layer</li>
                })
            }
        </ul>
    )
}

function CompositionTree ({ compositeLayer, project }: { compositeLayer: CompositeLayer, project: ImageProject }) {
    const dispatch = useContext(DispatchContext);

    function handleEditInput (index: number, properties: any) {
        dispatch(editCompositeLayerInput(compositeLayer.id, index, { ...properties }));
    }

    return (
        <div>
            <div className="flex place-items-center">
                {/* <span className="flex-1">Composition: {composition.operation}</span> */}
                {/* <button onClick={handleEditComposition}>✎</button> */}
            </div>
            <ul className="list-disc ml-4">
                {
                    compositeLayer.inputs.map((input, i) => {
                        const layer = getLayerByID(project.layers, input.id);
                        if (layer) {
                            const l = layer;

                            function handleRename () {
                                const name = prompt("Enter name", l.name);
                                if (name) {
                                    dispatch(editBaseLayer(l.id, { name }))
                                }
                            }

                            function handleDelete() {
                                if (confirm(`Are you sure you want to delete '${l.name}'`)) {
                                    dispatch(deleteLayer(l.id));
                                }
                            }

                            return (
                                <li key={i} className="flex place-items-center">
                                    <span className="flex-1">
                                        {layer.name}
                                        <button onClick={handleRename} className="ml-2 cursor-pointer">✎</button>
                                    </span>
                                    <button onClick={() => handleEditInput(i, { enabled: !input.enabled })}>{input.enabled?"◉":"◎"}</button>
                                    <CompositionModeSelect value={input.operation} onChange={(operation) => handleEditInput(i, { operation })} />
                                    <button onClick={handleDelete}>🗑️</button>
                                    { isCompositeLayer(layer) && <CompositionTree compositeLayer={layer} project={project} />}
                                </li>
                            );
                        }

                        return <li key={i} className="text-red">Cannot find layer</li>;
                    })
                }
            </ul>
        </div>
    )
}

const CompositionModes = [
    "source-over",
    "source-in",
    "source-out",
    "source-atop",
    "destination-over",
    "destination-in",
    "destination-out",
    "destination-atop",
    "lighter",
    "copy",
    "xor",
    "multiply",
    "screen",
    "overlay",
    "darken",
    "lighten",
    "color-dodge",
    "color-burn",
    "hard-light",
    "soft-light",
    "difference",
    "exclusion",
    "hue",
    "saturation",
    "color",
    "luminosity",
]

function CompositionModeSelect ({ value, onChange }: { value: GlobalCompositeOperation, onChange: (value: GlobalCompositeOperation) => void }) {
    return (
        <select value={value} onChange={e => onChange(e.target.value as GlobalCompositeOperation)}>
            {
                CompositionModes.map(mode => <option key={mode} value={mode}>{mode}</option>)
            }
        </select>
    )
}