import {
    decreaseToolSize,
    increaseToolSize,
    setActiveLayer,
    setShape,
    setTool,
    setToolColor,
    setToolStrokeColor,
} from "../Store/ui/actions";
import { Action } from "../Store/actions";
import { useEffect } from "react";
import {
    editCompositeLayerInput,
    newBaseLayer,
    newCompositeLayer,
    redoCanvasUpdate,
    undoCanvasUpdate,
} from "../Store/project/actions";
import { AppState } from "../Store/reducer";
import { getNextLayerID, isBaseLayer } from "../util/project";
import {
    selectNearestParent,
    selectSelectedInputLayer,
} from "../Store/selectors";
import { selectIsMovable } from "../Store/ui/selectors";
import { getInputByPath, getPathParentAndIndex } from "../util/ui";

export function useKeyboardShortcuts(
    store: AppState,
    dispatch: React.Dispatch<Action>
) {
    useEffect(() => {
        const cb = (e: KeyboardEvent) => {
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLSelectElement
            ) {
                return;
            }

            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case "l":
                        if (store.project) {
                            const nextID = getNextLayerID(store.project);
                            const parent = selectNearestParent(store);
                            if (typeof parent === "number") {
                                dispatch(
                                    e.shiftKey
                                        ? newCompositeLayer(nextID, parent)
                                        : newBaseLayer(nextID, parent)
                                );
                            }
                        }
                        e.preventDefault();
                        return;
                    case "z": {
                        const selectedLayer = selectSelectedInputLayer(store);
                        if (isBaseLayer(selectedLayer)) {
                            if (e.shiftKey) {
                                dispatch(redoCanvasUpdate(selectedLayer));
                            } else {
                                dispatch(undoCanvasUpdate(selectedLayer));
                            }
                        }
                        return;
                    }
                    case "y": {
                        const selectedLayer = selectSelectedInputLayer(store);
                        if (isBaseLayer(selectedLayer)) {
                            dispatch(redoCanvasUpdate(selectedLayer));
                        }
                        return;
                    }
                }
            }

            switch (e.key) {
                case "m":
                    dispatch(setTool("move"));
                    break;
                case "p":
                    dispatch(setTool("pencil"));
                    break;
                case "o": {
                    if (store.ui.tool === "shapes") {
                        const a = ["circle", "rectangle", "triangle"] as (
                            | "circle"
                            | "rectangle"
                            | "triangle"
                        )[];
                        const nextShape =
                            a[
                                (a.indexOf(store.ui.toolOptions.shape) + 1) %
                                    a.length
                            ];
                        dispatch(setShape(nextShape));
                    } else {
                        dispatch(setTool("shapes"));
                    }
                    break;
                }
                case "l":
                    dispatch(setTool("line"));
                    break;
                case "f":
                    dispatch(setTool("fill"));
                    break;
                case "x": {
                    const toolFillColor = store.ui.toolOptions.color;
                    const toolStrokeColor = store.ui.toolOptions.strokeColor;

                    dispatch(setToolColor(toolStrokeColor));
                    dispatch(setToolStrokeColor(toolFillColor));

                    break;
                }
                case "[":
                    dispatch(decreaseToolSize());
                    return;
                case "]":
                    dispatch(increaseToolSize());
                    return;
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                case "0":
                    {
                        const index =
                            ((e.key.codePointAt(0) || 0) -
                                ("0".codePointAt(0) || 0) +
                                9) %
                            10;
                        const id = store.project?.layers[index]?.id;
                        if (typeof id == "number") {
                            dispatch(setActiveLayer(id));
                        }
                    }
                    break;
                case "ArrowLeft":
                case "ArrowRight":
                case "ArrowUp":
                case "ArrowDown":
                    handleArrows(e, store, dispatch);
                    break;
            }
        };

        document.addEventListener("keydown", cb);

        return () => document.removeEventListener("keydown", cb);
    }, [store.project, dispatch, store]);
}

function handleArrows(
    e: KeyboardEvent,
    store: AppState,
    dispatch: React.Dispatch<Action>
) {
    if (store.ui.tool === "move" && selectIsMovable(store)) {
        const {
            project,
            ui: {
                inputs: { selectedPath },
            },
        } = store;
        const { id, index } = getPathParentAndIndex(project, selectedPath);
        const input = getInputByPath(project, selectedPath);
        if (
            typeof id !== "undefined" &&
            typeof index !== "undefined" &&
            input
        ) {
            const scale = e.shiftKey ? (e.ctrlKey ? 100 : 10) : 1;

            const dx =
                e.key === "ArrowLeft"
                    ? -scale
                    : e.key === "ArrowRight"
                    ? scale
                    : 0;
            const dy =
                e.key === "ArrowUp"
                    ? -scale
                    : e.key === "ArrowDown"
                    ? scale
                    : 0;

            const transform = DOMMatrix.fromMatrix(input.transform);
            transform.e += dx;
            transform.f += dy;

            dispatch(editCompositeLayerInput(id, index, { transform }));
        }
    }
}
