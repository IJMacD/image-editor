import React, { Children, useEffect, useRef, useState } from "react";

// k w

export function TabPanel({ labels = [], children = [], selectedIndex, onClickTab }: { labels?: string[], children: React.ReactNode | React.ReactNode[], selectedIndex?: number, onClickTab: (index: number) => void }) {
  const [localSelectedIndex, setLocalSelectedIndex] = useState(0);
  const tabsRef = useRef<HTMLUListElement>(null);

  const tabs = Children.toArray(children).flat().filter(x => x);

  const controlledMode = !!onClickTab;

  const currentIndex = (controlledMode ? selectedIndex : localSelectedIndex) || 0;

  const currentTab = tabs[currentIndex];

  function handleTabClick(index: number) {
    if (controlledMode) {
      onClickTab(index);
    }
    else {
      setLocalSelectedIndex(index);
    }
  }

  useEffect(() => {
    if (tabsRef.current) {
      const selectedTabElement = tabsRef.current.querySelector(".border-b-white") as HTMLElement | null;
      if (selectedTabElement) {
        selectedTabElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [currentIndex]);

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-y-auto">
        <ul className="pt-2 after:border-b-1 min-h-8 select-none w-fit min-w-full whitespace-nowrap after:inset-x-0 after:bottom-0 relative after:absolute z-1" ref={tabsRef}>
          {
            tabs.map((_, i) => (
              <li key={i} className={`inline-block ${i === currentIndex ? "relative z-1" : ""}`}>
                <button
                  onClick={() => handleTabClick(i)}
                  className={`${i === currentIndex ? "border-b-white" : "  border-gray-200 border-b-gray-800 hover:bg-gray-100 hover:border-gray-600"} active:bg-gray-200 transition bg-white cursor-pointer border-1 rounded-t px-4 mx-1 font-bold`}
                >
                  {labels[i] || `Tab ${i + 1}`}
                </button>
              </li>
            ))
          }
        </ul>
      </div>
      <div className="flex-1">
        {
          currentTab
        }
      </div>
    </div>
  )
}