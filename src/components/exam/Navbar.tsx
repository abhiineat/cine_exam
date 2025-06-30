"use client";
import { useState, useRef } from "react";

export default function Navbar({
  onOpenQuestions,
}: {
  onOpenQuestions: () => void;
}) {
  const [activeTab, setActiveTab] = useState("HTML");
  const tabs = ["HTML", "SQL", "CSS", "Aptitude", "Java"];

  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    // Scroll to tab if it's overflowing
    tabRefs.current[tab]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <nav
      className="w-full mt-5 mx-auto px-4 py-3
      rounded-md sm:rounded-full
      flex flex-wrap sm:flex-nowrap items-center justify-between gap-3
      backdrop-blur-[6px] bg-neutral-800/50 border border-neutral-800"
    >
      {/* Scrollable Tabs */}
      <div className="flex overflow-x-auto py-2 gap-3 sm:gap-5 flex-1 pr-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            ref={(el) => {
              tabRefs.current[tab] = el;
            }}
            onClick={() => handleTabClick(tab)}
            className={`flex-shrink-0 ml-1 sm:px-5 py-2 text-xs sm:text-sm 
            min-w-[6rem] sm:min-w-[8rem]
            rounded-md sm:rounded-full
            font-medium uppercase tracking-wide
            backdrop-blur-sm border border-white/10 transition-all cursor-pointer
            ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow-md scale-105"
                : "bg-white/5 text-white hover:bg-white/10 hover:shadow-md hover:scale-105"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Open Questions Button */}
      <button
        onClick={onOpenQuestions}
        className="px-4 py-2 text-sm font-medium text-white rounded-md sm:rounded-full 
        bg-green-900 hover:bg-blue-700 transition-all shrink-0"
      >
        Questions
      </button>
    </nav>
  );
}
