import { useContext } from "react";
import { Ribbon } from "../Widgets/Ribbon";
import { RibbonButton } from "../Widgets/RibbonButton";
import { RibbonDivider } from "../Widgets/RibbonDivider";
import { StoreContext, DispatchContext } from "../Store/context";
import { newComposition, newDocument, newLayer } from "../Store/project/actions";
import { RibbonTab } from "../Widgets/RibbonTab";
import { selectProject } from "../Store/project/selectors";
import { setRibbonTab, setShape, setToolColor, setToolSize } from "../Store/ui/actions";
import { getNextLayerID } from "../util/project";

export function AppRibbon () {
  const store = useContext(StoreContext);
  const dispatch = useContext(DispatchContext);

  const ribbonTab = store.ui.ribbon.seletedTabID;

  const project = selectProject(store);

  const toolColor = store.ui.toolOptions.color;
  const toolSize = store.ui.toolOptions.size;
  const toolShape = store.ui.toolOptions.shape;

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
          <label>
            Thickness<br/>
              <input type="number" min={1} value={toolSize} onChange={e => dispatch(setToolSize(e.target.valueAsNumber))} className="border w-24" />
          </label>
          <RibbonDivider />
            <label>
              Pencil Colour <br />
              <input type="color" value={toolColor} onChange={e => dispatch(setToolColor(e.target.value))} />
            </label>
        </RibbonTab>
      }
      {
        store.ui.tool === "shapes" &&
        <RibbonTab id="shapes" label="Shapes">
          <label>
            Shape<br/>
              <select value={toolShape} onChange={e => dispatch(setShape(e.target.value as "circle" | "rectangle" | "triangle"))}>
                <option value="circle">Circle</option>
                <option value="rectangle">Rectangle</option>
                <option value="triangle">Triangle</option>
            </select>
          </label>
          <RibbonDivider />
          <label>
            Fill Colour<br/>
            <input type="color" value={toolColor} onChange={e => dispatch(setToolColor(e.target.value))} />
          </label>
        </RibbonTab>
      }
    </Ribbon>
  )
}