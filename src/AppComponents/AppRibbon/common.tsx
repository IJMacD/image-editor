import { useContext } from "react";
import { RibbonColorPicker } from "../../Widgets/RibbonColorPicker";
import { DispatchContext, StoreContext } from "../../Store/context";
import { setFillStroke, setToolOptions, setToolSize } from "../../Store/ui/actions";

export function FillStrokeControls() {
    const store = useContext(StoreContext);
    const dispatch = useContext(DispatchContext);

    const toolSize = store.ui.toolOptions.size;
    const toolFillColor = store.ui.toolOptions.color;
    const toolFillAlpha = store.ui.toolOptions.fillAlpha;
    const toolStrokeColor = store.ui.toolOptions.strokeColor;
    const toolStrokeAlpha = store.ui.toolOptions.strokeAlpha;
    const isFill = ["fill", "both"].includes(store.ui.toolOptions.fillStroke)
    const isStroke = ["stroke", "both"].includes(store.ui.toolOptions.fillStroke)

    function handleFillStrokeChange(fillStroke: "fill" | "stroke", checked: boolean) {
        const value = {
            fill: isFill,
            stroke: isStroke,
        };
        value[fillStroke] = checked;

        if (value.fill && value.stroke) {
            dispatch(setFillStroke("both"));
        }
        else if (value.fill) {
            dispatch(setFillStroke("fill"))
        }
        else if (value.stroke) {
            dispatch(setFillStroke("stroke"))
        }
        else {
            dispatch(setFillStroke(fillStroke === "fill" ? "stroke" : "fill"))
        }
    }

    function handleSwapColours() {
        dispatch(setToolOptions({
            color: toolStrokeColor,
            strokeColor: toolFillColor,
            fillAlpha: toolStrokeAlpha,
            strokeAlpha: toolFillAlpha,
        }));
    }

    return (
        <>
            <div className="flex flex-col">
                <label>
                    <input type="checkbox" className="mr-2" checked={isFill} onChange={(e) => handleFillStrokeChange("fill", e.target.checked)} />
                    Fill
                </label>
                <label>
                    <input type="checkbox" className="mr-2" checked={isStroke} onChange={(e) => handleFillStrokeChange("stroke", e.target.checked)} />
                    Stroke
                </label>
                <button className="rounded border-1 border-gray-400 bg-gray-200 hover:bg-gray-300 cursor-pointer" onClick={handleSwapColours}>Swap</button>
            </div>
            <RibbonColorPicker label="Fill Colour" value={toolFillColor} onChange={(color, fillAlpha) => dispatch(setToolOptions({ color, fillAlpha }))} alpha={toolFillAlpha} />
            <RibbonColorPicker label="Stroke Colour" value={toolStrokeColor} onChange={(strokeColor, strokeAlpha) => dispatch(setToolOptions({strokeColor, strokeAlpha}))} alpha={toolStrokeAlpha} />
            <label className="text-center mx-2">
                Thickness<br />
                <input type="number" className="border w-24 text-right" min={1} value={toolSize} onChange={e => dispatch(setToolSize(e.target.valueAsNumber))} />
            </label>
        </>
    );
}