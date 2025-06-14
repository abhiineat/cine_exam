import Image from "next/image";

export default function Header() {
  return (
    <header
      className="relative z-10 w-[98%] mx-auto
        rounded-full px-8 py-3 flex justify-between items-center
        backdrop-blur-[5px] border border-neutral-800 bg-neutral-800/50"
    >
      <div className="flex items-center gap-4">
        <div>
          <Image
            src="/icons/csi_logo.svg"
            alt="CSI Logo"
            width={24}
            height={24}
          />
        </div>
        <h1 className="text-2xl font-semibold tracking-wide text-white drop-shadow-sm">
          CSI Exam Portal
        </h1>
      </div>

      {/* Right: Timer */}
      <div
        className="flex items-center justify-center px-5 py-2
        rounded-full bg-white/10 backdrop-blur-lg
        border border-white/15
        shadow-inner shadow-black/20"
      >
        <span className="text-xl font-mono text-gray-300 tracking-wide">
          00:42:17
        </span>
      </div>
    </header>
  );
}
