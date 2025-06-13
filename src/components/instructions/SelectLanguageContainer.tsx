"use client";
import React, { useState } from "react";
import SelectLanguageDropdown from "@/components/instructions/SelectLanguageDropdown";
import StartButton from "@/components/instructions/StartButton";

export default function SelectLanguageContainer() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");

  return (
    <div className="flex flex-col md:flex-row justify-start gap-4 mt-7">
      {/* Language Selection */}
      <div className="w-full md:w-2/5 bg-gray-100/10 rounded-2xl shadow-2xl">
        <div className="h-full rounded-lg p-6">
          <span className="block mb-4 font-bold text-lg">Select Language</span>
          <SelectLanguageDropdown
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
        </div>
      </div>

      {/* Start Button Section */}
      <div className="w-full md:flex-1 h-full p-6 bg-gray-100/60 rounded-2xl shadow-2xl">
        <StartButton selectedLanguage={selectedLanguage} />
      </div>
    </div>
  );
}