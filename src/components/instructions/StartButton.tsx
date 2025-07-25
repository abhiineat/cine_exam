"use client";
import React, { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface StartButtonProps {
  selectedLanguage: string;
}

export default function StartButton({ selectedLanguage }: StartButtonProps) {
  const [start, setStart] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { update } = useSession(); 
  const router = useRouter();

  const handleStart = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/set-preference", {
        method: "POST",
        body: JSON.stringify({ preference: Number(selectedLanguage) }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to update preference");



      await update();

      router.push("/e/exam");
    } catch (error) {
      console.error("Error setting preference:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isButtonEnabled =
    start === "START" && isChecked && selectedLanguage !== "";

  return (
    <div className="space-y-6">
      <label className="flex items-start text-base font-semibold text-gray-600">
        <input
          type="checkbox"
          className="mt-1 w-5 h-5 rounded text-blue-600/10"
          onChange={(e) => setIsChecked(e.target.checked)}
        />
        <span className="pl-3">
          I confirm I&apos;ve read all instructions and typed START below to proceed.
        </span>
      </label>

      <div className="flex flex-col md:flex-row text-sm md:text-base items-center gap-4 text-gray-800">
        <input
          className="w-full md:w-1/3 p-3 rounded-full border-[2px] border-gray-400 bg-transparent text-center placeholder-gray-500 focus:outline-none"
          type="text"
          value={start}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setStart(e.target.value)
          }
          placeholder="START"
        />
        <button
          disabled={!isButtonEnabled || loading}
          onClick={handleStart}
          className={`w-full md:w-1/4 p-3 rounded-full text-lg font-medium transition-all duration-200 ${
            isButtonEnabled && !loading
              ? "bg-[#546CFF] text-white hover:bg-[#3f56d6] cursor-pointer"
              : "bg-gray-500/10 text-gray-500 cursor-not-allowed"
          }`}
        >
          {loading ? "Starting..." : "Start"}
        </button>
      </div>
    </div>
  );
}