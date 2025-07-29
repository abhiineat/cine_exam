"use client";

import { Dispatch, SetStateAction } from "react";
import { useExamStore } from "@/stores/examstore";

export default function QuestionNavigator({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const questions = useExamStore((s) => s.questions);
  const selectedSubject = useExamStore((s) => s.selectedSubject);
  const activeQuestion = useExamStore((s) => s.activeQuestion);
  const setActiveQuestion = useExamStore((s) => s.setActiveQuestion);

  const questionList = questions[selectedSubject] || [];

  const questionButtons = (
    <div className="flex flex-wrap gap-3 items-center py-4 px-2">
      {questionList.map((question, i) => {
        const isActive = activeQuestion === i + 1;

        // Determine background based on status
        let bgColor = "text-gray-300 border border-gray-500"; // default

        console.log("Question status:", question.status, "Active:", isActive, "Index:", i+1);

        console.log(typeof question.status, question.status);
        if (!isActive) {
          switch (Number(question.status)) {
              case 0:
                  console.log("Question is not answered:", question._id);
                  bgColor = "bg-red-600 text-white border border-red-500";
                  break;
              case 1:
                  bgColor = "bg-green-600 text-white border border-green-500";
                  break;
              case 2:
                  bgColor = "bg-purple-600 text-white border border-purple-500";
                  break;
          }
        }

        if (isActive) {
          bgColor = "bg-blue-500 text-white shadow-md";
        }

        return (
          <button
            key={i}
            onClick={() => {
              setActiveQuestion(i + 1);
              // setOpen(false);
            }}
            className={`w-10 h-10 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full text-sm font-semibold 
              transition-all cursor-pointer flex items-center justify-center md:mb-4 md:my-2
              ${bgColor}`}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm flex justify-end md:justify-center items-center p-2"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <div className="w-[90%] max-w-sm h-full md:h-auto md:max-w-md bg-neutral-900 border border-white/10 p-5 flex flex-col rounded-none md:rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-semibold text-lg">Questions</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-white text-xl hover:scale-110 transition"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{questionButtons}</div>
          </div>
        </div>
      )}
    </>
  );
}
