import Image from "next/image";

export default function Header({ page }: { page?: string }) {
  return (
    <header
      className="relative z-10 w-full mx-auto 
      rounded-md sm:rounded-full px-4 sm:px-6 md:px-8 py-3
      flex flex-wrap sm:flex-nowrap justify-between items-center gap-4
      backdrop-blur-[5px] border border-neutral-800 bg-neutral-800/50"
    >
      {/* Left Side */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <Image
          src="/icons/csi_logo.svg"
          alt="CSI Logo"
          width={24}
          height={24}
          className="flex-shrink-0"
        />
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-wide text-white drop-shadow-sm truncate">
          CINE |{" "}
          <span className="text-gray-300 text-sm font-normal">
            CSI Recruitment Exam
          </span>
        </h1>
      </div>

      {(page === "submit" || page === "feedback") && (
        <div className="absolute left-1/2 -translate-x-1/2">
          <span className="text-lg sm:text-xl md:text-3xl font-medium text-gray-200 drop-shadow-sm text-center">
            {page === "submit"
              ? "Submission Summary"
              : "🎉 We'd love your feedback!"}
          </span>
        </div>
      )}

      {/* Timer */}
      {(page === "exam" || page === "submit") && (
        <div
          className="px-4 py-1.5 sm:py-2 rounded-md sm:rounded-full 
          bg-white/10 backdrop-blur-lg border border-white/15
          shadow-inner shadow-black/20"
        >
          <span className="text-base sm:text-lg md:text-xl font-mono text-gray-300 tracking-wide">
            00:42:17
          </span>
        </div>
      )}
    </header>
  );
}