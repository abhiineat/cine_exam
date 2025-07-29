"use client";

import { useExamStore } from "@/stores/examstore";
import { useSocketStore } from "@/stores/socketstore";

export default function NavigationButtons() {
    const {
        questions,
        setQuestions,
        selectedSubject,
        setSelectedSubject,
        activeQuestion,
        setActiveQuestion,
    } = useExamStore();

    const subjectList = Object.keys(questions);
    const currentSubjectIndex = subjectList.indexOf(selectedSubject);
    const currentSubjectQuestions = questions[selectedSubject] || [];

    const isFirstSubject = currentSubjectIndex === 0;
    const isLastSubject = currentSubjectIndex === subjectList.length - 1;
    const isFirstQuestion = activeQuestion === 1;
    const isLastQuestion = activeQuestion === currentSubjectQuestions.length;

    const socket = useSocketStore((s) => s.socket);

    const sendNavigationUpdate = async (quesId: string) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            console.log("Sending navigation update for question:", quesId);
            socket.send(
                JSON.stringify({
                    event: "question-navigated",
                    quesId,
                    status: 0,
                    ansId: -1,
                })
            );
        }
    };

    const updateQuestionIfNeeded = (subject: string, index: number) => {
        const ques = questions[subject]?.[index];
        if (!ques || ques.status !== undefined) return;

        // Mark the question with status and ansId
        const updatedQuestions = { ...questions };
        updatedQuestions[subject][index] = {
            ...ques,
            status: 0,
            ansId: -1,
        };

        setQuestions(updatedQuestions);
        sendNavigationUpdate(ques._id);
    };

    const handleNext = () => {
        if (isLastQuestion) {
            const nextSubject = isLastSubject
                ? subjectList[0]
                : subjectList[currentSubjectIndex + 1];
            setSelectedSubject(nextSubject);
            setActiveQuestion(1);

            updateQuestionIfNeeded(nextSubject, 0);
        } else {
            const nextIndex = activeQuestion;
            setActiveQuestion(activeQuestion + 1);
            updateQuestionIfNeeded(selectedSubject, nextIndex);
        }
    };

    const handlePrevious = () => {
        if (isFirstQuestion) {
            if (!isFirstSubject) {
                const prevSubject = subjectList[currentSubjectIndex - 1];
                const prevSubjectQuestions = questions[prevSubject] || [];
                const lastIndex = prevSubjectQuestions.length - 1;
                setSelectedSubject(prevSubject);
                setActiveQuestion(prevSubjectQuestions.length);

                updateQuestionIfNeeded(prevSubject, lastIndex);
            }
        } else {
            const prevIndex = activeQuestion - 2;
            setActiveQuestion(activeQuestion - 1);
            updateQuestionIfNeeded(selectedSubject, prevIndex);
        }
    };

    return (
        <div className="flex justify-between gap-4">
            <button
                className="flex-1 py-2 rounded-full bg-slate-700 text-slate-200 font-semibold border border-slate-500 hover:bg-slate-600 transition"
                onClick={handlePrevious}
                disabled={isFirstSubject && isFirstQuestion}
            >
                Previous
            </button>
            <button
                className="flex-1 py-2 rounded-full bg-blue-700 text-blue-200 font-semibold border border-blue-500 hover:bg-blue-600 transition"
                onClick={handleNext}
            >
                Next
            </button>
        </div>
    );
}
