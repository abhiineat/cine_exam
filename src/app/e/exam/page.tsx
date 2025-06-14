"use client";

import { useState } from "react";
import BackgroundGridPattern from "@/components/ui/BackgroundGridPattern";
import Header from "@/components/exam/Header";
import Navbar from "@/components/exam/Navbar";
import QuestionNavigator from "@/components/exam/questions/QuestionNavigator";
import Questions from "@/components/exam/questions/Questions";

export default function ExamPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="relative h-screen bg-[#0a0a0a] text-white p-4 overflow-y-auto">
      <BackgroundGridPattern />

      <div className="h-full overflow-y-auto">
        <Header />
        <Navbar />

        <div className="w-full mx-auto mt-6 flex flex-col lg:flex-row gap-6">
          <Questions />
          <QuestionNavigator open={drawerOpen} setOpen={setDrawerOpen} />
        </div>
      </div>

      {/* Floating drawer toggle button (mobile only) */}
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          className="w-12 h-12 rounded-full bg-white/10 border border-white/10 text-white
          flex items-center justify-center shadow-md hover:bg-white/20 transition-all"
          aria-label="Open question navigator"
        >
          🧭
        </button>
      </div>
    </div>
  );
}
