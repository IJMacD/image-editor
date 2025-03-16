import React from "react";

export interface RibbonTabProps {
  children?: React.ReactNode;
  id: string;
  label: string;
}

export function RibbonTab ({ children }: RibbonTabProps) {
  return children;
}