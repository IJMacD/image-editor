import { useContext } from "react";
import { CompositeLayer, ImageProject } from "../types";
import { getLayerByID, isCompositeLayer } from "../util/project";
import { DispatchContext } from "../Store/context";
import { deleteLayer, editBaseLayer, editCompositeLayerInput } from "../Store/project/actions";

export function CompositionTreePanel ({ project }: { project: ImageProject}) {
  return (
    <ul className="bg-white p-4">
      {
        project.compositions.map((id, i) => {
          const compositeLayer = project.layers.find(l => l.id === id && isCompositeLayer(l)) as CompositeLayer|undefined;
        return (
          <li key={i}>
            <b>Output {i}</b>
            { compositeLayer ? <CompositionTree compositeLayer={compositeLayer} project={project} /> : <li key={i} className="text-red">Cannot find layer</li>}
          </li>
        )})
      }
    </ul>
  )
}

function CompositionTree ({ compositeLayer, project }: { compositeLayer: CompositeLayer, project: ImageProject }) {
  const dispatch = useContext(DispatchContext);

  function handleEditComposition (index: number) {
    const operation = prompt("Composition type:", compositeLayer.inputs[index].operation);
    if (operation) {
      dispatch(editCompositeLayerInput(compositeLayer.id, index, { operation: operation as GlobalCompositeOperation }));
    }
  }

  return (
    <div>
      <div className="flex place-items-center">
        {/* <span className="flex-1">Composition: {composition.operation}</span> */}
        {/* <button onClick={handleEditComposition}>✎</button> */}
      </div>
      <ul className="list-disc ml-4">

        {
          compositeLayer.inputs.map((input, i) => {
              const layer = getLayerByID(project.layers, input.id);
              if (layer) {
                const l = layer;

                function handleRename () {
                  const name = prompt("Enter name", l.name);
                  if (name) {
                    dispatch(editBaseLayer(l.id, { name }))
                  }
                }

                function handleDelete() {
                  if (confirm(`Are you sure you want to delete '${l.name}'`)) {
                    dispatch(deleteLayer(l.id));
                  }
                }

                return (
                  <li key={i} className="flex place-items-center">
                    <span className="flex-1">{layer.name}</span>
                    <span className="flex-1" onClick={() => handleEditComposition(i)}>{input.operation}</span>
                    <button onClick={handleRename}>✎</button>
                    <button onClick={handleDelete}>🗑️</button>
                    { isCompositeLayer(layer) && <CompositionTree compositeLayer={layer} project={project} />}
                  </li>
                );
              }

              return <li key={i} className="text-red">Cannot find layer</li>;
          })
        }
      </ul>
    </div>
  )
}