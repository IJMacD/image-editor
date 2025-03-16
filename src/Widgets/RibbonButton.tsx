export function RibbonButton ({ icon, label, onClick, disabled }: { icon: string, label: string, onClick?: (e: React.MouseEvent) => void, disabled?: boolean }) {
  let className = "size-20 text-center rounded border-1 border-transparent flex flex-col place-content-center select-none overflow-hidden "

  if (disabled) {
    className += "opacity-50"
  }
  else {
    className += "cursor-pointer hover:bg-gray-100 hover:border-gray-300";
  }

  return (
    <div
      className={className}
      onClick={disabled?undefined:onClick}
    >
      <i className="text-4xl">{icon}</i>
      <b>{label}</b>
    </div>
  )
}