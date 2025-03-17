import { useContext } from "react";
import { Ribbon } from "../Widgets/Ribbon";
import { RibbonButton } from "../Widgets/RibbonButton";
import { RibbonDivider } from "../Widgets/RibbonDivider";
import { StoreContext, DispatchContext } from "../Store/context";
import { newComposition, newDocument, newLayer } from "../Store/project/actions";
import { RibbonTab } from "../Widgets/RibbonTab";
import { selectProject } from "../Store/project/selectors";
import { setToolColor, setToolSize } from "../Store/ui/actions";

export function AppRibbon () {
  const store = useContext(StoreContext);
  const dispatch = useContext(DispatchContext);

  const project = selectProject(store);

  const toolColor = store.ui.toolOptions.color;
  const toolSize = store.ui.toolOptions.size;

  return (
    <Ribbon>
      <RibbonTab id="file" label="File">
        <RibbonButton icon="📄" label="New" onClick={() => dispatch(newDocument())} disabled={!!project} />
        <RibbonButton icon="📂" label="Open" />
        <RibbonButton icon="💾" label="Save" disabled={!project} />
        <RibbonDivider />
        <RibbonButton icon="➕" label="New Layer" onClick={() => dispatch(newLayer())} disabled={!project} />
        <RibbonButton icon="❎" label="New Composite Layer" onClick={() => dispatch(newLayer())} disabled={!project} />
        <RibbonDivider />
        <RibbonButton icon="🪄" label="New Composition" onClick={() => dispatch(newComposition())} disabled={!project} />
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
            <select>
              <option>Circle</option>
              <option>Square</option>
              <option>Triangle</option>
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