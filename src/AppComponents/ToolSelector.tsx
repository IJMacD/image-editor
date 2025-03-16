import { useContext } from "react"
import { DispatchContext, StoreContext } from "../Store/context"
import { setTool } from "../Store/ui/actions";

export function ToolSelector () {
  const store = useContext(StoreContext);
  const dispatch = useContext(DispatchContext);

  const tool = store.ui.tool;

  const tools = {
    "pencil": "🖉",
    "shapes": "○",
    "fill": "🪣",
  }

  return Object.entries(tools).map(([id, label]) => <button key={id} className={`size-12 p-0 m-1 rounded ${tool === id ? "bg-white" : ""}`} onClick={() => dispatch(setTool(id))}>{label}</button>)
}