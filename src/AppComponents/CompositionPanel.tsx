import { useContext } from "react";
import { useCompositionRenderer } from "../Hooks/useCompositionRenderer";
import { CompositeLayer } from "../types";
import { CanvasPanel } from "./CanvasPanel";
import { StoreContext } from "../Store/context";
import { selectSelectedInput, selectSelectedInputLayer } from "../Store/selectors";
import { isBaseLayer } from "../util/project";

export function CompositionPanel({ compositeLayer }: { compositeLayer: CompositeLayer }) {
  const store = useContext(StoreContext);
  const { project } = store;
  const canvas = useCompositionRenderer(compositeLayer, project);

  const selectedInput = selectSelectedInput(store);
  const selectedInputLayer = selectSelectedInputLayer(store);
  const editableLayer = isBaseLayer(selectedInputLayer) ? selectedInputLayer : undefined;

  return <CanvasPanel canvas={canvas} editableLayer={editableLayer} editableInput={selectedInput} />
}