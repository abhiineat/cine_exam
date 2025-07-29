"use client";

import { useEffect, useRef, useState } from "react";
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
    const tabSwitchCountRef = useRef(0); // ← useRef instead of useState

    useEffect(() => {
        initSocket();
        return () => closeSocket();
    }, [initSocket, closeSocket]);

    useEffect(() => {
        const checkFullscreen = () => {
            const fullscreen =
                document.fullscreenElement ||
                (document as Document & { webkitFullscreenElement?: Element })
                    .webkitFullscreenElement ||
                (document as Document & { mozFullScreenElement?: Element })
                    .mozFullScreenElement ||
                (document as Document & { msFullscreenElement?: Element })
                    .msFullscreenElement;

            setIsFullscreen(!!fullscreen);
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                tabSwitchCountRef.current += 1;
                const updated = tabSwitchCountRef.current;

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
                }, 300);

                if (updated >= MAX_TAB_SWITCHES) {
                    endExam("Too many tab switches");
                }
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
        else if (
            (el as HTMLElement & { webkitRequestFullscreen?: () => void })
                .webkitRequestFullscreen
        )
            (
                el as HTMLElement & { webkitRequestFullscreen: () => void }
            ).webkitRequestFullscreen();
        else if (
            (el as HTMLElement & { mozRequestFullScreen?: () => void })
                .mozRequestFullScreen
        )
            (
                el as HTMLElement & { mozRequestFullScreen: () => void }
            ).mozRequestFullScreen();
        else if (
            (el as HTMLElement & { msRequestFullscreen?: () => void })
                .msRequestFullscreen
        )
            (
                el as HTMLElement & { msRequestFullscreen: () => void }
            ).msRequestFullscreen();
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