"use client";

import { useExamStore } from "@/stores/examstore";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const COLORS = {
  answered: "#22c55e",
  marked: "#a855f7",
  visited: "#ef4444",
  notVisited: "#e2e8f0",
};

type Question = {
    _id?: string;
    status?: number;
    ansId?: number;
};

const getStatusCounts = (questionsBySubject: Record<string, Question[]>) => {
    let answered = 0,
        marked = 0,
        visited = 0,
        notVisited = 0;

    Object.values(questionsBySubject).forEach((qs) => {
        qs.forEach((q) => {
            const status = q.status;
            const ansId = q.ansId;
            if (status === 2) {
                marked++;
            } else if (status === 1) {
                answered++;
            } else if (status === 0 && ansId === -1) {
                visited++;
            } else {
                notVisited++;
            }
        });
    });

    return { answered, marked, visited, notVisited };
};

export default function Submit() {
  const { questions } = useExamStore();
  console.log(questions);
  const subjects = Object.keys(questions);
  const statusCounts = getStatusCounts(questions);
  const { update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const pieData = [
    { name: "Answered", value: statusCounts.answered, color: COLORS.answered },
    { name: "Marked", value: statusCounts.marked, color: COLORS.marked },
    { name: "Visited", value: statusCounts.visited, color: COLORS.visited },
    {
      name: "Not Visited",
      value: statusCounts.notVisited,
      color: COLORS.notVisited,
    },
  ];

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/submit", {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        console.error("Submit failed:", data.message);
        return;
      }

      await update();
      router.push("/e/feedback");
    } catch (error) {
      console.error("Error submitting exam:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto mt-2 px-4 py-4">
      <div className="grid lg:grid-cols-3 gap-8 lg:h-[78vh]">
        <div className="lg:col-span-2 overflow-y-auto pr-2 space-y-4">
          {subjects.map((sub) => (
            <div
              key={sub}
              className="rounded-xl text-lg border border-white/10 bg-neutral-900 shadow-sm p-3"
            >
              <h2 className="text-lg font-semibold mb-3 border-b border-white/10 pb-1">
                {sub}
              </h2>
              <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5">
                {questions[sub].map((q, idx) => {
                  const status =
                      q?.status != null ? Number(q.status) : undefined;
                  const ansId = q?.ansId != null ? Number(q.ansId) : undefined;

                  let bg = "bg-gray-700";

                  if (!status && !ansId) {
                    bg = "bg-gray-700";
                  } else if (status === 1) {
                    bg = "bg-green-600";
                  } else if (status === 2) {
                    bg = "bg-purple-600";
                  } else if (status === 0 && ansId === -1) {
                    bg = "bg-red-500";
                  }

                  return (
                    <div
                      key={q._id || idx}
                      className={`${bg} w-9 h-9 flex items-center justify-center rounded-full shadow-sm font-medium`}
                      title={`Q${idx + 1}`}
                    >
                      {idx + 1}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-neutral-900 rounded-xl border border-white/10 shadow-md p-6 flex flex-col justify-between lg:sticky lg:top-4 h-fit">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-center">
              Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>

            <table className="mt-6 w-full text-left text-sm font-semibold text-white/80 border border-white/10 rounded-lg overflow-hidden">
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="px-4 py-2">Total Questions</td>
                  <td className="px-4 py-2 text-right">
                    {Object.values(questions).flat().length}
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="px-4 py-2">Answered</td>
                  <td className="px-4 py-2 text-right">
                    {statusCounts.answered}
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="px-4 py-2">Marked for Review</td>
                  <td className="px-4 py-2 text-right">
                    {statusCounts.marked}
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="px-4 py-2">Visited but Not Answered</td>
                  <td className="px-4 py-2 text-right">
                    {statusCounts.visited}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Not Visited</td>
                  <td className="px-4 py-2 text-right">
                    {statusCounts.notVisited}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

            <div className="mt-8 w-full flex gap-3">
            <button
              className="py-3 px-6 rounded-full font-semibold text-white bg-gray-700 hover:bg-gray-800 transition-all text-lg cursor-pointer flex items-center justify-center"
              onClick={() => router.push("/e/exam")}
              disabled={loading}
              type="button"
            >
              Back to Exam
            </button>
            <button
              className={`flex-1 py-3 rounded-full font-semibold text-white transition-all text-lg cursor-pointer flex items-center justify-center gap-2 ${
              loading
                ? "bg-emerald-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
              }`}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Submitting...
              </>
              ) : (
              "Submit Test"
              )}
            </button>
            </div>
        </div>
      </div>
    </section>
  );
}
