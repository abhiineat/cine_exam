"use client";

import { useEffect, useState } from "react";
import { useSocketStore } from "@/stores/socketstore";
import BackgroundGridPattern from "@/components/ui/BackgroundGridPattern";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

const MAX_TAB_SWITCHES = 8;

export default function ExamLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const initSocket = useSocketStore((s) => s.initSocket);
    const closeSocket = useSocketStore((s) => s.closeSocket);
    const socket = useSocketStore((s) => s.socket);

    const [isFullscreen, setIsFullscreen] = useState(true);
    const [tabSwitchCount, setTabSwitchCount] = useState(0);

    useEffect(() => {
        initSocket();
        return () => closeSocket();
    }, []);

    useEffect(() => {
        const checkFullscreen = () => {
            const fullscreen =
                document.fullscreenElement ||
                (document as any).webkitFullscreenElement ||
                (document as any).mozFullScreenElement ||
                (document as any).msFullscreenElement;

            setIsFullscreen(!!fullscreen);
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setTabSwitchCount((prev) => {
                    const updated = prev + 1;

                    setTimeout(() => {
                        toast.warning(
                            `You switched tabs ${updated}/${MAX_TAB_SWITCHES}`,
                            {
                                description:
                                    updated >= MAX_TAB_SWITCHES
                                        ? "You will now be removed from the exam."
                                        : "Don't switch tabs again or you'll be disqualified.",
                            }
                        );
                    }, 300); // Wait a bit for browser to resume rendering

                    if (updated >= MAX_TAB_SWITCHES) {
                        endExam("Too many tab switches");
                    }

                    return updated;
                });
            }
        };


        const endExam = (reason: string) => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(
                    JSON.stringify({
                        event: "end-exam",
                        dismissalReason: reason,
                    })
                );
            }

            setTimeout(() => {
                signOut({ callbackUrl: "/" });
            }, 2000);
        };

        document.addEventListener("fullscreenchange", checkFullscreen);
        document.addEventListener("webkitfullscreenchange", checkFullscreen);
        document.addEventListener("mozfullscreenchange", checkFullscreen);
        document.addEventListener("msfullscreenchange", checkFullscreen);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        checkFullscreen();

        return () => {
            document.removeEventListener("fullscreenchange", checkFullscreen);
            document.removeEventListener(
                "webkitfullscreenchange",
                checkFullscreen
            );
            document.removeEventListener(
                "mozfullscreenchange",
                checkFullscreen
            );
            document.removeEventListener("msfullscreenchange", checkFullscreen);
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, [socket]);

    const handleEnterFullscreen = () => {
        const el = document.documentElement;
        if (el.requestFullscreen) el.requestFullscreen();
        else if ((el as any).webkitRequestFullscreen)
            (el as any).webkitRequestFullscreen();
        else if ((el as any).mozRequestFullScreen)
            (el as any).mozRequestFullScreen();
        else if ((el as any).msRequestFullscreen)
            (el as any).msRequestFullscreen();
    };

    if (!isFullscreen) {
        return (
            <div className="w-full h-screen bg-black text-white flex items-center justify-center relative">
                <BackgroundGridPattern />
                <div className="absolute inset-0 bg-black/80 z-10 flex items-center justify-center px-4">
                    <div className="text-center max-w-lg">
                        <h1 className="text-xl sm:text-2xl font-semibold mb-4">
                            Please enter fullscreen mode
                        </h1>
                        <p className="text-base sm:text-lg text-gray-300 mb-6">
                            The exam requires fullscreen mode to maintain
                            integrity. Click the button below to continue.
                        </p>
                        <button
                            onClick={handleEnterFullscreen}
                            className="bg-white text-black px-5 py-2 rounded-md font-medium hover:bg-gray-200 transition"
                        >
                            Go Fullscreen
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}