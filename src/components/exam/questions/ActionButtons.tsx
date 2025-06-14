export default function ActionButtons() {
  return (
    <>
      {/* Bottom: Action Buttons */}
      <div className="h-12 flex justify-around items-center gap-4 h[20%]">
        {["Clear", "Mark as Read", "Next"].map((label) => {
          let baseStyle =
            "px-5 py-2 w-40 h-full text-sm font-semibold rounded-full border transition-all";

          let colorStyle = "";
          switch (label) {
            case "Clear":
              colorStyle =
                "bg-neutral-700/40 border-neutral-500 text-white hover:bg-neutral-600/50";
              break;
            case "Mark as Read":
              colorStyle =
                "bg-purple-700/40 border-purple-500 text-purple-200 hover:bg-purple-600/40";
              break;
            case "Next":
              colorStyle =
                "bg-blue-700/40 border-blue-500 text-blue-200 hover:bg-blue-600/40";
              break;
          }

          return (
            <button key={label} className={`${baseStyle} ${colorStyle}`}>
              {label}
            </button>
          );
        })}
      </div>
    </>
  );
}
