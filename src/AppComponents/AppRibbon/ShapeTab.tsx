import { useContext } from "react";
import { DispatchContext, StoreContext } from "../../Store/context";
import { setFillStroke, setShape, setToolColor, setToolSize, setToolStrokeColor } from "../../Store/ui/actions";
import { RibbonDivider } from "../../Widgets/RibbonDivider";

export function ShapeTab () {
    const store = useContext(StoreContext);
    const dispatch = useContext(DispatchContext);

    const toolShape = store.ui.toolOptions.shape;
    const toolSize = store.ui.toolOptions.size;
    const toolFillColor = store.ui.toolOptions.color;
    const toolStrokeColor = store.ui.toolOptions.strokeColor;
    const isFill = ["fill","both"].includes(store.ui.toolOptions.fillStroke)
    const isStroke = ["stroke","both"].includes(store.ui.toolOptions.fillStroke)

    function handleFillStrokeChange(fillStroke: "fill"|"stroke", checked: boolean) {
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

    function handleSwapColours () {
        dispatch(setToolColor(toolStrokeColor));
        dispatch(setToolStrokeColor(toolFillColor));
    }

    return (
        <>
            <label>
                Shape<br/>
                <select value={toolShape} onChange={e => dispatch(setShape(e.target.value as "circle" | "rectangle" | "triangle"))}>
                    <option value="circle">Circle</option>
                    <option value="rectangle">Rectangle</option>
                    <option value="triangle">Triangle</option>
                </select>
            </label>
            <RibbonDivider />
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
            <label className="text-center mx-2">
                Fill Colour<br/>
                <input type="color" className="size-14" value={toolFillColor} onChange={e => dispatch(setToolColor(e.target.value))} />
            </label>
            <label className="text-center mx-2">
                Stroke Colour<br/>
                <input type="color" className="size-14" value={toolStrokeColor} onChange={e => dispatch(setToolStrokeColor(e.target.value))} />
            </label>
            <label className="text-center mx-2">
                Thickness<br/>
                <input type="number" className="border w-24 text-right" min={1} value={toolSize} onChange={e => dispatch(setToolSize(e.target.valueAsNumber))} />
            </label>
        </>
    );
}