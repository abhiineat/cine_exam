export default function QuestionNavigator() {
  return (
    <>
      <section
        className="w-[30%] md:w-[20%] shrink-0 p-4 h-[100%] rounded-2xl
          bg-white/5 backdrop-blur-[6px] border border-white/10
          shadow-inner shadow-black/20 overflow-auto"
      >
        <div className="grid grid-cols-3 gap-3 overflow-auto h-[85%]">
          {Array.from({ length: 20 }, (_, i) => (
            <button
              key={i + 1}
              className="w-14 h-14 rounded-full text-lg font-medium text-gray-300 hover:scale-105 
                backdrop-blur-xl transition-all cursor-pointer"
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          disabled={false} 
          className="mt-6 w-full py-3 text-lg font-semibold rounded-full transition-all
    backdrop-blur-xl border 
    disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-white/5 disabled:border-white/10
    text-white bg-gradient-to-br from-blue-500/30 to-blue-800/40 border-blue-400/30
    shadow-md shadow-blue-900/30
    hover:from-blue-500/30 hover:to-blue-900/40 hover:shadow-lg hover:scale-[1.02]
    disabled:hover:scale-100"
        >
          Submit
        </button>
      </section>
    </>
  );
}
