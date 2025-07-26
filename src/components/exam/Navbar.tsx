"use client";

import { useRef } from "react";
import { useExamStore } from "@/stores/examstore";
import { List } from "lucide-react";

export default function Navbar({
  onOpenQuestions,
}: {
  onOpenQuestions: () => void;
}) {
  const selectedSubject = useExamStore((s) => s.selectedSubject);
  const setSelectedSubject = useExamStore((s) => s.setSelectedSubject);
  const setActiveQuestion = useExamStore((s) => s.setActiveQuestion);
  const questions = useExamStore((s) => s.questions);

  const subjects = Object.keys(questions);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const handleTabClick = (tab: string) => {
    if (tab !== selectedSubject) {
      setSelectedSubject(tab);
      setActiveQuestion(1);
    }

    tabRefs.current[tab]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <nav className="w-full mt-5 mx-auto px-4 py-3 rounded-xl sm:rounded-full flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 backdrop-blur-md bg-gradient-to-r from-neutral-800/80 via-neutral-900/70 to-neutral-800/80 border border-neutral-700 shadow-inner shadow-black/30 custom-scrollbar">
      {/* Scrollable Tabs */}
      <div className="flex overflow-x-auto py-2 gap-3 sm:gap-5 flex-1 pr-2 scrollbar-hide">
        {subjects.map((tab) => (
          <button
            key={tab}
            ref={(el) => {
              tabRefs.current[tab] = el;
            }}
            onClick={() => handleTabClick(tab)}
            className={`flex-shrink-0 ml-2 px-4 sm:px-6 py-2 text-sm sm:text-base min-w-[6rem] sm:min-w-[8rem] rounded-md sm:rounded-full font-semibold uppercase tracking-wide transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-500
        ${
          selectedSubject === tab
            ? "bg-blue-600 text-white scale-105"
            : "bg-neutral-700/40 text-white hover:bg-neutral-600/60 hover:shadow-md"
        }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Open Questions Button */}
      <button
        onClick={onOpenQuestions}
        className="flex items-center gap-2 px-4 py-2 text-sm sm:text-base font-medium text-white rounded-md sm:rounded-full 
  bg-neutral-700 hover:bg-neutral-600 transition-all duration-200 border border-white/10 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <List className="w-4 h-4" />
        Questions
      </button>
    </nav>
  );
}
