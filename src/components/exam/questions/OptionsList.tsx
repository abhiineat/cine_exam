"use client";

import { useState, useEffect } from "react";
import { useExamStore } from "@/stores/examstore"; 

interface Option {
  id: number;
  desc: string;
}

interface OptionsListProps {
  options: Option[];
  quesId: string;
  status?: number;
  ansId?: number;
}

export default function OptionsList({
  options,
  quesId,
  status,
  ansId,
}: OptionsListProps) {
  const [selected, setSelected] = useState<number | null>(ansId ?? null);
  const [saving, setSaving] = useState(false);
  const [lockedOption, setLockedOption] = useState<number | null>(null);

  const { questions, setQuestions, selectedSubject } = useExamStore();

  useEffect(() => {
    setSelected(ansId ?? null);
  }, [ansId]);

  const handleSelect = async (optionId: number) => {
    if (saving || selected === optionId) return;

    setSelected(optionId);
    setSaving(true);
    setLockedOption(optionId);

    const newStatus = status === 2 ? 2 : 1;

    try {
      await fetch("/api/response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quesId,
          ansId: optionId,
          status: newStatus,
        }),
      });

      const updatedQuestions = { ...questions };
      const subjectQuestions = [...(updatedQuestions[selectedSubject] || [])];
      const index = subjectQuestions.findIndex((q) => q._id === quesId);

      if (index !== -1) {
        subjectQuestions[index] = {
          ...subjectQuestions[index],
          ansId: optionId,
          status: newStatus,
        };
        updatedQuestions[selectedSubject] = subjectQuestions;
        setQuestions(updatedQuestions);
      }
    } catch (error) {
      console.error("Failed to save answer:", error);
    } finally {
      setSaving(false);
      setLockedOption(null);
    }
  };

  return (
    <div className="h-full overflow-y-auto px-4 pb-4 space-y-4">
      {options.map((option) => (
        <label
          key={option.id}
          className={`group relative block px-5 py-4 rounded-xl border text-base sm:text-lg font-medium cursor-pointer select-none transition-all
            ${
              selected === option.id
                ? "bg-green-500/20 border-green-400 text-white"
                : "bg-white/5 border-white/10 text-gray-200 hover:bg-white/10"
            }
            ${
              saving && lockedOption !== option.id
                ? "opacity-50 pointer-events-none"
                : ""
            }
          `}
        >
          <input
            type="radio"
            name={`option-${quesId}`}
            value={option.id}
            className="hidden"
            checked={selected === option.id}
            onChange={() => handleSelect(option.id)}
            disabled={saving}
          />
          <div className="flex items-center justify-between gap-4">
            <span className="flex-1">{option.desc}</span>
            {saving && lockedOption === option.id && (
              <span
                className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"
                style={{ animationDuration: "0.5s" }}
              />
            )}
          </div>
        </label>
      ))}
    </div>
  );
}