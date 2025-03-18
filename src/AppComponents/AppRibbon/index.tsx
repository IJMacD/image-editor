import { useContext } from "react";
import { Ribbon } from "../../Widgets/Ribbon";
import { RibbonButton } from "../../Widgets/RibbonButton";
import { RibbonDivider } from "../../Widgets/RibbonDivider";
import { StoreContext, DispatchContext } from "../../Store/context";
import { newComposition, newDocument, newLayer } from "../../Store/project/actions";
import { RibbonTab } from "../../Widgets/RibbonTab";
import { selectProject } from "../../Store/project/selectors";
import { setRibbonTab, setToolOptions, setToolSize } from "../../Store/ui/actions";
import { getNextLayerID } from "../../util/project";
import { ShapeTab } from "./ShapeTab";
import { RibbonColorPicker } from "../../Widgets/RibbonColorPicker";
import { FillStrokeControls } from "./common";

export function AppRibbon () {
  const store = useContext(StoreContext);
  const dispatch = useContext(DispatchContext);

  const ribbonTab = store.ui.ribbon.selectedTabID;

  const project = selectProject(store);

  const toolFillColor = store.ui.toolOptions.color;
  const toolFillAlpha = store.ui.toolOptions.fillAlpha;
  const toolStrokeColor = store.ui.toolOptions.strokeColor;
  const toolStrokeAlpha = store.ui.toolOptions.strokeAlpha;
  const toolLineCap = store.ui.toolOptions.lineCap;

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
          <StrokeThickness />
          <RibbonDivider />
          <RibbonColorPicker label="Pencil Colour" value={toolStrokeColor} onChange={(strokeColor, strokeAlpha) => dispatch(setToolOptions({ strokeColor, strokeAlpha }))} alpha={toolStrokeAlpha} />
        </RibbonTab>
      }
      {store.ui.tool === "shapes" && <RibbonTab id="shapes" label="Shapes"><ShapeTab /></RibbonTab>}
      {
        store.ui.tool === "line" &&
        <RibbonTab id="line" label="Line">
          <FillStrokeControls />
          <RibbonDivider />
            <label className="text-center">
              Line Cap<br />
              <select value={toolLineCap} onChange={e => dispatch(setToolOptions({ lineCap: e.target.value as CanvasLineCap }))}>
                <option value="butt">Butt</option>
                <option value="square">Square</option>
                <option value="round">Round</option>
              </select>
            </label>
        </RibbonTab>
      }
      {
        store.ui.tool === "fill" &&
        <RibbonTab id="fill" label="Fill">
          <RibbonColorPicker label="Fill Colour" value={toolFillColor} onChange={(color, fillAlpha) => dispatch(setToolOptions({ color, fillAlpha }))} alpha={toolFillAlpha} />
          <RibbonDivider />
        </RibbonTab>
      }
    </Ribbon>
  )
}

function StrokeThickness() {
  const store = useContext(StoreContext)
  const dispatch = useContext(DispatchContext);

  const toolSize = store.ui.toolOptions.size;

  return (
    <label className="text-center">
      Thickness<br />
      <input type="number" className="border w-24 text-right" min={1} value={toolSize} onChange={e => dispatch(setToolSize(e.target.valueAsNumber))} />
    </label>
  );
}