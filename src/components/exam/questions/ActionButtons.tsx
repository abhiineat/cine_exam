"use client";

import { useExamStore } from "@/stores/examstore";

export default function ActionButtons({
  quesId,
  status,
  ansId,
}: {
  quesId: string;
  status?: number;
  ansId?: number;
}) {
  const {
    questions,
    selectedSubject,
    setSelectedSubject,
    activeQuestion,
    setActiveQuestion,
    setQuestions,
  } = useExamStore();

  const subjectList = Object.keys(questions);
  const currentSubjectIndex = subjectList.indexOf(selectedSubject);
  const currentSubjectQuestions = questions[selectedSubject] || [];

  const isLastQuestion = activeQuestion === currentSubjectQuestions.length;
  const isLastSubject = currentSubjectIndex === subjectList.length - 1;
  const isFirstSubject = currentSubjectIndex === 0;
  const isFirstQuestion = activeQuestion === 1;

  const handleNext = () => {
    if (isLastQuestion) {
      const nextSubject = isLastSubject
        ? subjectList[0]
        : subjectList[currentSubjectIndex + 1];
      setSelectedSubject(nextSubject);
      setActiveQuestion(1);
    } else {
      setActiveQuestion(activeQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (isFirstQuestion) {
      if (!isFirstSubject) {
        const prevSubject = subjectList[currentSubjectIndex - 1];
        const prevSubjectQuestions = questions[prevSubject] || [];
        setSelectedSubject(prevSubject);
        setActiveQuestion(prevSubjectQuestions.length);
      }
    } else {
      setActiveQuestion(activeQuestion - 1);
    }
  };

  const updateBackendAndState = async (
    newStatus: number,
    newAnsId: number | null
  ) => {
    try {
      const res = await fetch("/api/response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quesId,
          status: newStatus,
          ansId: newAnsId,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update response");
      }

      const updatedQuestions = { ...questions };
      const subjectQs = [...(updatedQuestions[selectedSubject] || [])];
      const index = subjectQs.findIndex((q) => q._id === quesId);

      if (index !== -1) {
        subjectQs[index] = {
          ...subjectQs[index],
          status: newStatus,
          ansId: newAnsId ?? subjectQs[index].ansId,
        };
        updatedQuestions[selectedSubject] = subjectQs;
        setQuestions(updatedQuestions);
      }
    } catch (err) {
      console.error("Failed to update response:", err);
    }
  };

  const handleClear = () => {
    if (ansId == null || ansId === -1) return;
    updateBackendAndState(0, -1);
  };

  const handleMarkReview = () => {
    if (ansId == null || ansId === -1) return;
    const newStatus = status === 2 ? 1 : 2;
    updateBackendAndState(newStatus, ansId);
  };

  const buttonConfigs = [
    {
      label: "Previous",
      colorStyle:
        "bg-slate-700/40 border-slate-500 text-slate-200 hover:bg-slate-600/40",
      disabled: isFirstSubject && isFirstQuestion,
      onClick: handlePrevious,
    },
    {
      label: "Clear",
      colorStyle:
        "bg-neutral-700/40 border-neutral-500 text-white hover:bg-neutral-600/50",
      disabled: ansId == null || ansId === -1,
      onClick: handleClear,
    },
    {
      label: status === 2 ? "Unmark" : "Mark for Review",
      colorStyle:
        status === 2
          ? "bg-yellow-600/40 border-yellow-500 text-yellow-200 hover:bg-yellow-700/40"
          : "bg-purple-700/40 border-purple-500 text-purple-200 hover:bg-purple-600/40",
      disabled: ansId == null || ansId === -1,
      onClick: handleMarkReview,
    },
    {
      label: "Next",
      colorStyle:
        "bg-blue-700/40 border-blue-500 text-blue-200 hover:bg-blue-600/40",
      disabled: false,
      onClick: handleNext,
    },
  ];

  return (
    <>
      <div className="flex flex-wrap sm:flex-nowrap justify-around items-center gap-4 mt-4">
        {buttonConfigs.map(({ label, colorStyle, disabled, onClick }) => {
          const baseStyle =
            "px-4 sm:px-5 py-2 w-full sm:w-40 text-sm font-semibold rounded-full border transition-all text-center";

          return (
            <button
              key={label}
              className={`${baseStyle} ${colorStyle} ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={onClick}
              disabled={disabled}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div className="fixed bottom-4 right-4 z-50">
        <button
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full shadow-lg transition-all"
          onClick={() => {
            // TODO: Handle submission logic here
            console.log("Submitting test...");
          }}
        >
          Submit Test
        </button>
      </div>
    </>
  );
}