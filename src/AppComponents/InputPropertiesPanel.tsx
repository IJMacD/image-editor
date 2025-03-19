import { InputProperties } from "../types";

export function InputPropertiesPanel ({ input, onEdit }: { input: InputProperties, onEdit: (properties: Partial<InputProperties>) => void }) {

    return (
        <div className="flex flex-col p-2">
            <label className="m-1">x = <input type="number" value={input.x} onChange={e => onEdit({ x: e.target.valueAsNumber })} className="w-16 border-1 rounded border-gray-300 text-right" /></label>
            <label className="m-1">y = <input type="number" value={input.y} onChange={e => onEdit({ y: e.target.valueAsNumber })} className="w-16 border-1 rounded border-gray-300 text-right" /></label>
            <label className="m-1"><input type="checkbox" checked={input.enabled} onChange={e => onEdit({ enabled: e.target.checked })} /> Visible</label>
        </div>
    );
}