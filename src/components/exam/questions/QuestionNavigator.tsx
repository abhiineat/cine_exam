"use client";
import { Dispatch, SetStateAction } from "react";

export default function QuestionNavigator({
  open,
  setOpen,
}: {
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) {
  const questionButtons = (
    <div className="grid grid-cols-5 sm:grid-cols-4 gap-2">
      {Array.from({ length: 20 }, (_, i) => (
        <button
          key={i + 1}
          className="w-8 h-8 sm:w-9 sm:h-9 md:w-12 md:h-12 rounded-full
          text-xs sm:text-sm font-medium text-gray-300 hover:scale-105 
          bg-white/10 backdrop-blur-xl transition-all cursor-pointer"
        >
          {i + 1}
        </button>
      ))}
    </div>
  );

  const submitButton = (
    <button
      disabled={false}
      className="w-full py-2 sm:py-3 text-sm sm:text-base font-semibold rounded-full transition-all
        backdrop-blur-xl border 
        disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-white/5 disabled:border-white/10
        text-white bg-gradient-to-br from-blue-500/30 to-blue-800/40 border-blue-400/30
        shadow-md shadow-blue-900/30
        hover:from-blue-500/30 hover:to-blue-900/40 hover:shadow-lg hover:scale-[1.02]
        disabled:hover:scale-100"
    >
      Submit
    </button>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <section className="hidden md:flex flex-col w-full md:w-[25%] lg:w-[20%] shrink-0 p-4 h-full rounded-lg bg-white/5 backdrop-blur-[6px] border border-white/10 shadow-inner shadow-black/20">
        <div className="flex-1 overflow-y-auto pr-1">{questionButtons}</div>
        <div className="mt-4">{submitButton}</div>
      </section>

      {/* Mobile Drawer */}
      {open && setOpen && (
        <div className="fixed md:hidden inset-0 bg-black/50 z-50 backdrop-blur-sm flex justify-end">
          <div className="w-[90%] max-w-sm h-full bg-neutral-900 border-l border-white/10 p-4 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-white font-semibold">Questions</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-white text-lg"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{questionButtons}</div>
            <div className="pt-4">{submitButton}</div>
          </div>
        </div>
      )}
    </>
  );
}
