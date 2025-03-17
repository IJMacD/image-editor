import { useContext } from "react";
import { Ribbon } from "../../Widgets/Ribbon";
import { RibbonButton } from "../../Widgets/RibbonButton";
import { RibbonDivider } from "../../Widgets/RibbonDivider";
import { StoreContext, DispatchContext } from "../../Store/context";
import { newComposition, newDocument, newLayer } from "../../Store/project/actions";
import { RibbonTab } from "../../Widgets/RibbonTab";
import { selectProject } from "../../Store/project/selectors";
import { setRibbonTab, setToolSize, setToolStrokeColor } from "../../Store/ui/actions";
import { getNextLayerID } from "../../util/project";
import { ShapeTab } from "./ShapeTab";

export function AppRibbon () {
  const store = useContext(StoreContext);
  const dispatch = useContext(DispatchContext);

  const ribbonTab = store.ui.ribbon.selectedTabID;

  const project = selectProject(store);

  const toolStrokeColor = store.ui.toolOptions.strokeColor;
  const toolSize = store.ui.toolOptions.size;

  return (
    <Ribbon selectedTabID={ribbonTab} onClickTab={(id) => dispatch(setRibbonTab(id))}>
      <RibbonTab id="file" label="File">
        <RibbonButton icon="📄" label="New" onClick={() => dispatch(newDocument())} disabled={!!project} />
        <RibbonButton icon="📂" label="Open" />
        <RibbonButton icon="💾" label="Save" disabled={!project} />
        <RibbonDivider />
        <RibbonButton icon="➕" label="New Layer" onClick={() => store.project && dispatch(newLayer(getNextLayerID(store.project)))} disabled={!project} />
        <RibbonButton icon="❎" label="New Composite Layer" onClick={() => store.project && dispatch(newLayer(getNextLayerID(store.project)))} disabled={!project} />
        <RibbonDivider />
        <RibbonButton icon="🪄" label="New Composition" onClick={() => dispatch(newComposition())} disabled={!project} />
      </RibbonTab>
      <RibbonTab id="layer" label="Layer">

      </RibbonTab>
      {
        store.ui.tool === "pencil" &&
        <RibbonTab id="pencil" label="Pencil">
          <label className="text-center">
            Thickness<br/>
              <input type="number" className="border w-24 text-right" min={1} value={toolSize} onChange={e => dispatch(setToolSize(e.target.valueAsNumber))} />
          </label>
          <RibbonDivider />
            <label className="text-center">
              Pencil Colour <br />
              <input type="color" className="size-14" value={toolStrokeColor} onChange={e => dispatch(setToolStrokeColor(e.target.value))} />
            </label>
        </RibbonTab>
      }
      { store.ui.tool === "shapes" && <RibbonTab id="shapes" label="Shapes"><ShapeTab /></RibbonTab> }
    </Ribbon>
  )
}