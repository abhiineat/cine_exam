// components/exam/skeletons/QuestionSkeleton.tsx
export default function QuestionSkeleton() {
  return (
    <section
      className="mt-10 lg:h-[65vh] rounded-lg bg-neutral-900 border border-white/10 shadow-inner shadow-black/20 
      flex flex-col md:flex-row gap-4 p-4 animate-pulse"
    >
      {/* Left Column */}
      <div className="flex flex-col w-full md:w-1/2 gap-4 flex-1">
        <div className="flex-1 overflow-hidden">
          <div className="h-6 w-1/3 bg-white/10 rounded mb-4" />
          <div className="h-4 w-full bg-white/10 rounded mb-2" />
          <div className="h-4 w-[90%] bg-white/10 rounded mb-2" />
          <div className="h-4 w-[80%] bg-white/10 rounded mb-2" />
          <div className="h-4 w-[70%] bg-white/10 rounded mb-2" />
          <div className="h-[100px] bg-white/5 rounded-lg mt-4" />
        </div>
      </div>

      {/* Vertical Separator */}
      <div className="hidden md:block w-[1px] bg-white/10 rounded-full" />

      {/* Right Column */}
      <div className="flex flex-col w-full md:w-1/2 gap-4 flex-1">
        <div className="flex-1 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-full bg-white/10 rounded-lg" />
          ))}
        </div>
        <div className="flex gap-2 mt-auto">
          <div className="h-10 w-1/2 bg-white/10 rounded" />
          <div className="h-10 w-1/2 bg-white/10 rounded" />
        </div>
      </div>
    </section>
  );
}
