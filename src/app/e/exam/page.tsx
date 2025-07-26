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
  const [loading, setLoading] = useState(true);

  const setQuestions = useExamStore((s) => s.setQuestions);
  const setSelectedSubject = useExamStore((s) => s.setSelectedSubject);
  const setActiveQuestion = useExamStore((s) => s.setActiveQuestion);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/questions");
        if (!res.ok) throw new Error("Failed to fetch questions");

        const data = await res.json();
        if (data.questions) {
          setQuestions(data.questions);

          const subjects = Object.keys(data.questions);
          if (subjects.length > 0) {
            setSelectedSubject(subjects[0]);
            setActiveQuestion(1);
          }
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [setQuestions, setSelectedSubject, setActiveQuestion]);

  return (
    <div className="relative h-screen bg-[#0a0a0a] text-white p-4 overflow-y-auto">
      <BackgroundGridPattern />
      <div className="h-full overflow-y-auto">
        <Header />
        <Navbar onOpenQuestions={() => setDrawerOpen(true)} />
        <QuestionNavigator open={drawerOpen} setOpen={setDrawerOpen} />
        <Questions />
      </div>
    </div>
  );
}
