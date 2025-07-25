"use client";
import Image from "next/image";
import React, { ChangeEvent, useState } from "react";

interface SelectLanguageDropdownProps {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
}

export default function SelectLanguageDropdown({
  selectedLanguage,
  setSelectedLanguage,
}: SelectLanguageDropdownProps) {
  const [open, setOpen] = useState<boolean>(false);

  const languages = [
    { value: "", label: "Choose a Language" },
    { value: "3", label: "C" },
    { value: "4", label: "C++" },
    { value: "6", label: "Java" },
    { value: "5", label: "Python" },
  ];

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value);
    setOpen(false); 
  };

  return (
    <div className="relative w-4/5">
      <select
        className="w-full py-3 px-5  pr-10 rounded-full border-[1px] border-gray-400 text-sm font-medium appearance-none cursor-pointer focus:outline-none"
        onClick={() => setOpen(!open)}
        onChange={handleChange}
        value={selectedLanguage}
      >
        {languages.map(({ value, label }, i) => (
          <option key={i} value={value} disabled={value === ""}>
            {label}
          </option>
        ))}
      </select>

      <div
        className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-transform duration-300 ${
          open ? "rotate-180" : "rotate-0"
        }`}
      >
        <Image
          src="/icons/DropDown.png"
          alt="Dropdown arrow"
          width={14}
          height={14}
          className="w-4"
        />
      </div>
    </div>
  );
}