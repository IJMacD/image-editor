import { useContext } from "react";
import { Ribbon } from "../../Widgets/Ribbon";
import { RibbonButton } from "../../Widgets/RibbonButton";
import { RibbonDivider } from "../../Widgets/RibbonDivider";
import { StoreContext, DispatchContext } from "../../Store/context";
import { newBaseLayer, newCompositeLayer, newComposition, newDocument, newLayer } from "../../Store/project/actions";
import { RibbonTab } from "../../Widgets/RibbonTab";
import { selectProject } from "../../Store/project/selectors";
import { setRibbonTab, setToolFeather, setToolOptions, setToolSize } from "../../Store/ui/actions";
import { getNextLayerID, isBaseLayer } from "../../util/project";
import { ShapeTab } from "./ShapeTab";
import { RibbonColorPicker } from "../../Widgets/RibbonColorPicker";
import { FillStrokeControls } from "./common";
import { LayerTab } from "./LayerTab";
import { selectNearestParent, selectSelectedInputLayer } from "../../Store/selectors";

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

  const isActiveLayerABaseLayer = isBaseLayer(selectSelectedInputLayer(store))

  function handleImportImage () {
    const input = document.createElement("input");
    input.type = "file";
    input.style = "position: absolute; top: 0; visibility: hidden";
    input.addEventListener("change", () => {
      const file = input.files?.[0];
      if (file) {
        const img = document.createElement("img");
        img.addEventListener("load", () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0);
          const action = newLayer(store, { canvas });
          if (action) {
            dispatch(action)
          }
        });
        img.src = URL.createObjectURL(file);
      }
    });
    document.body.append(input);
    input.click();
    input.remove();
  }

  return (
    <Ribbon selectedTabID={ribbonTab} onClickTab={(id) => dispatch(setRibbonTab(id))}>
      <RibbonTab id="file" label="File">
        <RibbonButton icon="📄" label="New" onClick={() => dispatch(newDocument())} disabled={!!project} />
        <RibbonButton icon="📂" label="Open" />
        <RibbonButton icon="💾" label="Save" disabled={!project} />
        <RibbonButton icon="📷" label="Import" disabled={!project} onClick={() => handleImportImage()} />
        <RibbonButton icon="🖼️" label="Export" disabled={!project} />
        <RibbonDivider />
        <RibbonButton icon="*️⃣" label="New Layer" onClick={() => {
          const parent = selectNearestParent(store);
          if (store.project && typeof parent === "number") {
            dispatch(newBaseLayer(getNextLayerID(store.project), parent))
          }
        }} disabled={!project} />
        <RibbonButton icon="✳️" label="New Composite" onClick={() => {
          const parent = selectNearestParent(store);
          if (store.project && typeof parent === "number") {
            dispatch(newCompositeLayer(getNextLayerID(store.project), parent));
          }
        }} disabled={!project} />
        <RibbonDivider />
        <RibbonButton icon="🪄" label="New Composition" onClick={() => dispatch(newComposition())} disabled={!project} />
      </RibbonTab>
      {
        isActiveLayerABaseLayer &&
        <>
          <RibbonTab id="layer" label="Layer">
            <LayerTab />
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
            store.ui.tool === "eraser" &&
            <RibbonTab id="eraser" label="Eraser">
              <StrokeThickness />
              <FeatherSize />
            </RibbonTab>
          }
          {
            store.ui.tool === "fill" &&
            <RibbonTab id="fill" label="Fill">
              <RibbonColorPicker label="Fill Colour" value={toolFillColor} onChange={(color, fillAlpha) => dispatch(setToolOptions({ color, fillAlpha }))} alpha={toolFillAlpha} />
              <RibbonDivider />
            </RibbonTab>
          }
        </>
      }
    </Ribbon>
  )
}

function StrokeThickness() {
  const store = useContext(StoreContext)
  const dispatch = useContext(DispatchContext);

  const toolSize = store.ui.toolOptions.size;

  return (
    <label className="text-center mx-2">
      Thickness<br />
      <input type="number" className="border w-24 text-right" min={1} value={toolSize} onChange={e => dispatch(setToolSize(e.target.valueAsNumber))} />
    </label>
  );
}

function FeatherSize() {
  const store = useContext(StoreContext)
  const dispatch = useContext(DispatchContext);

  const toolFeather = store.ui.toolOptions.feather;

  return (
    <label className="text-center mx-2">
      Feather<br />
      <input type="number" className="border w-24 text-right" min={0} value={toolFeather} onChange={e => dispatch(setToolFeather(e.target.valueAsNumber))} />
    </label>
  );
}