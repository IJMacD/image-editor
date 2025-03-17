import type { Reducer } from "react";
import type { Action } from "./actions";
import { projectReducer } from "./project/reducer";
import type { ImageProject } from "../types";
import { defaultUIState, uiReducer, UIState } from "./ui/reducer";

export type AppState = {
  project: ImageProject | null;
  ui: UIState;
};
// export type AppState = ReturnType<typeof rootReducer>;


export const defaultAppState = {
  project: null,
  ui: defaultUIState,
};

function combineReducers<S, A>(slices: {
  [prop: string]: Reducer<any, A>;
}): Reducer<S, A> {
  return (state: any, action: A) =>
    Object.keys(slices).reduce(
      // use for..in loop, if you prefer it
      (acc, prop) => ({
        ...acc,
        [prop]: slices[prop](acc[prop], action),
      }),
      state
    );
}

export const rootReducer: Reducer<AppState, Action> = combineReducers({
  project: projectReducer,
  ui: uiReducer,
});
