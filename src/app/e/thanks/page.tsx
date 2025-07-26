"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useExamStore } from "@/stores/examstore";

export default function Thanks() {
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {

    useExamStore.getState().resetExam();
    useExamStore.persist.clearStorage();

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          signOut({ callbackUrl: "/" });
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6">
        <Image
          src="/icons/csi_logo.svg"
          alt="CSI Logo"
          width={64}
          height={64}
        />
        <h1 className="text-3xl sm:text-4xl font-semibold text-center">
          🎉 Thank you for your submission!
        </h1>
        <p className="text-gray-400 text-lg text-center max-w-md">
          <span className="text-white font-semibold">
            Computer Society of India - AKGEC Chapter
          </span>
        </p>
        <p className="text-gray-400 text-lg">
          Redirecting you to login in{" "}
          <span className="font-bold">{secondsLeft}</span> seconds...
        </p>
      </div>
    </div>
  );
}