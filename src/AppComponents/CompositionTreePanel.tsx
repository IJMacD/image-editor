import { useContext } from "react";
import { CompositeLayer, ImageProject, InputProperties } from "../types";
import { getLayerByID, isCompositeLayer } from "../util/project";
import { DispatchContext, StoreContext } from "../Store/context";
import { deleteLayer, editCompositeLayerInput, moveCompositeLayerInput, removeCompositeLayerInput, transplantCompositeLayerInput } from "../Store/project/actions";
import { LayerPropertiesPanel } from "./LayerPropertiesPanel";
import { InputPropertiesPanel } from "./InputPropertiesPanel";
import { setActiveLayer, setSelectedInputPath } from "../Store/ui/actions";
import { getInputByPath, getLayerByPath, pathsEqual } from "../util/ui";

export function CompositionTreePanel ({ project }: { project: ImageProject}) {
    const store = useContext(StoreContext);
    const dispatch = useContext(DispatchContext);

    const { selectedPath } = store.ui.inputs;

    const pathInput = getInputByPath(store.project, selectedPath);
    const pathIndex = selectedPath[selectedPath.length - 1];

    const pathParent = getLayerByPath(store.project, selectedPath.slice(0, -1))

    const pathLayer = getLayerByPath(store.project, selectedPath);

    function handleDelete() {
        if (pathLayer) {
            if (confirm(`Are you sure you want to delete '${pathLayer.name}'`)) {
                dispatch(deleteLayer(pathLayer.id));
            }
        }
    }

    function handleRemove() {
        if (pathParent) {
            dispatch(removeCompositeLayerInput(pathParent.id, pathIndex))
        }
    }

    function handleMove (direction: -1|1) {
        if (pathParent) {
            dispatch(moveCompositeLayerInput(pathParent.id, pathIndex, direction))
            dispatch(setSelectedInputPath([...selectedPath.slice(0, -1), pathIndex+direction]));
        }
    }

    function handleLayerClick(indices: number[]) {
        dispatch(setSelectedInputPath(indices));
    }

    function handleInputEdit (properties: Partial<InputProperties>) {
        if (pathParent) {
            dispatch(editCompositeLayerInput(pathParent.id, pathIndex, properties))
        }
    }

    const haveSelectedPath = selectedPath.length > 1;

    const currentChildCount = isCompositeLayer(pathParent) ? pathParent.inputs.length : 0

    const precedingChild = pathIndex > 0 ? getLayerByPath(project, [...selectedPath.slice(0, -1), pathIndex - 1]) : undefined;
    const precedingCompositeLayerID = isCompositeLayer(precedingChild) ? precedingChild.id : undefined;

    function handleIndent() {
        if (pathParent && typeof precedingCompositeLayerID === "number") {
            dispatch(transplantCompositeLayerInput(pathParent.id, pathIndex, precedingCompositeLayerID))
        };
    }

    const buttonStyle = `rounded-sm m-1 px-2 bg-gray-100 border-1 border-gray-400 hover:bg-gray-200 disabled:hover:bg-gray-100 disabled:opacity-50`;

    return (
        <div className="bg-white flow-root">
            <ul className="my-2">
                {
                    project.compositions.map((id, i) => {
                        const compositeLayer = project.layers.find(l => l.id === id && isCompositeLayer(l)) as CompositeLayer | undefined;

                        const isSelected = selectedPath.length === 1 && selectedPath[0] === id;

                        return compositeLayer ?
                            <li key={i}>
                                <div className={isSelected ? "bg-gray-200" : undefined} onClick={(e) => { if (e.altKey) { dispatch(setActiveLayer(id)); } handleLayerClick([i]); }}>
                                    {compositeLayer.name}
                                </div>
                                <CompositionTree compositeLayer={compositeLayer} project={project} selectedPath={selectedPath} path={[i]} onClick={handleLayerClick} />
                            </li> :
                            <li key={i} className="text-red">Cannot find layer</li>
                    })
                }
            </ul>
            <div>
                <button onClick={handleRemove} className={buttonStyle} disabled={!haveSelectedPath}>❎</button>
                <button onClick={handleDelete} className={buttonStyle} disabled={!haveSelectedPath}>🗑️</button>
                <button onClick={() => handleMove(-1)} className={buttonStyle} disabled={!haveSelectedPath || pathIndex === 0}>↑</button>
                <button onClick={() => handleMove(+1)} className={buttonStyle} disabled={!haveSelectedPath || pathIndex === currentChildCount - 1}>↓</button>
                <button onClick={() => handleIndent()} className={buttonStyle} disabled={!haveSelectedPath || typeof precedingCompositeLayerID === "undefined"}>→</button>
            </div>
            {pathLayer && <LayerPropertiesPanel layer={pathLayer} />}
            {pathInput && <InputPropertiesPanel key={getInputKey(selectedPath, pathInput)} input={pathInput} onEdit={handleInputEdit} />}
        </div>
    )
}

function CompositionTree({ compositeLayer, project, selectedPath, onClick, path }: { compositeLayer: CompositeLayer, project: ImageProject, selectedPath: number[], onClick: (path: number[]) => void, path: number[] }) {
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
                        const myPath = [...path, i];

                        const isSelected = pathsEqual(selectedPath, myPath);

                        return (
                            <li key={i}>
                                <div className={`flex place-items-center p-1 ${isSelected ? "bg-gray-200" : "undefined"}`}>
                                    <div className="flex-1" onClick={(e) => { if (e.altKey) { dispatch(setActiveLayer(layer.id)); } onClick(myPath); }} >
                                        {layer.name}
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

function getInputKey (path: number[], input: InputProperties) {
    return path.join() + "|" + input.id;
}