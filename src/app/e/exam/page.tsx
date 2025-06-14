import BackgroundGridPattern from "@/components/ui/BackgroundGridPattern";
import Header from "@/components/exam/Header";
import Navbar from "@/components/exam/Navbar";
import QuestionNavigator from "@/components/exam/QuestionNavigator";
import Questions from "@/components/exam/questions/Questions";

export default function ExamPage() {
  return (
    <div className="relative h-[100vh] bg-[#0a0a0a] text-white p-4">
      <BackgroundGridPattern />
      <Header />
      <Navbar />

      <div className="w-[98%] h-[77%] mx-auto mt-6 flex gap-6">
        <Questions />
        <QuestionNavigator />
      </div>
    </div>
  );
}

// "use client";
// import React, { useEffect, useState } from "react";
// import { QuesNoCard } from "@/components/QuesNoCard";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@/store/store";
// import { setQuestionsState } from "@/store/questionStateSlice";
// import { setActiveQuestionNumber } from "@/store/questionSlice";
// import toast, { Toaster } from "react-hot-toast";

// import Image from "next/image";
// import { responseSetter } from "@/constants/responseSetter";
// import { useRouter } from "next/navigation";
// import Timer from "@/components/Timer";
// import submitTestService from "@/constants/submitTest";
// import { questionFetcher } from "@/constants/questionFetcher";
// interface Option {
//   desc: string;
//   id: number;
// }

// interface QuestionType {
//   _id: string;
//   state: string;
//   quesId: number;
//   subject: string;
//   question: string;
//   options: Option[];
//   recordedAns: number;
//   answer: number;
// }

// const Spinner = ({ color }: { color: string }) => (
//   <div
//     className={`spinner-border animate-spin inline-block w-4 h-4 border-2 border-t-transparent border-${color} rounded-full`}
//   ></div>
// );

// export default function Page() {
//   if (typeof window === "undefined") return;
//   const userId = localStorage.getItem("userId");
//   const [loading, setLoading] = useState<boolean>(true);
//   const [remainTime, setRemainTime] = useState<number>(0);
//   const [fullScreen, setFullScreen] = useState<boolean>(
//     window.innerHeight > window.outerHeight
//   );
//   const router = useRouter();
//   const [navMenu, setNavMenu] = useState<string[]>([
//     "HTML",
//     "SQL",
//     "CSS",
//     "Aptitude",
//     "Java",
//   ]);
//   const [activeMenu, setActiveMenu] = useState<number>(0);
//   const dispatch = useDispatch();
//   const activeQuestionNumber = useSelector(
//     (state: RootState) => state.question.activeQuestionNumber
//   );
//   const allQuestions = useSelector(
//     (state: RootState) => state.questionState.allQuestions
//   );
//   const [answer, setAnswer] = useState<string>("");
//   const [loadingButton, setLoadingButton] = useState<string | null>(null);
//   const [tabSwitchCount, setTabSwitchCount] = useState<number>(0);

//   const changeState = (type: string, ansId: number) => {
//     let temp: QuestionType[] = [];
//     allQuestions.forEach((element, id) => {
//       id + 1 === activeQuestionNumber
//         ? temp.push({ ...element, state: type, recordedAns: ansId })
//         : temp.push(element);
//     });
//     if (activeQuestionNumber === allQuestions.length) {
//       dispatch(setActiveQuestionNumber(1));
//       setActiveMenu(0);
//     } else {
//       setActiveMenu(
//         Math.floor(allQuestions[activeQuestionNumber].quesId / 100) - 1
//       );
//       dispatch(setActiveQuestionNumber(activeQuestionNumber + 1));
//     }
//     dispatch(setQuestionsState(temp));
//   };

