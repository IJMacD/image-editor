import { ImageProject } from "../types";
import { TabPanel } from "../Widgets/TabPanel";
import { CanvasPanel } from "./CanvasPanel";
import { CompositionPanel } from "./CompositionPanel";

export function LayersPanel ({ project }: { project: ImageProject}) {
  const { layers, compositions } = project;

  const layerLabels = [
    ...layers.map(l => l.name),
    ...compositions.map((_, i) => `Output ${i}`),
  ];

  return (
    <TabPanel labels={layerLabels}>
      {
        layers.map((layer) =>
          <div key={layer.id} className='bg-white flex-2 h-full p-4'>
            <CanvasPanel canvas={layer.canvas} editableLayer={layer} />
          </div>
        )
      }
      {
        compositions.map((composition, i) => (
          <div key={i} className='bg-white flex-2 h-full p-4'>
            <CompositionPanel composition={composition} project={project} />
          </div>
        ))
      }
    </TabPanel>
  )
}