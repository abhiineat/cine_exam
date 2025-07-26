"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EmojiSlider from "@/components/ui/EmojiSlider";

interface FeedbackQuestion {
  question: string;
  type: "text" | "rating";
}

export default function FeedbackPage() {
  const [questions, setQuestions] = useState<FeedbackQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/feedback")
      .then((res) => res.json())
      .then((data) => setQuestions(data.questions));
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        body: JSON.stringify({ answers }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        router.push("/e/thanks");
      } else {
        alert("Something went wrong!");
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const renderInput = (q: FeedbackQuestion) => {
    if (q.type === "text") {
      return (
        <textarea
          className="w-full mt-2 p-3 bg-neutral-800 border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          rows={4}
          value={answers[q.question] || ""}
          onChange={(e) =>
            setAnswers({ ...answers, [q.question]: e.target.value })
          }
        />
      );
    } else {
      return (
        <EmojiSlider
          value={(answers[q.question] as number) || 3}
          onChange={(val) => setAnswers({ ...answers, [q.question]: val })}
        />
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-8">

      {questions.map((q, i) => (
        <div
          key={i}
          className="bg-neutral-900 p-5 rounded-md border border-white/10 shadow-sm"
        >
          <p className="text-white/90 font-medium">{q.question}</p>
          {renderInput(q)}
        </div>
      ))}

      <button
        disabled={loading}
        onClick={handleSubmit}
        className={`w-full py-3 rounded-full font-semibold text-white transition-all text-lg flex items-center justify-center
          ${
            loading
              ? "bg-emerald-400 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700"
          }
        `}
      >
        {loading ? (
          <>
            <svg
              className="h-5 w-5 animate-spin mr-2 text-white"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
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
            Submitting...
          </>
        ) : (
          "Submit Feedback"
        )}
      </button>
    </div>
  );
}