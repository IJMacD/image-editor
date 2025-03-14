import { useContext } from "react";
import { Ribbon } from "../Widgets/Ribbon";
import { RibbonButton } from "../Widgets/RibbonButton";
import { RibbonDivider } from "../Widgets/RibbonDivider";
import { ProjectContext, ProjectDispatchContext } from "../Store/context";
import { newComposition, newDocument, newLayer } from "../Store/actions";

export function AppRibbon () {
  const project = useContext(ProjectContext);
  const dispatch = useContext(ProjectDispatchContext);

  return (
    <Ribbon>
      <RibbonButton icon="🗋" label="New" onClick={() => dispatch(newDocument())} disabled={!!project} />
      <RibbonButton icon="📂" label="Open" />
      <RibbonButton icon="💾" label="Save" disabled={!project} />
      <RibbonDivider />
      <RibbonButton icon="➕" label="New Layer" onClick={() => dispatch(newLayer())} disabled={!project} />
      <RibbonButton icon="❎" label="New Composite Layer" onClick={() => dispatch(newLayer())} disabled={!project} />
      <RibbonDivider />
      <RibbonButton icon="🪄" label="New Composition" onClick={() => dispatch(newComposition())} disabled={!project} />
    </Ribbon>
  )
}