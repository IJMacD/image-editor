import { InputProperties } from "../types";

export function InputPropertiesPanel ({ input, onEdit }: { input: InputProperties, onEdit: (properties: Partial<InputProperties>) => void }) {
    function handleEditX (x: number) {
        const transform = DOMMatrix.fromMatrix(input.transform);
        transform.e = x;
    }

    function handleEditY (y: number) {
        const transform = DOMMatrix.fromMatrix(input.transform);
        transform.f = y;
    }

    return (
        <div className="flex flex-col p-2">
            <label className="m-1">x = <input type="number" value={input.transform.e||0} onChange={e => handleEditX(e.target.valueAsNumber)} className="w-16 border-1 rounded border-gray-300 text-right" /></label>
            <label className="m-1">y = <input type="number" value={input.transform.f||0} onChange={e => handleEditY(e.target.valueAsNumber)} className="w-16 border-1 rounded border-gray-300 text-right" /></label>
            <label className="m-1">filter = <input value={input.filter} onChange={e => onEdit({ filter: e.target.value })} className="w-40 px-1" /></label>
            <label className="m-1"><input type="checkbox" checked={input.enabled} onChange={e => onEdit({ enabled: e.target.checked })} /> Visible</label>
        </div>
    );
}