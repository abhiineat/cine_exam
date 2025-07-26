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
  const { questions, selectedSubject, setQuestions } = useExamStore();

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

      if (!res.ok) throw new Error("Failed to update response");

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

  const handleSubmit = () => {
    // TODO: Integrate actual submission logic
    console.log("Submitting test...");
  };

  const buttonConfigs = [
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
      label: "Submit",
      colorStyle:
        "bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-700",
      disabled: false,
      onClick: handleSubmit,
    },
  ];

  return (
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
  );
}