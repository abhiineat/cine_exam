"use client";

import { useState } from "react";

interface Option {
  id: number;
  desc: string;
}

interface OptionsListProps {
  options: Option[];
}

export default function OptionsList({ options }: OptionsListProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [lockedOption, setLockedOption] = useState<number | null>(null);

  const handleSelect = (optionId: number) => {
    if (saving) return;
    setSelected(optionId);
    setSaving(true);
    setLockedOption(optionId);

    setTimeout(() => {
      setSaving(false);
      setLockedOption(null);
      console.log(`Saved answer: ${optionId}`);
    }, 2000);
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
            name="option"
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