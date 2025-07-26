"use client";

import { useEffect, useState } from "react";
import BackgroundGridPattern from "@/components/ui/BackgroundGridPattern";
import Header from "@/components/exam/Header";
import Navbar from "@/components/exam/Navbar";
import QuestionNavigator from "@/components/exam/questions/QuestionNavigator";
import Questions from "@/components/exam/questions/Questions";
import QuestionsSkeleton from "@/components/exam/questions/QuestionsSkeleton";
import { Question, useExamStore } from "@/stores/examstore";

export default function ExamPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const setQuestions = useExamStore((s) => s.setQuestions);
  const setSelectedSubject = useExamStore((s) => s.setSelectedSubject);
  const setActiveQuestion = useExamStore((s) => s.setActiveQuestion);
  const setIsLoadingQuestions = useExamStore((s) => s.setIsLoadingQuestions);
  const isLoadingQuestions = useExamStore((s) => s.isLoadingQuestions);

  useEffect(() => {
    const fetchQuestionsAndResponses = async () => {
      setIsLoadingQuestions(true);

      try {
        // Fetch questions
        const qRes = await fetch("/api/questions");
        if (!qRes.ok) throw new Error("Failed to fetch questions");
        const qData = await qRes.json();

        // Set questions immediately
        const questions = qData.questions || {};
        setQuestions(questions);

        const rRes = await fetch("/api/response");
        if (!rRes.ok) throw new Error("Failed to fetch responses");
        const rData = await rRes.json();

        const responses = rData.responses || [];

        const updated: typeof questions = { ...questions };

        for (const subject in updated) {
          updated[subject] = updated[subject].map((q: Question) => {
            const match = responses.find((r: { quesId: string; ansId: number; status: number; }) => r.quesId === q._id);
            if (match) {
              return {
                ...q,
                ansId: match.ansId,
                status: match.status,
              };
            }
            return q;
          });
        }

        setQuestions(updated);

        const subjects = Object.keys(updated);
        if (subjects.length > 0) {
          setSelectedSubject(subjects[0]);
          setActiveQuestion(1);
        }
      } catch (err) {
        console.error("Failed to load exam data:", err);
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    fetchQuestionsAndResponses();
  }, [
    setQuestions,
    setSelectedSubject,
    setActiveQuestion,
    setIsLoadingQuestions,
  ]);

  return (
    <div className="relative h-screen bg-[#0a0a0a] text-white p-4 overflow-y-auto">
      <BackgroundGridPattern />
      <div className="h-full overflow-y-auto">
        <Header />
        <Navbar onOpenQuestions={() => setDrawerOpen(true)} />
        <QuestionNavigator open={drawerOpen} setOpen={setDrawerOpen} />
        {isLoadingQuestions ? <QuestionsSkeleton /> : <Questions />}
      </div>
    </div>
  );
}