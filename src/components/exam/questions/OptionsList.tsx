"use client";

import { useState } from "react";

const dummyOptions = [
  "Option A",
  "Option B",
  "Option C",
  "Option D",
];

export default function OptionsList() {
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [lockedOption, setLockedOption] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    if (saving) return;
    setSelected(option);
    setSaving(true);
    setLockedOption(option);

    setTimeout(() => {
      setSaving(false);
      setLockedOption(null);
      console.log(`Saved answer: ${option}`);
    }, 2000);
  };

  return (
    <div className="h-full overflow-y-auto space-y-4 relative p-4">
      {dummyOptions.map((option, idx) => (
        <label
          key={idx}
          className={`group relative block p-4 rounded-2xl border text-sm font-medium cursor-pointer select-none transition-all
            ${
              selected === option
                ? "bg-green-500/20 border-green-400 text-white"
                : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
            }
            ${
              saving && lockedOption !== option
                ? "opacity-50 pointer-events-none"
                : ""
            }
          `}
        >
          <input
            type="radio"
            name="option"
            value={option}
            className="hidden"
            checked={selected === option}
            onChange={() => handleSelect(option)}
            disabled={saving}
          />
          {option}
          {saving && lockedOption === option && (
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"
              style={{ animationDuration: "0.4s" }}
            />
          )}
        </label>
      ))}
    </div>
  );
}

