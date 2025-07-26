"use client";

import { FC } from "react";
import dynamic from "next/dynamic";
import { useExamStore } from "@/stores/examstore";

// Dynamically import Monaco Editor (required for App Router)
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

interface QuestionPreviewProps {
  question: string;
  code?: string;
  codeLang?: string;
}

const getLanguageLabel = (lang: string) => {
  return lang?.toUpperCase() || "CODE";
};

const QuestionPreview: FC<QuestionPreviewProps> = ({
  question,
  code,
  codeLang = "plaintext",
}) => {
const activeQuestion = useExamStore((state) => state.activeQuestion);
    console.log(codeLang);
  return (
    <div className="h-full overflow-y-auto p-4 rounded-2xl border border-white/10 bg-neutral-800">
      <p className="text-xl font-semibold text-amber-200 leading-relaxed mb-4 whitespace-pre-wrap">
        <span className="font-bold text-2xl text-amber-400">Q.{activeQuestion+ "  "}</span> {question}
      </p>

      {code && (
        <div className="h-64 border border-white/10 rounded-lg overflow-hidden">
          <div className="px-4 py-2 bg-blue-500/60 border-b border-white/10 text-xs text-white font-semibold">
            {getLanguageLabel(codeLang)}
          </div>
          <MonacoEditor
            key={code + codeLang}
            height="calc(100% - 2rem)"
            defaultLanguage={codeLang}
            defaultValue={code}
            theme="vs-dark"
            options={{
              readOnly: true,
              fontSize: 18,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: "on",
              wordWrap: "on",
              automaticLayout: true,
              padding: {
                top: 16,
                bottom: 16,
              },
              lineDecorationsWidth: 10, 
              lineNumbersMinChars: 2, 
            }}
          />
        </div>
      )}
    </div>
  );
};

export default QuestionPreview;