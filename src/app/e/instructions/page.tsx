"use client";

import Image from "next/image";
import SelectLanguageContainer from "@/components/instructions/SelectLanguageContainer";

export default function Instruction() {
  const circleData = [
    { src: "/icons/redCircle.png", text: "Not Answered" },
    { src: "/icons/yellowCircle.png", text: "Review" },
    { src: "/icons/blueCircle.png", text: "Answered & Review" },
    { src: "/icons/greenCircle.png", text: "Answered" },
  ];

  const instructions = [
    "Do not navigate away from the exam window during the exam.",
    "You cannot pause or resume the exam once you begin.",
    "Read each question carefully and choose the best answer.",
    "In case of unexpected technical difficulties, such as a power outage or internet disruption, try refreshing the webpage first.",
    "If the issue persists, do not close the browser window.",
    "Immediately contact your instructor or exam proctor via the designated communication channel.",
    "Plagiarism and cheating of any kind will not be tolerated.",
    "You are expected to complete the exam independently and according to the instructions provided.",
    "Any violation of academic integrity will result in disciplinary action.",
  ];

  return (
    <div className="min-h-screen bg-[#EAEEFF] bg-no-repeat bg-[48%] bg-contain bg-[url('/icons/bg_logo.svg')]">

      <main className="flex justify-center px-4 py-6">
        <div className="w-full max-w-screen-lg">
          <div
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8 bg-cover bg-center"
            style={{ backgroundImage: "url('/icons/bg.png')" }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#1A1A1A]">
              INSTRUCTIONS
            </h2>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="hidden md:flex flex-col gap-2 pt-1">
                {[...Array(1)].map((_, i) => (
                  <Image
                    key={i}
                    src="/icons/verticalLine.png"
                    alt="Line"
                    width={5}
                    height={50}
                  />
                ))}
              </div>

              <ul className="list-disc text-justify ml-4 text-sm md:text-base font-medium space-y-3">
                {instructions.map((text, i) => (
                  <li key={i}>{text}</li>
                ))}
              </ul>
            </div>

            <p className="mt-6 text-sm md:text-base font-semibold text-[#333]">
              The following colors represent the categories of questions:
              Answered, Not Answered, Answered & Marked for Review, and Not
              Answered & Marked for Review.
            </p>

            <div className="flex flex-wrap gap-4 mt-4">
              {circleData.map(({ src, text }, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Image
                    src={src}
                    alt={`${text} Circle`}
                    width={20}
                    height={20}
                  />
                  <span className="text-sm md:text-base font-medium">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <SelectLanguageContainer />
          </div>
        </div>
      </main>
    </div>
  );
}
