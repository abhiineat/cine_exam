"use client";

import { useState } from "react";

export default function Navbar() {
  const [activeTab, setActiveTab] = useState("HTML");

  const tabs = ["HTML", "SQL", "CSS", "Aptitude", "Java"];

  return (
    <nav
      className="w-[98%] mt-5 mx-auto px-6 py-3 rounded-full 
        flex justify-center gap-5
        backdrop-blur-[6px] bg-neutral-800/50 border border-neutral-800"
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-5 py-2 w-40 rounded-full text-sm font-medium uppercase tracking-wide
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

