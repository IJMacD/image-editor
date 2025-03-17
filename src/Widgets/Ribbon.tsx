import React, { useEffect, useState } from "react";
import { RibbonTab, RibbonTabProps } from "./RibbonTab";

export function Ribbon ({ children }: { children: React.ReactNode }) {
  const tabs = getTabs(children);
  const tabKeys = Object.keys(tabs);
  const firstTabKey = tabKeys[0];

  const [selectedTabID, setSelectedTabID] = useState(firstTabKey);

  const selectedTab = tabs[selectedTabID]?.element;

  const tabMode = tabKeys.length > 0;

  const tabAvailable = !!selectedTab;

  useEffect(() => {
    if (!tabAvailable && tabMode) {
      setSelectedTabID(firstTabKey);
    }
  }, [tabAvailable, tabMode, firstTabKey]);

  return (
    <div className="border-b-1 border-gray-300 shadow-lg z-1 flex flex-col select-none">
      { tabMode &&
        <ul className="pt-2 border-b-1 min-h-8 ">
          {
            Object.entries(tabs).map(([id,tab]) => (
              <li
                key={id}
                onClick={() => setSelectedTabID(id)}
                className={`${id === selectedTabID ? "border-b-white" : "  border-gray-200 border-b-gray-800 hover:bg-gray-100 hover:border-gray-600"} -mb-px active:bg-gray-200 transition bg-white cursor-pointer border-1 rounded-t px-4 mx-1 inline-block font-bold`}
              >
                {tab.label}
              </li>
            ))
          }
        </ul>
      }
      <div className="h-24 flex p-2">
        { tabMode ? selectedTab : children }
      </div>
    </div>
  )
}

function getTabs (children: React.ReactNode) {
  const tabs: Record<string, { label: string, element: React.ReactNode}> = {};

  React.Children.forEach(children, (child) => {
    if (typeof child === "object" && child) {
      const c = child as React.ReactElement;
      if (c.type === RibbonTab) {
        const { id, label } = c.props as RibbonTabProps;
        tabs[id] = { label, element: c};
      }
    }
  });

  return tabs;
}