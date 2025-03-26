import { useContext, useEffect, useRef } from "react"
import { DispatchContext, StoreContext } from "../Store/context"
import { selectSelectedInputLayer } from "../Store/selectors";
import { isBaseLayer } from "../util/project";
import { restoreCanvasHistory } from "../Store/project/actions";

export function HistoryExplorer({  }) {
    const store = useContext(StoreContext);
    const dispatch = useContext(DispatchContext);

    const selectedLayer = selectSelectedInputLayer(store);

    if (!isBaseLayer(selectedLayer)) {
        return;
    }

    return (
        <div className="flex flex-col bg-white overflow-y-auto">
            <b>History</b>
            {
                selectedLayer.history.canvases.map((canvas, i) => (
                    <div
                        key={selectedLayer.history.canvases.length - i}
                        className={`flex border-b-1 p-2 cursor-pointer ${selectedLayer.history.index === i ? "bg-gray-200": "hover:bg-gray-100"}`}
                        onClick={() => dispatch(restoreCanvasHistory(selectedLayer.id, i))}
                    >
                        <span style={{flex: 1}}>Item #{i}</span>
                        <LayerCanvas canvas={canvas} width={64} height={64} />
                    </div>
                ))
            }
        </div>
    )
}

function LayerCanvas ({ canvas, width, height }: { canvas: HTMLCanvasElement, width: number, height: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const ctx = canvasRef.current?.getContext("2d");

        if (!ctx) {
            return;
        }

        ctx.clearRect(0, 0, width, height);

        ctx.drawImage(canvas, 0, 0, width, height);

    }, [canvas, width, height])

    return <canvas width={width} height={height} ref={canvasRef} />
}