//   const buttonHandler = async (state: string) => {
//     setLoadingButton(state);
//     let ansId: number = allQuestions[activeQuestionNumber - 1].recordedAns;
//     try {
//       if (
//         state === "A" &&
//         allQuestions[activeQuestionNumber - 1]?.state === "A" &&
//         answer === ""
//       ) {
//         changeState("A", ansId);
//         return;
//       }
//       if (state === "clear") {
//         const currentState: string =
//           allQuestions[activeQuestionNumber - 1]?.state;
//         if (currentState === "A" || currentState === "MR") {
//           if (userId) {
//             await responseSetter(
//               userId,
//               allQuestions[activeQuestionNumber - 1]._id,
//               ["NA", "MR", "A"].indexOf("NA"),
//               0
//             );
//           }
//         }
//         changeState("NA", 0);
//         setAnswer("");
//         toast.success("Response Cleared");
//         return;
//       }
//       if (answer === "" && state === "NA") {
//         if (
//           allQuestions[activeQuestionNumber - 1]?.state !== "A" &&
//           allQuestions[activeQuestionNumber - 1]?.state !== "MR"
//         ) {
//           if (userId && allQuestions[activeQuestionNumber - 1]?.state != "NA") {
//             await responseSetter(
//               userId,
//               allQuestions[activeQuestionNumber - 1]._id,
//               ["NA", "MR", "A"].indexOf(state),
//               0
//             );
//           }
//           changeState(state, 0);
//         } else {
//           toast.error("Response already recorded!");
//         }
//       }
//       if (
//         state === "MR" &&
//         allQuestions[activeQuestionNumber - 1]?.state === "A"
//       ) {
//         if (userId) {
//           await responseSetter(
//             userId,
//             allQuestions[activeQuestionNumber - 1]._id,
//             ["NA", "MR", "A"].indexOf(state),
//             ansId
//           );
//         }
//         changeState(state, ansId);
//       }
//       if (
//         state === "MR" &&
//         allQuestions[activeQuestionNumber - 1]?.state === "MR" &&
//         answer === ""
//       ) {
//         changeState("MR", ansId);
//         return;
//       }
//       if (
//         ansId != 0 &&
//         state === "A" &&
//         allQuestions[activeQuestionNumber - 1]?.state == "MR"
//       ) {
//         if (userId) {
//           await responseSetter(
//             userId,
//             allQuestions[activeQuestionNumber - 1]._id,
//             ["NA", "MR", "A"].indexOf(state),
//             ansId
//           );
//         }
//         changeState(state, ansId);
//       }

//       for (const option of allQuestions[activeQuestionNumber - 1].options) {
//         if (option.desc === answer) {
//           ansId = option.id;
//           if (userId) {
//             await responseSetter(
//               userId,
//               allQuestions[activeQuestionNumber - 1]._id,
//               ["NA", "MR", "A"].indexOf(state),
//               state === "NA" ? 0 : ansId
//             );
//           }
//           setAnswer("");
//           changeState(state, state === "NA" ? 0 : ansId);
//         }
//       }
//       if (ansId === 0 && state !== "NA") {
//         toast.error("Please select an answer");
//         return;
//       }
//     } finally {
//       setLoadingButton(null);
//     }
//   };
//   const getQuestions = async () => {
//     if (typeof window === "undefined") return;

//     if (!userId) {
//       toast.error("User not found");
//       router.replace("/login");
//       return;
//     }
//     const responseData = await questionFetcher(userId);
//     if (typeof responseData === "string") {
//       router.push("/login");
//       return;
//     }
//     let languageStart: string = "";
//     const { language, questions, responses } = responseData;
//     if (!language) {
//       const languageLocale = localStorage.getItem("language");
//       if (!languageLocale) {
//         toast.error("Error occured! Refresh the page");
//         return;
//       }
//       languageStart = languageLocale;
//     } else {
//       languageStart = language;
//     }
//     setNavMenu(["HTML", "SQL", "CSS", "Aptitude", languageStart]);
//     localStorage.setItem("language", languageStart);

