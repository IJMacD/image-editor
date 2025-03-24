import { useContext, useEffect, useState } from "react";
import { ImageProject } from "../types";
import { TabPanel } from "../Widgets/TabPanel";
import { CanvasPanel } from "./CanvasPanel";
import { CompositionPanel } from "./CompositionPanel";
import { DispatchContext, StoreContext } from "../Store/context";
import { setActiveLayer } from "../Store/ui/actions";
import { isCompositeLayer } from "../util/project";

export function LayersPanel ({ project }: { project: ImageProject}) {
  const store = useContext(StoreContext);
  const dispatch = useContext(DispatchContext);

  const [activeCompositionIndex, setActiveCompositionIndex] = useState(-1);

  const { layers, compositions } = project;

  const layerLabels = [
    ...layers.map(l => l.name),
    ...compositions.map((_, i) => `Output ${i}`),
  ];

  const activeLayerID = store.ui.layers.activeLayerID;

  const selectedIndex = layers.findIndex(l => l.id === activeLayerID);

  const className = 'bg-white flex-2 h-full p-4 flex place-items-center justify-center';

  function handleTabClick(index: number) {
    if (index < layers.length) {
      dispatch(setActiveLayer(layers[index].id));
      setActiveCompositionIndex(-1);
    }
    else {
      setActiveCompositionIndex(index - layers.length);
    }
  }

  return (
    <TabPanel labels={layerLabels} selectedIndex={activeCompositionIndex < 0 ? selectedIndex : activeCompositionIndex + layers.length} onClickTab={handleTabClick}>
      {
        layers.map((layer) =>
          <div key={layer.id} className={className}>
            {
              isCompositeLayer(layer) ?
              <CompositionPanel compositeLayer={layer} project={project} /> :
              <CanvasPanel canvas={layer.canvas} editableLayer={layer} />
            }
          </div>
        )
      }
    </TabPanel>
  )
}