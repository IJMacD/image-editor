import { useEffect, useRef, useState } from "react";

export function useThrottle<T> (value: T, ms = 200) {
    const [state, setState] = useState(value);
    const timeoutId = useRef<number>(undefined);
    const nextValue = useRef<T>(value);
    const haveNextValue = useRef(false);

    useEffect(() => {
        if (timeoutId.current) {
            // We're already in pause period. Save latest value to set at end of
            // pause period.
            nextValue.current = value;
            haveNextValue.current = true;
        }
        else {
            // Leading edge set
            setState(value);

            const pauseEnded = () => {
                if (haveNextValue.current) {
                    // Value was updated while we were paused. Trailing edge set
                    setState(nextValue.current);
                    // Mark this value consumed
                    haveNextValue.current = false;
                    // Restart another pause period
                    timeoutId.current = setTimeout(pauseEnded, ms);
                }
                else {
                    // No updates during pause. Clean up timeoutId
                    timeoutId.current = undefined;
                }
            }
            
            // Start pause period
            timeoutId.current = setTimeout(pauseEnded, ms);
        }
    }, [value]);

    return state;
}