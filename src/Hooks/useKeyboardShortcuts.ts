
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
import { newLayer } from "../Store/project/actions";
import { AppState } from "../Store/reducer";
import { getNextLayerID } from "../util/project";

export function useKeyboardShortcuts(store: AppState, dispatch: React.Dispatch<Action>) {

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
                    dispatch(newLayer(nextID));
                }
                e.preventDefault();
                return;
            }
            return;
        }

        switch (e.key) {
            case "p":
                dispatch(setTool("pencil"))
                break;
            case "o": {
                if (store.ui.tool === "shapes") {
                    const a = ["circle","rectangle","triangle"] as ("circle"|"rectangle"|"triangle")[];
                    const nextShape = a[(a.indexOf(store.ui.toolOptions.shape) + 1) % a.length];
                    dispatch(setShape(nextShape))
                }
                else {
                    dispatch(setTool("shapes"));
                }
                break;
            }
            case "l":
                dispatch(setTool("line"))
                break;
            case "f":
                dispatch(setTool("fill"))
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
                    const index = ((e.key.codePointAt(0) || 0) - ("0".codePointAt(0) || 0) + 9) % 10;
                    const id = store.project?.layers[index]?.id;
                    if (typeof id == "number") {
                        dispatch(setActiveLayer(id))
                    }
                }
                break;
        }
      };

      document.addEventListener("keydown", cb);

      return () => document.removeEventListener("keydown", cb);
    }, [store.project, dispatch, store.ui]);
}