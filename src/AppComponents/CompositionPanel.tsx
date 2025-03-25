import { useCompositionRenderer } from "../Hooks/useCompositionRenderer";
import { CompositeLayer, ImageProject, InputProperties } from "../types";
import { CanvasPanel } from "./CanvasPanel";

export function CompositionPanel ({ compositeLayer, project, input }: { compositeLayer: CompositeLayer, project: ImageProject, input?: InputProperties }) {
  const canvas = useCompositionRenderer(compositeLayer, project);
  return <CanvasPanel canvas={canvas} input={input} />
}