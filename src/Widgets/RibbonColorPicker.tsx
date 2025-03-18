export function RibbonColorPicker({ value, alpha, onChange, label }: { value: string, alpha: number, onChange: (value: string, alpha: number) => void, label: string }) {

    return (
        <label className="text-center mx-2">
            {label}<br />
            <input type="color" className="size-14" value={value} onChange={e => onChange(e.target.value, alpha)} />
        </label>
    )
}