"use client";

import { useEffect, useState } from "react";
import BackgroundGridPattern from "@/components/ui/BackgroundGridPattern";
import Header from "@/components/exam/Header";
import Navbar from "@/components/exam/Navbar";
import QuestionNavigator from "@/components/exam/questions/QuestionNavigator";
import Questions from "@/components/exam/questions/Questions";
import { useExamStore } from "@/stores/examstore";

export default function ExamPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const setQuestions = useExamStore((s) => s.setQuestions);
  const questions = useExamStore((s) => s.questions);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/questions");
        if (!res.ok) throw new Error("Failed to fetch questions");
        const data = await res.json();
        setQuestions(data.questions);

        const subjects = Object.keys(data.questions);
        if (subjects.length) {
          setSelectedSubject(subjects[0]);
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [setQuestions, setSelectedSubject]);

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
          onQuestionClick={setActiveQuestion}
        />

        <Questions loading={loading} />
      </div>
    </div>
  );
}