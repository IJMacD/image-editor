import { useContext } from "react";
import { DispatchContext, StoreContext } from "../../Store/context";
import { setShape } from "../../Store/ui/actions";
import { RibbonDivider } from "../../Widgets/RibbonDivider";
import { FillStrokeControls } from "./common";

export function ShapeTab () {
    const store = useContext(StoreContext);
    const dispatch = useContext(DispatchContext);

    const toolShape = store.ui.toolOptions.shape;

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
            <FillStrokeControls />
        </>
    );
}