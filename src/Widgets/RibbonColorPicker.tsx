export function RibbonColorPicker({ value, alpha, onChange, label }: { value: string, alpha: number, onChange: (value: string, alpha: number) => void, label: string }) {

    return (
        <label className="text-center mx-2">
            {label}<br />
            <input type="color" className="size-14" value={value} onChange={e => onChange(e.target.value, alpha)} style={{opacity: alpha}} />
            <input type="range" value={alpha} min={0} max={1} step={1/256} onChange={e => onChange(value, e.target.valueAsNumber)} className="h-14" style={{writingMode: "vertical-lr", transform: "rotate(180deg)"}} />
        </label>
    )
}