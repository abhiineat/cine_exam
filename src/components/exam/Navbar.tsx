"use client";

import { useState } from "react";

export default function Navbar() {
  const [activeTab, setActiveTab] = useState("HTML");

  const tabs = ["HTML", "SQL", "CSS", "Aptitude", "Java"];

  return (
    <nav
      className="w-full mt-5 mx-auto px-4 py-3 
      rounded-md sm:rounded-full
      flex justify-start sm:justify-center gap-3 sm:gap-5 
      overflow-x-auto scrollbar-thin scrollbar-thumb-white/20
      backdrop-blur-[6px] bg-neutral-800/50 border border-neutral-800"
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`flex-shrink-0 px-4 sm:px-5 py-2 text-xs sm:text-sm 
          min-w-[6rem] sm:min-w-[8rem]
          rounded-md sm:rounded-full
          font-medium uppercase tracking-wide
          backdrop-blur-sm border border-white/10 transition-all cursor-pointer
          ${
            activeTab === tab
              ? "bg-white/25 text-white shadow-md scale-105"
              : "bg-white/5 text-white hover:bg-white/10 hover:shadow-md hover:scale-105"
          }`}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}
