
import { decreaseToolSize, increaseToolSize } from "../Store/ui/actions";
import { Action } from "../Store/actions";
import { useEffect } from "react";
import { newLayer } from "../Store/project/actions";

export function useKeyboardShortcuts(dispatch: React.Dispatch<Action>) {

    useEffect(() => {
        const cb = (e: KeyboardEvent) => {

            if (e.ctrlKey && e.key != "Control") {
                console.log("Ctrl + " + e.key);
                switch (e.key) {
                    case "n":
                        dispatch(newLayer());
                        e.preventDefault();
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
    }, [dispatch]);
}