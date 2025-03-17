
import {
  decreaseToolSize,
  increaseToolSize,
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
        if (e.ctrlKey || e.metaKey) {
          switch (e.key) {
            case "l":
              if (store.project) {
                const nextID = getNextLayerID(store.project);
                dispatch(newLayer(nextID));
              }
              e.preventDefault();
              return;
            default:
              console.log(e.key);
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
        }

        console.log(e.key);
      };

      document.addEventListener("keydown", cb);

      return () => document.removeEventListener("keydown", cb);
    }, [store.project, dispatch, store.ui]);
}