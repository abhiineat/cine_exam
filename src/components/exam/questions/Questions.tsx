"use client";

import { useExamStore } from "@/stores/examstore";
import QuestionPreview from "@/components/exam/questions/QuestionPreview";
import ActionButtons from "@/components/exam/questions/ActionButtons";
import OptionsList from "@/components/exam/questions/OptionsList";
import { Question } from "@/stores/examstore";
import NavigationButtons from "@/components/exam/questions/NavigationButton";

export default function Questions() {
  const { questions, selectedSubject, activeQuestion } = useExamStore();

  const subjectQuestions = questions[selectedSubject] || [];
  const question: Question | undefined = subjectQuestions[activeQuestion - 1];

  return (
    <section
      className="mt-5 lg:h-[65vh] rounded-lg
      bg-neutral-900 backdrop-blur-[6px] border border-white/10
      shadow-inner shadow-black/20 flex flex-col md:flex-row gap-4 p-4"
    >
      {/* Left Column */}
      <div className="flex flex-col w-full md:w-1/2 gap-4 flex-1">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {question ? (
            <QuestionPreview
              key={`${selectedSubject}-${activeQuestion}`}
              question={question.question}
              code={question?.code || ""}
              codeLang={question?.codeLang || "plaintext"}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-white/70 border border-white/10 rounded-2xl bg-white/5">
              No question available
            </div>
          )}  
        </div>
        <NavigationButtons />
      </div>

      {/* Separator */}
      <div className="hidden md:block w-[1px] bg-white/30 rounded-full" />

      {/* Right Column */}
      <div className="flex flex-col w-full md:w-1/2 gap-4 flex-1">
        <div className="flex-1 overflow-hidden">
        <OptionsList
  options={question?.options || []}
  quesId={question?._id}
  status={question?.status ?? 0}
  ansId={question?.ansId}
/>
        </div>
        <ActionButtons
  quesId={question?._id}
  status={question?.status ?? 0}
  ansId={question?.ansId}
/>
      </div>
    </section>
  );
}