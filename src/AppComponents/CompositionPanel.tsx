import { useCompositionRenderer } from "../Hooks/useCompositionRenderer";
import { CompositeLayer, ImageProject } from "../types";
import { CanvasPanel } from "./CanvasPanel";

export function CompositionPanel ({ compositeLayer, project }: { compositeLayer: CompositeLayer, project: ImageProject }) {
  const canvas = useCompositionRenderer(compositeLayer, project);
  return <CanvasPanel canvas={canvas} />
}