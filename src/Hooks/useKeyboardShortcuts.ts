
import { decreaseToolSize, increaseToolSize } from "../Store/ui/actions";
import { Action } from "../Store/actions";
import { useEffect } from "react";
import { newLayer } from "../Store/project/actions";
import { AppState } from "../Store/reducer";
import { getNextLayerID } from "../util/project";

export function useKeyboardShortcuts(store: AppState, dispatch: React.Dispatch<Action>) {

    useEffect(() => {
        const cb = (e: KeyboardEvent) => {

            if (e.ctrlKey && e.key != "Control") {
                console.log("Ctrl + " + e.key);
                switch (e.key) {
                    case "n": 
                        if (store.project) {
                            const nextID = getNextLayerID(store.project);
                            dispatch(newLayer(nextID));
                        }
                        return;
                    default:
                        console.log(e.key);
                }
                return;
            }

            switch (e.key) {
                case "[":
                    dispatch(decreaseToolSize());
                    return
                case "]":
                    dispatch(increaseToolSize());
                    return
            }

            console.log(e.key);
        };

        document.addEventListener("keydown", cb);

        return () => document.removeEventListener("keydown", cb);
    }, [store.project, dispatch]);
}