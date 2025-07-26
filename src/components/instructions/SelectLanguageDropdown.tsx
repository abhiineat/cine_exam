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
    { value: "1", label: "C" },
    { value: "2", label: "C++" },
    { value: "3", label: "Java" },
    { value: "4", label: "Python" },
  ];

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value);
  };

  return (
    <div className="relative w-4/5">
      <select
        className="w-full py-3 px-5 pr-10 rounded-full border-[1px] border-gray-400 text-sm font-medium appearance-none cursor-pointer focus:outline-none"
        onClick={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onChange={handleChange}
        value={selectedLanguage}
      >
        {languages.map(({ value, label }, i) => (
          <option key={i+1} value={value} disabled={value === ""}>
            {label}
          </option>
        ))}
      </select>

      <div
        className={`absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none transition-transform duration-300 ${
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
