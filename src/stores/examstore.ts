import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Question {
  _id: string;
  question: string;
  options: {
    id: number;
    desc: string;
  }[];
  subject: string;
  code?: string;
  codeLang?: string;
  ansId?: number;
  status?: number;
}

interface ExamState {
  questions: Record<string, Question[]>;
  setQuestions: (questions: Record<string, Question[]>) => void;

  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;

  activeQuestion: number;
  setActiveQuestion: (index: number) => void;

  isLoadingQuestions: boolean;
  setIsLoadingQuestions: (val: boolean) => void;

  isSubmittingResponse: boolean;
  setIsSubmittingResponse: (val: boolean) => void;

  resetExam: () => void;
}

export const useExamStore = create<ExamState>()(
  persist(
    (set) => ({
      questions: {},
      setQuestions: (questions) => set({ questions }),

      selectedSubject: "",
      setSelectedSubject: (subject) => set({ selectedSubject: subject }),

      activeQuestion: 1,
      setActiveQuestion: (index) => set({ activeQuestion: index }),

      isLoadingQuestions: true,
      setIsLoadingQuestions: (val) => set({ isLoadingQuestions: val }),

      isSubmittingResponse: false,
      setIsSubmittingResponse: (val) => set({ isSubmittingResponse: val }),

      resetExam: () =>
        set({
          questions: {},
          selectedSubject: "",
          activeQuestion: 1,
        }),
    }),
    {
      name: "exam-storage", // Key in localStorage
      partialize: (state) =>
        // Only persist relevant data (omit loading flags)
        ({
          questions: state.questions,
          selectedSubject: state.selectedSubject,
          activeQuestion: state.activeQuestion,
        }),
    }
  )
);