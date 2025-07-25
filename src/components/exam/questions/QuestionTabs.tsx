"use client";
import { useState } from "react";

export default function QuestionTabs() {
  const tabs = ["Description", "Code"];
  const [active, setActive] = useState("Description");

  return (
    <div className="relative h-12 text-lg flex items-center rounded-md bg-neutral-800/50 border border-white/10 backdrop-blur-md shadow-inner overflow-hidden">
      <div
        className="absolute my-auto top-0 bottom-0 rounded-md bg-white/10 backdrop-blur-xl transition-transform duration-300 ease-in-out will-change-transform"
        style={{
          width: `${100 / tabs.length}%`,
          transform: `translateX(${tabs.indexOf(active) * 100}%)`,
        }}
      />
      {tabs.map((label) => (
        <button
          key={label}
          onClick={() => setActive(label)}
          className={`flex-1 py-5 cursor-pointer text-sm font-medium z-10 transition-all duration-300 ${
            active === label ? "text-white" : "text-neutral-400"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
