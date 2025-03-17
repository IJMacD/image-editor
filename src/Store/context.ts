import { createContext, Dispatch } from "react";
import { Action } from "./actions";
import { AppState, defaultAppState } from "./reducer";

export const StoreContext = createContext<AppState>(defaultAppState);

export const DispatchContext = createContext<Dispatch<Action>>(() => { console.warn("not real dispatch"); });
