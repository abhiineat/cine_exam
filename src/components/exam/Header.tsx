"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSocketStore } from "@/stores/socketstore";

const TOTAL_DURATION = 2 * 60 * 60; // 2 hours in seconds

export default function Header({ page }: { page?: string }) {
    const socket = useSocketStore((s) => s.socket);
    const [remainingTime, setRemainingTime] = useState<number | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const res = await fetch("/api/activity");
                if (!res.ok) throw new Error("Failed to fetch activity");
                const data = await res.json();
                const timeSpent = data[0]?.timeSpent ?? 0;

                const remaining = Math.max(TOTAL_DURATION - timeSpent, 0);

                setRemainingTime(remaining);
            } catch (error) {
                console.error("Error fetching activity:", error);
                setRemainingTime(TOTAL_DURATION);
            }
        };

        fetchActivity();
    }, []);

    useEffect(() => {
        if (remainingTime === null) return;

        intervalRef.current = setInterval(() => {
            setRemainingTime((prev) => {
                const next = (prev ?? TOTAL_DURATION) - 1;

                // if (next % 15 === 0 && socket?.send) {
                //     const timeSpent = TOTAL_DURATION - next;
                //     socket.send(
                //         JSON.stringify({ event: "sync-time", timeSpent })
                //     );
                // }

                return next > 0 ? next : 0;
            });
        }, 1000);

        return () => clearInterval(intervalRef.current!);
    }, [remainingTime, socket]);

    const formatTime = (total: number): string => {
        const hrs = String(Math.floor(total / 3600)).padStart(2, "0");
        const mins = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
        const secs = String(total % 60).padStart(2, "0");
        return `${hrs}:${mins}:${secs}`;
    };

    return (
        <header
            className="relative z-10 w-full mx-auto 
      rounded-md sm:rounded-full px-4 sm:px-6 md:px-8 py-3
      flex flex-wrap sm:flex-nowrap justify-between items-center gap-4
      backdrop-blur-[5px] border border-neutral-800 bg-neutral-800/50"
        >
            {/* Left Side */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <Image
                    src="/icons/csi_logo.svg"
                    alt="CSI Logo"
                    width={24}
                    height={24}
                    className="flex-shrink-0"
                />
                <h1 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-wide text-white drop-shadow-sm truncate">
                    CINE |{" "}
                    <span className="text-gray-300 text-sm font-normal">
                        CSI Recruitment Exam
                    </span>
                </h1>
            </div>

            {(page === "submit" || page === "feedback") && (
                <div className="absolute left-1/2 -translate-x-1/2">
                    <span className="text-lg sm:text-xl md:text-3xl font-medium text-gray-200 drop-shadow-sm text-center">
                        {page === "submit"
                            ? "Submission Summary"
                            : "🎉 We'd love your feedback!"}
                    </span>
                </div>
            )}
            {(page === "exam" || page === "submit") &&
                remainingTime !== null && (
                    <div
                        className="px-4 py-1.5 sm:py-2 rounded-md sm:rounded-full 
          bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg 
          border border-white/15 shadow-inner shadow-black/20 
          animate-pulse-slow"
                    >
                        <span className="text-base sm:text-lg md:text-xl font-mono text-emerald-300 tracking-wide">
                            {formatTime(remainingTime)}
                        </span>
                    </div>
                )}
        </header>
    );
}
