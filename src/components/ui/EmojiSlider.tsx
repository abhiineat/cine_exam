"use client";

import { useEffect, useRef, useState } from "react";

interface EmojiSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const emojiMap = {
  1: "😠",
  2: "😕",
  3: "😐",
  4: "😊",
  5: "🤩",
};

export default function EmojiSlider({ value, onChange }: EmojiSliderProps) {
  const [localValue, setLocalValue] = useState(value || 3);
  const sliderRef = useRef<HTMLInputElement>(null);

  // Snap to nearest value on mouse up
  const handleMouseUp = () => {
    const snapped = Math.round(localValue);
    setLocalValue(snapped);
    onChange(snapped);
  };

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className="w-full mt-4 flex gap-10 items-center justify-center">
      <div className="flex-1">
        <input
          type="range"
          min={1}
          max={5}
          step={0.01}
          ref={sliderRef}
          value={localValue}
          onChange={(e) => setLocalValue(parseFloat(e.target.value))}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          className="w-full h-2 rounded-lg appearance-none bg-gradient-to-r from-emerald-600 to-emerald-300 focus:outline-none"
          style={{
            background: `linear-gradient(to right, #059669 ${
              ((localValue - 1) / 4) * 100
            }%, #1F2937 ${100 - ((localValue - 1) / 4) * 100}%)`,
          }}
        />
      </div>
      <div className="mt-2 text-4xl text-center transition-all duration-300 ease-in-out">
        {emojiMap[Math.round(localValue) as keyof typeof emojiMap]}
      </div>
    </div>
  );
}
