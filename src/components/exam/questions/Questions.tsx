import QuestionTabs from "@/components/exam/questions/QuestionTabs";
import ActionButtons from "@/components/exam/questions/ActionButtons";
import OptionsList from "@/components/exam/questions/OptionsList";

export default function Questions({ loading }: { loading: boolean }) {
  return (
    <section
      className="w-full md:w-[85%] lg:w-[80%] max-h-[70vh] p-2 rounded-lg
        bg-white/5 backdrop-blur-[6px] border border-white/10
        shadow-inner shadow-black/20 flex flex-col md:flex-row gap-4"
    >
      {/* Left Column */}
      <div className="flex flex-col w-full md:w-1/2 gap-4 flex-1">
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-4 rounded-2xl border border-white/10 bg-white/5">
            {/* Question content goes here */}
          </div>
        </div>
        <QuestionTabs />
      </div>

      {/* Separator */}
      <div className="hidden md:block w-[1px] bg-white/30 rounded-full" />

      {/* Right Column */}
      <div className="flex flex-col w-full md:w-1/2 gap-4 flex-1">
        <div className="flex-1 overflow-hidden">
          <OptionsList />
        </div>
        <ActionButtons />
      </div>
    </section>
  );
}
