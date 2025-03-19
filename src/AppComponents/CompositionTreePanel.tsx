import { MouseEvent, useContext, useEffect, useState } from "react";
import { CompositeLayer, ImageProject, InputProperties } from "../types";
import { getLayerByID, isCompositeLayer } from "../util/project";
import { DispatchContext, StoreContext } from "../Store/context";
import { appendCompositeLayerInput, deleteLayer, editBaseLayer, editCompositeLayerInput, removeCompositeLayerInput } from "../Store/project/actions";
import { setActiveLayer } from "../Store/ui/actions";
import { LayerPropertiesPanel } from "./LayerPropertiesPanel";

export function CompositionTreePanel ({ project }: { project: ImageProject}) {
    const store = useContext(StoreContext);
    const dispatch = useContext(DispatchContext);

    const [selectedPath, setSelectedPath] = useState(store.project ? [store.project.compositions[0]] : []);


    const { activeLayerID } = store.ui.layers;

    const pathLayer = getLayerByPath(store.project, selectedPath);
    const pathID = pathLayer?.id;

    useEffect(() => {
        if (pathID !== activeLayerID) {
            setSelectedPath([]);
        }
    }, [pathID, activeLayerID]);

    function handleDelete() {
        if (pathLayer) {
            if (confirm(`Are you sure you want to delete '${pathLayer.name}'`)) {
                dispatch(deleteLayer(pathLayer.id));
            }
        }
    }

    function handleRemove() {
        if (selectedPath.length > 1) {
            const parent = getLayerByPath(project, selectedPath.slice(0, -1));
            if (parent) {
                dispatch(removeCompositeLayerInput(parent.id, selectedPath[selectedPath.length - 1]))
            }
        }
    }

    function handleLayerClick(id: number, indices: number[]) {
        dispatch(setActiveLayer(id));
        setSelectedPath(indices);
    }

    const haveSelectedPath = selectedPath.length > 1;

    return (
        <div className="bg-white flow-root">
            <ul className="my-2">
                {
                    project.compositions.map((id, i) => {
                        const compositeLayer = project.layers.find(l => l.id === id && isCompositeLayer(l)) as CompositeLayer | undefined;

                        function handleRename(e: MouseEvent) {
                            e.stopPropagation();
                            if (compositeLayer) {
                                const name = prompt("Enter name", compositeLayer.name);
                                if (name) {
                                    dispatch(editBaseLayer(compositeLayer.id, { name }))
                                }
                            }
                        }

                        const isSelected = selectedPath.length === 1 && selectedPath[0] === id;

                        return compositeLayer ?
                            <li key={i}>
                                <div className={isSelected ? "bg-gray-200" : undefined} onClick={() => handleLayerClick(id, [i])}>
                                    <span className={`cursor-pointer hover:underline hover decoration-dotted p-1`} onClick={handleRename}>{compositeLayer.name}</span>
                                </div>
                                <CompositionTree compositeLayer={compositeLayer} project={project} selectedPath={selectedPath} path={[i]} onClick={handleLayerClick} />
                            </li> :
                            <li key={i} className="text-red">Cannot find layer</li>
                    })
                }
            </ul>
            <div>
                <button onClick={handleRemove} className={`rounded-sm m-1 px-2 bg-gray-100 border-1 border-gray-400 ${haveSelectedPath ? "hover:bg-gray-200" : "opacity-50"}`} disabled={!haveSelectedPath}>❎</button>
                <button onClick={handleDelete} className={`rounded-sm m-1 px-2 bg-gray-100 border-1 border-gray-400 ${haveSelectedPath ? "hover:bg-gray-200" : "opacity-50"}`} disabled={!haveSelectedPath}>🗑️</button>
                <button onClick={handleDelete} className={`rounded-sm m-1 px-2 bg-gray-100 border-1 border-gray-400 ${haveSelectedPath ? "hover:bg-gray-200" : "opacity-50"}`} disabled={!haveSelectedPath}>↓</button>
                <button onClick={handleDelete} className={`rounded-sm m-1 px-2 bg-gray-100 border-1 border-gray-400 ${haveSelectedPath ? "hover:bg-gray-200" : "opacity-50"}`} disabled={!haveSelectedPath}>↑</button>
            </div>
            {pathLayer && <LayerPropertiesPanel layer={pathLayer} />}
        </div>
    )
}

function CompositionTree({ compositeLayer, project, selectedPath, onClick, path }: { compositeLayer: CompositeLayer, project: ImageProject, selectedPath: number[], onClick: (id: number, path: number[]) => void, path: number[] }) {
    const dispatch = useContext(DispatchContext);

    function handleEditInput(index: number, properties: Partial<InputProperties>) {
        dispatch(editCompositeLayerInput(compositeLayer.id, index, { ...properties }));
    }

    return (
        <ul className="ml-2">
            {
                compositeLayer.inputs.map((input, i) => {
                    const layer = getLayerByID(project.layers, input.id);
                    if (layer) {
                        const l = layer;
                        const myPath = [...path, i];

                        function handleRename() {
                            const name = prompt("Enter name", l.name);
                            if (name) {
                                dispatch(editBaseLayer(l.id, { name }))
                            }
                        }

                        const isSelected = pathsEqual(selectedPath, myPath);

                        return (
                            <li key={i}>
                                <div className={`flex place-items-center p-1 ${isSelected ? "bg-gray-200" : "undefined"}`}>
                                    <div className="flex-1" onClick={(e) => e.currentTarget === e.target && onClick(l.id, myPath)} >
                                        <span className="cursor-pointer hover:underline hover:decoration-dotted" onClick={handleRename}>
                                            {layer.name}
                                        </span>
                                    </div>
                                    <CompositionModeSelect value={input.operation} onChange={(operation) => handleEditInput(i, { operation })} />
                                    <button className="ml-1 w-4" onClick={() => handleEditInput(i, { enabled: !input.enabled })}>{input.enabled ? "◉" : "◎"}</button>
                                </div>
                                {isCompositeLayer(layer) && <CompositionTree compositeLayer={layer} project={project} selectedPath={selectedPath} onClick={onClick} path={[...path, i]} />}
                            </li>
                        );
                    }

                    return <li key={i} className="text-red">Cannot find layer</li>;
                })
            }
        </ul>
    )
}

function pathsEqual<T>(a: T[], b: T[]): boolean {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }

    return true;
}

function getLayerByPath(project: ImageProject | null, path: number[]) {
    if (!project) {
        return undefined;
    }

    const [compositionIndex, ...p] = path;

    const id = typeof compositionIndex === "number" && project.compositions[compositionIndex];

    if (typeof id !== "number") {
        return undefined;
    }

    let layer = getLayerByID(project.layers, id);

    if (!isCompositeLayer(layer)) {
        return undefined
    }

    for (const index of p) {
        if (isCompositeLayer(layer)) {
            const id = layer.inputs[index]?.id;

            layer = getLayerByID(project.layers, id);
        }
    }

    return layer;
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