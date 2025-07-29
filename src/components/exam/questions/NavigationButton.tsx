"use client";

import { useExamStore } from "@/stores/examstore";
import { getSocket } from "@/hooks/useSocket";

export default function NavigationButtons() {
    const {
        questions,
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

    const sendNavigationUpdate = async (quesId: string) => {
        const socket = await getSocket();
        if (socket.readyState === WebSocket.OPEN) {
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

    const handleNext = () => {
        if (isLastQuestion) {
            const nextSubject = isLastSubject
                ? subjectList[0]
                : subjectList[currentSubjectIndex + 1];
            setSelectedSubject(nextSubject);
            setActiveQuestion(1);

            const firstQuesId = questions[nextSubject]?.[0]?._id;
            if (firstQuesId) sendNavigationUpdate(firstQuesId);
        } else {
            const nextQuesId = currentSubjectQuestions[activeQuestion]?._id;
            setActiveQuestion(activeQuestion + 1);

            if (nextQuesId) sendNavigationUpdate(nextQuesId);
        }
    };

    const handlePrevious = () => {
        if (isFirstQuestion) {
            if (!isFirstSubject) {
                const prevSubject = subjectList[currentSubjectIndex - 1];
                const prevSubjectQuestions = questions[prevSubject] || [];
                setSelectedSubject(prevSubject);
                setActiveQuestion(prevSubjectQuestions.length);

                const lastQuesId =
                    prevSubjectQuestions[prevSubjectQuestions.length - 1]?._id;
                if (lastQuesId) sendNavigationUpdate(lastQuesId);
            }
        } else {
            const prevQuesId = currentSubjectQuestions[activeQuestion - 2]?._id;
            setActiveQuestion(activeQuestion - 1);

            if (prevQuesId) sendNavigationUpdate(prevQuesId);
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
