import QuestionTabs from "@/components/exam/questions/QuestionTabs";
import ActionButtons from "@/components/exam/questions/ActionButtons";
import OptionsList from "@/components/exam/questions/OptionsList";

export default function Questions() {
  return (
    <section
      className="w-[65%] md:w-[75%] flex-1 p-2 rounded-3xl 
        bg-white/5 backdrop-blur-[6px] border border-white/10
        shadow-inner shadow-black/20 h-[100%] flex gap-2"
    >
      <div className="flex flex-col w-1/2 gap-4">
        {/* Top: Question Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Rendered content like description, code block, or image will go here */}
        </div>

        <QuestionTabs />
      </div>

      {/* Separator Line */}
      <div className="w-[1px] bg-white/30 rounded-full" />

      <div className="flex flex-col w-1/2 gap-4 h-[100%]">
        <OptionsList />
        <ActionButtons />
      </div>
    </section>
  );
}
