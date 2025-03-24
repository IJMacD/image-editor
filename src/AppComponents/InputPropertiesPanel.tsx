import { KeyboardEvent, useEffect, useState } from "react";
import { InputProperties } from "../types";

export function InputPropertiesPanel ({ input, onEdit }: { input: InputProperties, onEdit: (properties: Partial<InputProperties>) => void }) {
    const [sxText, setSxText] = useState(() => {
        const { a = 0, b = 0 } = input.transform;
        const sx = Math.sqrt(a * a + b * b);
        return nicerIEEE754(sx);
    });
    const [syText, setSyText] = useState(() => {
        const { c = 0, d = 0 } = input.transform;
        const sy = Math.sqrt(c * c + d * d);
        return nicerIEEE754(sy);
    });
    const [rotationText, setRotationText] = useState(() => {
        const { a = 0, b = 0 } = input.transform;
        const sx = Math.sqrt(a * a + b * b);
        const rotation = Math.acos((input.transform.a||1)/sx) / Math.PI * 180;
        return nicerIEEE754(rotation);
    });

    useEffect(() => {
        const sx = parseFloat(sxText);
        const sy = parseFloat(syText);
        const rotation = parseFloat(rotationText) / 180 * Math.PI;

        if (isNaN(sx) || isNaN(sy) || isNaN(rotation)) {
            return;
        }

        const transform = DOMMatrix.fromMatrix(input.transform);
        transform.a = sx * Math.cos(rotation);
        transform.b = sx * Math.sin(rotation);
        transform.c = sy * -Math.sin(rotation);
        transform.d = sy * Math.cos(rotation);

        onEdit({ transform })

    }, [sxText, syText, rotationText]);


    function handleEditX (x: number) {
        const transform = DOMMatrix.fromMatrix(input.transform);
        transform.e = x;
        onEdit({ transform })
    }

    function handleEditY (y: number) {
        const transform = DOMMatrix.fromMatrix(input.transform);
        transform.f = y;
        onEdit({ transform })
    }

    function handleScaleXKeyDown (e: KeyboardEvent) {
        if (e.code === "ArrowUp") {
            setSxText(value => (parseFloat(value) + 0.1).toFixed(1))
        }
        else if (e.code === "ArrowDown") {
            setSxText(value => (parseFloat(value) - 0.1).toFixed(1))
        }
    }

    function handleScaleYKeyDown (e: KeyboardEvent) {
        if (e.code === "ArrowUp") {
            setSyText(value => (parseFloat(value) + 0.1).toFixed(1))
        }
        else if (e.code === "ArrowDown") {
            setSyText(value => (parseFloat(value) - 0.1).toFixed(1))
        }
    }

    function handleRotationKeyDown (e: KeyboardEvent) {
        if (e.code === "ArrowUp") {
            setRotationText(value => nicerIEEE754(parseFloat(value) + 1))
        }
        else if (e.code === "ArrowDown") {
            setRotationText(value => nicerIEEE754(parseFloat(value) - 1))
        }
    }

    return (
        <div className="flex flex-col p-2">
            <div>
                <label className="m-1">x = <input type="number" value={input.transform.e||0} onChange={e => handleEditX(e.target.valueAsNumber)} className="w-16 border-1 rounded border-gray-300 text-right" /></label>
                <label className="m-1">sx = <input value={sxText} onChange={e => setSxText(e.target.value)} className="w-16 border-1 rounded border-gray-300 text-right pr-2"  onKeyDown={handleScaleXKeyDown} /></label>
            </div>
            <div>
                <label className="m-1">y = <input type="number" value={input.transform.f||0} onChange={e => handleEditY(e.target.valueAsNumber)} className="w-16 border-1 rounded border-gray-300 text-right" /></label>
                <label className="m-1">sy = <input value={syText} onChange={e => setSyText(e.target.value)} className="w-16 border-1 rounded border-gray-300 text-right pr-2"  onKeyDown={handleScaleYKeyDown} /></label>
            </div>
            <label className="m-1">rotation = <input value={rotationText} onChange={e => setRotationText(e.target.value)} className="w-16 border-1 rounded border-gray-300 text-right pr-2" onKeyDown={handleRotationKeyDown} /></label>
            <label className="m-1">filter = <input value={input.filter} onChange={e => onEdit({ filter: e.target.value })} className="w-40 px-1" /></label>
            <label className="m-1"><input type="checkbox" checked={input.enabled} onChange={e => onEdit({ enabled: e.target.checked })} /> Visible</label>
        </div>
    );
}

function nicerIEEE754 (n: number) {
    const re = /00000\d+|99999\d+/
    return n.toString().replace(re, "").replace(/\.$/, "");
}