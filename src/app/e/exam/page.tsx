"use client";

import { useState } from "react";
import BackgroundGridPattern from "@/components/ui/BackgroundGridPattern";
import Header from "@/components/exam/Header";
import Navbar from "@/components/exam/Navbar";
import QuestionNavigator from "@/components/exam/questions/QuestionNavigator";
import Questions from "@/components/exam/questions/Questions";

export default function ExamPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(1);

  return (
    <div className="relative h-screen bg-[#0a0a0a] text-white p-4 overflow-y-auto">
      <BackgroundGridPattern />

      <div className="h-full overflow-y-auto">
        <Header />
        <Navbar onOpenQuestions={() => setDrawerOpen(true)} />

        <QuestionNavigator
          open={drawerOpen}
          setOpen={setDrawerOpen}
          activeQuestion={activeQuestion}
          onQuestionClick={(i) => setActiveQuestion(i)}
        />
      </div>
    </div>
  );
}
