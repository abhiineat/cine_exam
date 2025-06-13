"use client";
import React, { useState } from "react";
import SelectLanguageDropdown from "@/components/instructions/SelectLanguageDropdown";
import StartButton from "@/components/instructions/StartButton";

export default function SelectLanguageContainer() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");

  return (
    <div className="flex flex-col md:flex-row justify-start gap-4 mt-7">
      {/* Language Selection */}
      <div className="w-full md:w-2/5">
        <div
          className="h-full rounded-lg p-6 bg-no-repeat bg-cover"
          style={{ backgroundImage: "url('/icons/SelectLanguagebg.png')" }}
        >
          <span className="block mb-4 font-bold text-lg">Select Language</span>
          <SelectLanguageDropdown
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
        </div>
      </div>

      {/* Start Button Section */}
      <div
        className="w-full md:flex-1 h-full rounded-lg p-6 bg-no-repeat bg-cover"
        style={{ backgroundImage: "url('/icons/Startbg.png')" }}
      >
        <StartButton selectedLanguage={selectedLanguage} />
      </div>
    </div>
  );
}