"use client";
import { Dispatch, SetStateAction } from "react";

export default function QuestionNavigator({
  open,
  setOpen,
  activeQuestion,
  onQuestionClick,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  activeQuestion: number;
  onQuestionClick?: (index: number) => void;
}) {
  const questionButtons = (
    <div className="flex flex-wrap gap-3  items-center py-4 px-2">
      {Array.from({ length: 20 }, (_, i) => {
        const isActive = activeQuestion === i + 1;
        return (
          <button
            key={i + 1}
            onClick={() => onQuestionClick?.(i + 1)}
            className={`w-10 h-10 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full text-sm font-semibold 
              transition-all cursor-pointer flex items-center justify-center md:mb-4 md:my-2
              ${
                isActive
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-gray-300"
              }`}
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
