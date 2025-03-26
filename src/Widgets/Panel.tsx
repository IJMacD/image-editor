
export function Panel ({ row = false, column = false, children = null }: { row?: boolean, column?: boolean, children?: React.ReactNode }) {
  if (row && column) {
    return <p className="text-red-500"><code>row</code> and <code>column</code> are mutually exclusive</p>;
  }

  return (
    <div className={`flex-1 flex ${row ? "flex-row" : "flex-col"} h-full overflow-hidden`}>
      { children }
    </div>
  )
}