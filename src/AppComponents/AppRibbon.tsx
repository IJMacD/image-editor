import { useContext } from "react";
import { Ribbon } from "../Widgets/Ribbon";
import { RibbonButton } from "../Widgets/RibbonButton";
import { RibbonDivider } from "../Widgets/RibbonDivider";
import { StoreContext, DispatchContext } from "../Store/context";
import { newComposition, newDocument, newLayer } from "../Store/project/actions";
import { RibbonTab } from "../Widgets/RibbonTab";
import { selectProject } from "../Store/project/selectors";
import { setToolColor, setToolWidth } from "../Store/ui/actions";

export function AppRibbon () {
  const store = useContext(StoreContext);
  const dispatch = useContext(DispatchContext);

  const project = selectProject(store);

  const toolColor = store.ui.toolOptions.color;
  const toolWidth = store.ui.toolOptions.width;

  return (
    <Ribbon>
      <RibbonTab id="file" label="File">
        <RibbonButton icon="🗋" label="New" onClick={() => dispatch(newDocument())} disabled={!!project} />
        <RibbonButton icon="📂" label="Open" />
        <RibbonButton icon="💾" label="Save" disabled={!project} />
        <RibbonDivider />
        <RibbonButton icon="➕" label="New Layer" onClick={() => dispatch(newLayer())} disabled={!project} />
        <RibbonButton icon="❎" label="New Composite Layer" onClick={() => dispatch(newLayer())} disabled={!project} />
        <RibbonDivider />
        <RibbonButton icon="🪄" label="New Composition" onClick={() => dispatch(newComposition())} disabled={!project} />
      </RibbonTab>
      <RibbonTab id="pencil" label="Pencil">
        <label>
          Thickness<br/>
          <input type="number" min={1} value={toolWidth} onChange={e => dispatch(setToolWidth(e.target.valueAsNumber))} />
        </label>
        <RibbonDivider />
        <input type="color" value={toolColor} onChange={e => dispatch(setToolColor(e.target.value))} />
      </RibbonTab>
    </Ribbon>
  )
}