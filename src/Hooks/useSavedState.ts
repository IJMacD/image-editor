import { Dispatch, useEffect, useState } from "react";

export function useSavedState<T>(
  key: string,
  initialState: T
): [T, Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = useState(() => {
        const savedState = localStorage.getItem(key);

        // Try to load saved data from local storage
        if (savedState) {
            try {
                return JSON.parse(savedState);
            } catch (e) {
                console.log("Unable to restore state", e);
            }
        }

        // Fallback to provided initial state
        return initialState;
    });

    // Update localstorage any time state changes
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch (e) {
            console.error("Unable to save state", e);
        }
    }, [state]);

    return [state, setState];
}
