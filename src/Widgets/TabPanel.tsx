import React, { Children, useState } from "react";

// k w

export function TabPanel ({ labels = [], children = [] }: { labels?: string[], children: React.ReactNode|React.ReactNode[] }) {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = Children.toArray(children).flat().filter(x => x);

  const currentTab = tabs[selectedTab];

  return (
    <div className="flex flex-col h-full">
      <ul className="pt-2 border-b-1 min-h-8 ">
        {
          tabs.map((_, i) => (
            <li
              key={i}
              onClick={() => setSelectedTab(i)}
              className={`${i === selectedTab ? "border-b-white" : "  border-gray-200 border-b-gray-800 hover:bg-gray-100 hover:border-gray-600"} -mb-px active:bg-gray-200 transition bg-white cursor-pointer border-1 rounded-t px-4 mx-1 inline-block font-bold`}
            >
              {labels[i] || `Tab ${i+1}`}
            </li>
          ))
        }
      </ul>
      <div className="flex-1">
        {
          currentTab
        }
      </div>
    </div>
  )
}