import Image from "next/image";

export default function Header() {
  return (
    <header
      className="relative z-10 w-full mx-auto 
      rounded-md sm:rounded-full px-4 sm:px-6 md:px-8 py-3
      flex flex-wrap sm:flex-nowrap justify-between items-center gap-4
      backdrop-blur-[5px] border border-neutral-800 bg-neutral-800/50"
    >
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <Image
          src="/icons/csi_logo.svg"
          alt="CSI Logo"
          width={24}
          height={24}
          className="flex-shrink-0"
        />
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-wide text-white drop-shadow-sm truncate">
          CSI Exam Portal
        </h1>
      </div>

      {/* Right: Timer */}
      <div
        className="px-4 py-1.5 sm:py-2 rounded-md sm:rounded-full 
        bg-white/10 backdrop-blur-lg border border-white/15
        shadow-inner shadow-black/20"
      >
        <span className="text-base sm:text-lg md:text-xl font-mono text-gray-300 tracking-wide">
          00:42:17
        </span>
      </div>
    </header>
  );
}
