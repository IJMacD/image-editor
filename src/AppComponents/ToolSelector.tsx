import { useContext } from "react"
import { DispatchContext, StoreContext } from "../Store/context"
import { setTool } from "../Store/ui/actions";
import { isBaseLayer } from "../util/project";
import { selectActiveLayer } from "../Store/selectors";

export function ToolSelector () {
  const store = useContext(StoreContext);
  const dispatch = useContext(DispatchContext);

  const tool = store.ui.tool;
  const shape = store.ui.toolOptions.shape;

  const isActiveLayerABaseLayer = isBaseLayer(selectActiveLayer(store))

  const shapeMap = {
    "circle": "🔴",
    "rectangle": "🟥",
    "triangle": "🔺",
  };

  const tools = {
    "pencil": "✏️",
    "shapes": shapeMap[shape],
    "line": "📈",
    "fill": <span className="block" style={{transform:"rotate(45deg)"}}>🪣</span>,
  }

  return Object.entries(tools).map(([id, label]) => <button key={id} className={`size-12 p-0 m-1 rounded ${tool === id ? "bg-white" : ""}`} onClick={() => dispatch(setTool(id))} disabled={!isActiveLayerABaseLayer} style={{filter: isActiveLayerABaseLayer ? undefined : "grayscale(1)"}}>{label}</button>)
}