export default function ActionButtons() {
  return (
    <div className="flex flex-wrap sm:flex-nowrap justify-around items-center gap-4 mt-4">
      {["Clear", "Mark as Read", "Next"].map((label) => {
        let baseStyle =
          "px-4 sm:px-5 py-2 w-full sm:w-40 text-sm font-semibold rounded-full border transition-all text-center";

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
  );
}
