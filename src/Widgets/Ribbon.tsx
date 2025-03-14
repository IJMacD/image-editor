import React from "react";

export function Ribbon ({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-28 border-b-1 border-gray-300 shadow-lg z-1 flex p-4">
      { children }
    </div>
  )
}