//     let data: QuestionType[] = [];
//     const questionsBySubject = questions.reduce((acc: any, question: any) => {
//       if (!acc[question.subject]) {
//         acc[question.subject] = [];
//       }
//       acc[question.subject].push(question);
//       return acc;
//     }, {});
//     const subjectsOrder = ["HTML", "SQL", "CSS", "Aptitude", languageStart];
//     const responseIds = ["NA", "MR", "A"];
//     const isResponsesEmpty =
//       !Array.isArray(responses) || responses.length === 0;
//     for (const subject of subjectsOrder) {
//       const subjectQuestions = questionsBySubject[subject] || [];
//       const randomizedQuestions = subjectQuestions.map(
//         (q: any, index: number) => ({
//           ...q,
//           quesId: 100 * (subjectsOrder.indexOf(subject) + 1) + index + 1,
//           state: isResponsesEmpty
//             ? "UA"
//             : responseIds[
//                 responses.find((r: any) => r.quesId === q._id)?.status
//               ] || "UA",
//           recordedAns: isResponsesEmpty
//             ? 0
//             : responses.find((r: any) => r.quesId === q._id)?.ansId || 0,
//         })
//       );

//       data.push(...randomizedQuestions);
//     }
//     dispatch(setQuestionsState(data));
//     setLoading(false);
//   };
//   const tabSwitchHandler = async () => {
//     try {
//       toast.error(
//         "Tab switch detected. You will be logged out in 3 seconds. Contact the invigilator and leave the exam venue."
//       );
//       await submitTestService(userId as string);
//       setTimeout(() => {
//         localStorage.removeItem("userId");
//         localStorage.removeItem("language");
//         localStorage.removeItem("TREM");
//         router.push("/login");
//       }, 3000);
//       return;
//     } catch (err) {
//       toast.error("An unexpected error occurred. Please try again later.");
//     }
//   };
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     if (userId === null) {
//       router.replace("/login");
//       return;
//     }
//     if (parseInt(localStorage.getItem("TREM") as string) <= 0) {
//       router.push("/feedback");
//       return;
//     }
//     if (localStorage.getItem("TREM") != null) {
//       let data: number = parseInt(localStorage.getItem("TREM") || "0");
//       setRemainTime(data);
//     }
//     getQuestions();
//   }, []);
//   useEffect(() => {
//     const disableTabChange = (event: KeyboardEvent) => {
//       if (
//         event.ctrlKey &&
//         (event.key === "Tab" || event.key === "t" || event.key === "T")
//       ) {
//         event.preventDefault();
//       }
//     };
//     const handleResize = () => {
//       if (window.innerHeight < window.outerHeight) {
//         toast.error(
//           "Full screen mode is compulsory, exiting full screen can result in disqualification"
//         );
//         setFullScreen(false);
//       } else {
//         setFullScreen(true);
//       }
//     };
//     const handleBlur = () => {
//       setTabSwitchCount((prev) => {
//         const newCount = prev + 1;
//         return newCount;
//       });
//     };
//     const disableKeydown = (event: KeyboardEvent) => {
//       if (event.ctrlKey || event.altKey || event.metaKey) {
//         event.preventDefault();
//       }
//     };
//     const disableContextMenu = (event: MouseEvent) => {
//       event.preventDefault();
//     };
//     window.onbeforeunload = null;
//     window.addEventListener("blur", handleBlur);
//     window.addEventListener("keydown", disableTabChange);
//     window.addEventListener("resize", handleResize);
//     window.addEventListener("keydown", disableKeydown);
//     window.addEventListener("contextmenu", disableContextMenu);
//     return () => {
//       window.removeEventListener("keydown", disableTabChange);
//       window.removeEventListener("keydown", disableKeydown);
//       window.removeEventListener("contextmenu", disableContextMenu);
//       window.removeEventListener("blur", handleBlur);
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     if (tabSwitchCount >= 2) {
//       tabSwitchHandler();
//       return;
//     } else if (tabSwitchCount >= 1 && tabSwitchCount < 2) {
//       toast.error("Tab switching detected.");
//     }
//   }, [tabSwitchCount]);
//   return (
//     <div>
//       <Toaster />
//       {loading ? (
//         <Loader containerStyles="flex justify-center items-center h-screen w-full" />
//       ) : fullScreen ? (
//         <div className="bg-[#EAEEFF] select-none h-screen relative">
//           <div className="bg-[#546CFF] w-full flex justify-between items-center px-6 py-4 text-white font-semibold">
//             <div className="flex justify-center items-center">
//               <Image
//                 src="./icons/csi_logo.svg"
//                 width={50}
//                 height={50}
//                 alt="csiLogo"
//                 className="px-3 w-[50px]"
//               />
//               <h1 className="text-xl font-medium pl-5">CSI Exam Portal</h1>
//             </div>
//             <span className="text-lg">
//               Time Left : <Timer remainTime={remainTime} />
//             </span>
//           </div>
//           <div className="flex ml-[50%] -translate-x-[50%]">
//             {navMenu?.map((element, id) => (
//               <div
//                 key={id}
//                 className={`w-[120px] shadow-md hover:text-white font-medium mt-5 hover:bg-[#546CFF] cursor-pointer ${
//                   activeMenu == id
//                     ? "bg-[#546CFF] text-white"
//                     : "bg-white text-black"
//                 } flex justify-center items-center px-10 py-2  mx-[2px] transition-all duration-500 ${
//                   id == 0 ? "rounded-l-lg" : null
//                 } ${id == 4 ? "rounded-r-lg" : null}`}
//                 onClick={() => {
//                   setActiveMenu(id);
//                   dispatch(setActiveQuestionNumber(id * 10 + 1));
//                 }}
//               >
//                 {element}
//               </div>
//             ))}
//           </div>
//           <div className="w-[94%] mt-8 m-auto flex justify-between items-center">
//             <div className="w-[72%] h-[72vh] px-14 bg-[#FFFFFF] backdrop-filter backdrop-blur-[6px] rounded-md bg-opacity-30 z-10 relative">
//               <div className="overflow-y-auto h-[calc(100%-80px)]">
//                 <h1 className="text-2xl sm:text-3xl font-medium py-6 font-text-me-one text-gray-500">
//                   Question-{allQuestions[activeQuestionNumber - 1].quesId % 100}
//                 </h1>
//                 <hr className="border-t border-gray-300" />
//                 <h1 className="font-extrabold lg:text-lg xl:text-xl md:text-base sm:text-lg py-2 font-text-me-one text-gray-700">
//                   <pre className="w-full sm:w-3/4 whitespace-pre-wrap break-words leading-6">
//                     {allQuestions[activeQuestionNumber - 1]?.question}
//                   </pre>
//                 </h1>
//                 {allQuestions[activeQuestionNumber - 1]?.options.map(
//                   (i, id) => (
//                     <div key={id} className="my-4 cursor-pointer">
//                       <input
//                         type="radio"
//                         id={`opt${activeQuestionNumber}-${id}`}
//                         checked={
//                           allQuestions[activeQuestionNumber - 1].recordedAns !=
//                           0
//                             ? answer !== ""
//                               ? answer === i.desc
//                               : allQuestions[activeQuestionNumber - 1]
//                                   .recordedAns === i.id
//                             : answer === i.desc
//                         }
//                         onChange={() => {
//                           setAnswer(i.desc);
//                         }}
//                         name={`opt${activeQuestionNumber}`}
//                       />
//                       <label
//                         className="ml-2 text-[16px] sm:text-[17px] md:text-lg lg:text-xl  font-normal cursor-pointer font-text-me-one text-gray-700"
//                         htmlFor={`opt${activeQuestionNumber}-${id}`}
//                       >
//                         {i.desc}
//                       </label>
//                     </div>
//                   )
//                 )}
//               </div>
//               <div className="absolute bottom-7">
//                 <button
//                   className={`bg-purple-600 w-fit mx-2 rounded-xl px-4 py-[10px] text-white font-medium ${
//                     loadingButton && loadingButton !== "MR"
//                       ? "opacity-50 cursor-not-allowed"
//                       : ""
//                   }`}
//                   onClick={() => !loadingButton && buttonHandler("MR")}
//                   disabled={loadingButton !== null && loadingButton !== "MR"}
//                 >
//                   {loadingButton === "MR" ? (
//                     <Spinner color="white" />
//                   ) : (
//                     "Mark for Review & Next"
//                   )}
//                 </button>

//                 <button
//                   className={`bg-[#00C289] w-[135px] mx-2 rounded-xl px-4 py-[10px] text-white font-medium ${
//                     loadingButton && loadingButton !== "A"
//                       ? "opacity-50 cursor-not-allowed"
//                       : ""
//                   }`}
//                   onClick={() => !loadingButton && buttonHandler("A")}
//                   disabled={loadingButton !== null && loadingButton !== "A"}
//                 >
//                   {loadingButton === "A" ? (
//                     <Spinner color="white" />
//                   ) : (
//                     "Save & Next"
//                   )}
//                 </button>

//                 <button
//                   className={`bg-[#FF0000] w-[135px] mx-2 rounded-xl px-4 py-[10px] text-white font-medium ${
//                     loadingButton && loadingButton !== "NA"
//                       ? "opacity-50 cursor-not-allowed"
//                       : ""
//                   }`}
//                   onClick={() => !loadingButton && buttonHandler("NA")}
//                   disabled={loadingButton !== null && loadingButton !== "NA"}
//                 >
//                   {loadingButton === "NA" ? <Spinner color="white" /> : "Skip"}
//                 </button>

//                 <button
//                   className={`bg-white outline outline-1 outline-black mx-2 rounded-xl px-4 py-[10px] text-sm text-black font-medium ${
//                     loadingButton && loadingButton !== "clear"
//                       ? "opacity-50 cursor-not-allowed"
//                       : ""
//                   }`}
//                   onClick={() => !loadingButton && buttonHandler("clear")}
//                   disabled={loadingButton !== null && loadingButton !== "clear"}
//                 >
//                   {loadingButton === "clear" ? (
//                     <Spinner color="black" />
//                   ) : (
//                     "Clear Response"
//                   )}
//                 </button>
//               </div>
//             </div>

//             <div className="w-[25%] h-[72vh] bg-[#FFFFFF] backdrop-filter backdrop-blur-[6px] rounded-md bg-opacity-30 z-10 flex flex-col justify-center items-center">
//               <div className="w-[90%] outline outline-3 outline-[#546CFF] mb-3 text-2xl text-center rounded-lg font-bold text-[#546CFF] p-2">
//                 Questions
//               </div>
//               <div className="flex w-[90%] justify-around flex-wrap mt-2 h-[44vh] overflow-y-scroll">
//                 {allQuestions.map((element, id) => {
//                   if (Math.floor(element.quesId / 100) - 1 == activeMenu)
//                     return (
//                       <div key={id} onClick={() => setAnswer("")}>
//                         <QuesNoCard
//                           display={element.quesId}
//                           id={id}
//                           state={id == 0 ? "V" : "UV"}
//                         />
//                       </div>
//                     );
//                 })}
//               </div>
//               <button
//                 className={`${
//                   loadingButton === null ? "bg-[#3c4dbb]" : "bg-[#9ea9f0]"
//                 } w-[80%] mt-6 mx-2 rounded-xl px-4 py-[10px] text-white font-medium`}
//                 onClick={() => router.push("/confirmation")}
//                 disabled={loadingButton !== null}
//               >
//                 Submit
//               </button>
//             </div>
//           </div>
//           <Image
//             src="./icons/bg_logo.svg"
//             alt="bgLogo"
//             priority
//             width={10}
//             height={10}
//             className="absolute z-0 top-[57%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-[25%]"
//           />
//         </div>
//       ) : (
//         <div className="flex justify-center items-center w-full h-screen text-xl font-bold">
//           Please do the Full Screen Mode to Start!
//         </div>
//       )}
//     </div>
//   );
// }
