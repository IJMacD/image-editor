import { useCompositionRenderer } from "../Hooks/useCompositionRenderer";
import { CompositeLayer, ImageProject } from "../types";
import { CanvasPanel } from "./CanvasPanel";

export function CompositionPanel ({ composition, project }: { composition: CompositeLayer, project: ImageProject }) {
  const canvas = useCompositionRenderer(composition, project);
  return <CanvasPanel canvas={canvas} />
}