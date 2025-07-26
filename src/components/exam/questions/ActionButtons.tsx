"use client";

import { useExamStore } from "@/stores/examstore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ActionButtons({
  quesId,
  status,
  ansId,
}: {
  quesId: string;
  status?: number;
  ansId?: number;
}) {
  const { questions, selectedSubject, setQuestions, isSubmittingResponse, setIsSubmittingResponse } = useExamStore();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loadingAction, setLoadingAction] = useState<null | string>(null);

  const updateBackendAndState = async (
    newStatus: number,
    newAnsId: number | null,
    actionLabel: string
  ) => {
    setLoadingAction(actionLabel);
    setIsSubmittingResponse(true);
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
    } finally {
      setLoadingAction(null);
      setIsSubmittingResponse(false);
    }
  };

  const handleClear = () => {
    if (ansId == null || ansId === -1) return;
    updateBackendAndState(0, -1, "Clear");
  };

  const handleMarkReview = () => {
    if (ansId == null || ansId === -1) return;
    const newStatus = status === 2 ? 1 : 2;
    updateBackendAndState(newStatus, ansId, "Review");
  };

  const handleConfirmSubmit = () => {
    setShowModal(false);
    router.push("/e/exam/submit");
  };

  const buttonConfigs = [
    {
      label: "Clear",
      key: "Clear",
      colorStyle:
        "bg-neutral-700/40 border-neutral-500 text-white hover:bg-neutral-600/50",
      disabled: ansId == null || ansId === -1,
      onClick: handleClear,
    },
    {
      label: status === 2 ? "Unmark" : "Mark for Review",
      key: "Review",
      colorStyle:
        status === 2
          ? "bg-yellow-600/40 border-yellow-500 text-yellow-200 hover:bg-yellow-700/40"
          : "bg-purple-700/40 border-purple-500 text-purple-200 hover:bg-purple-600/40",
      disabled: ansId == null || ansId === -1,
      onClick: handleMarkReview,
    },
    {
      label: "Submit",
      key: "Submit",
      colorStyle:
        "bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-700",
      disabled: false,
      onClick: () => setShowModal(true),
    },
  ];

  return (
    <>
      <div className="flex flex-wrap sm:flex-nowrap justify-around items-center gap-4 mt-4">
        {buttonConfigs.map(({ label, key, colorStyle, disabled, onClick }) => {
          const isLoading = loadingAction === key;
          const isAnyLoading = loadingAction !== null || isSubmittingResponse;

          const baseStyle =
            "px-4 sm:px-5 py-2 w-full sm:w-50 text-lg font-semibold rounded-full border transition-all text-center";

          return (
            <button
              key={key}
              className={`${baseStyle} ${colorStyle} ${
                disabled || isAnyLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              disabled={disabled || isAnyLoading}
              onClick={() => {
                if (!disabled && !isAnyLoading) onClick();
              }}
            >
              {isLoading ? (
                <div className="flex justify-center items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  <span>Processing</span>
                </div>
              ) : (
                label
              )}
            </button>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-neutral-900 text-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-white/10">
            <h2 className="text-lg font-bold mb-4">Confirm Submission</h2>
            <p className="text-sm mb-6">
              Are you sure you want to submit your test? You won&apos;t be able
              to change your answers afterward.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-full border border-neutral-500 hover:bg-neutral-800"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                onClick={handleConfirmSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}