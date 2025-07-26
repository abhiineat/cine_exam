import { create } from "zustand";

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

export const useExamStore = create<ExamState>((set) => ({
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
}));
