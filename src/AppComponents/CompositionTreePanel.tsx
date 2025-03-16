import { useContext } from "react";
import { CompositeLayer, ImageProject } from "../types";
import { getLayerByID } from "../util/project";
import { DispatchContext } from "../Store/context";
import { editCompositeLayer, editLayer } from "../Store/project/actions";

export function CompositionTreePanel ({ project }: { project: ImageProject}) {
  return (
    <ul className="bg-white p-4">
      {
        project.compositions.map((c, i) => (
          <li key={i}>
            <b>Output {i}</b>
            <CompositionTree composition={c} project={project} />
          </li>
        ))
      }
    </ul>
  )
}

function CompositionTree ({ composition, project }: { composition: CompositeLayer, project: ImageProject }) {
  const dispatch = useContext(DispatchContext);

  function handleEditComposition () {
    const operation = prompt("Composition type:", composition.operation);
    if (operation) {
      dispatch(editCompositeLayer(composition, { operation: operation as GlobalCompositeOperation }));
    }
  }

  return (
    <div>
      <div className="flex place-items-center">
        <span className="flex-1">Composition: {composition.operation}</span>
        <button onClick={handleEditComposition}>✎</button>
      </div>
      <ul className="list-disc ml-4">

        {
          composition.inputs.map((input, i) => {
            if (typeof input === "number") {
              const layer = getLayerByID(project.layers, input);
              if (layer) {
                const l = layer;

                function handleRename () {
                  const name = prompt("Enter name", l.name);
                  if (name) {
                    dispatch(editLayer(l.id, { name }))
                  }
                }

                return (
                  <li key={i} className="flex place-items-center">
                    <span className="flex-1">{layer.name}</span>
                    <button onClick={handleRename}>✎</button>
                  </li>
                );
              }
              return <li key={i} className="text-red">Cannot find layer</li>;
            }
            return <CompositionTree key={i} composition={input} project={project} />;
          })
        }
      </ul>
    </div>
  )
}