import { AppState } from "../reducer";

export function selectProject(state: AppState) {
  return state.project;
}
