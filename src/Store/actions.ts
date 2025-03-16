import type { Action as ProjectAction } from "./project/actions";
import type { Action as UIAction } from "./ui/actions";

export type Action = ProjectAction | UIAction;
