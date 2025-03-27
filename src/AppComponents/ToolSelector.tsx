import { useContext } from "react"
import { DispatchContext, StoreContext } from "../Store/context"
import { setTool } from "../Store/ui/actions";
import { isBaseLayer } from "../util/project";
import { selectSelectedInputLayer } from "../Store/selectors";
import { selectIsMovable } from "../Store/ui/selectors";

export function ToolSelector () {
  const store = useContext(StoreContext);
  const dispatch = useContext(DispatchContext);

  const tool = store.ui.tool;
  const shape = store.ui.toolOptions.shape;

  const isActiveLayerABaseLayer = isBaseLayer(selectSelectedInputLayer(store))

  const shapeMap = {
    "circle": "🔴",
    "rectangle": "🟥",
    "triangle": "🔺",
  };

  const tools = {
    "move": "↔️",
    "pencil": "✏️",
    "shapes": shapeMap[shape],
    "line": "📈",
    "eraser": <span className="block" style={{transform:"rotate(180deg)"}}>✏️</span>,
    "fill": <span className="block" style={{transform:"rotate(45deg)"}}>🪣</span>,
  }


  return Object.entries(tools).map(([id, label]) => {
    const isMovable = selectIsMovable(store);
    const disabled = id === "move" ? !isMovable : !isActiveLayerABaseLayer;

    return (
      <button key={id} className={`size-12 p-0 m-1 rounded ${tool === id ? "bg-white" : ""}`} onClick={() => dispatch(setTool(id))} disabled={disabled} style={{filter: disabled ? "grayscale(1)" : undefined}}>{label}</button>
    );
  });
}