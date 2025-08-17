import BackgroundGridPattern from "@/components/ui/BackgroundGridPattern";

export default function ScreenTooSmall() {
    return (
        <div className="w-full h-screen bg-black text-white flex items-center justify-center relative">
            <BackgroundGridPattern />
            <div className="absolute inset-0 bg-black/80 z-10 flex items-center justify-center px-4">
                <div className="text-center max-w-lg">
                    <h1 className="text-xl sm:text-2xl font-semibold mb-4 text-red-500">
                        Screen Size Too Small
                    </h1>
                    <p className="text-base sm:text-lg text-red-300 mb-6">
                        The exam can only be taken on larger screens
                        (desktop/laptop). Please resize your window or switch to
                        a supported device.
                    </p>
                </div>
            </div>
        </div>
    );
}
