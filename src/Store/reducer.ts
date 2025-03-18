import type { Reducer } from "react";
import type { Action } from "./actions";
import { defaultProjectState, projectReducer } from "./project/reducer";
import type { ImageProject, UIState } from "../types";
import { defaultUIState, uiReducer } from "./ui/reducer";

export type AppState = {
  project: ImageProject | null;
  ui: UIState;
};
// export type AppState = ReturnType<typeof rootReducer>;


export const defaultAppState = {
  project: defaultProjectState,
  ui: defaultUIState,
};

function combineReducers<S, A>(slices: {
  [prop: string]: Reducer<any, A>;
}): Reducer<S, A> {
  return (state: S, action: A) =>
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
