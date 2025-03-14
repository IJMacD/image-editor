import { createContext, Dispatch } from "react";
import { ImageProject } from "../types";
import { Action } from "./actions";

export const ProjectContext = createContext<ImageProject | null>(null);

export const ProjectDispatchContext = createContext<Dispatch<Action>>(
  () => void 0
);
