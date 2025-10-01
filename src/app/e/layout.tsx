"use client";

import { useEffect, useRef, useState } from "react";
import { useSocketStore } from "@/stores/socketstore";
import BackgroundGridPattern from "@/components/ui/BackgroundGridPattern";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import ScreenTooSmall from "@/components/error/FullScreen";

const MAX_TAB_SWITCHES = 8;

interface FullscreenDocument extends Document {
    webkitFullscreenElement?: Element;
    mozFullScreenElement?: Element;
    msFullscreenElement?: Element;

    webkitExitFullscreen?: () => Promise<void>;
    mozCancelFullScreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
}

interface FullscreenElement extends HTMLElement {
    webkitRequestFullscreen?: () => Promise<void>;
    mozRequestFullScreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
}


export default function ExamLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const closeSocket = useSocketStore((s) => s.closeSocket);
    const socket = useSocketStore((s) => s.socket);

    const [isFullscreen, setIsFullscreen] = useState(true);
    const [isScreenTooSmall, setIsScreenTooSmall] = useState(false);
    const tabSwitchCountRef = useRef(0);

    useEffect(() => {
        return () => closeSocket();
    }, [closeSocket]);

    useEffect(() => {
        const checkFullscreen = () => {
            const doc = document as FullscreenDocument;
            const fullscreen =
                doc.fullscreenElement ||
                doc.webkitFullscreenElement ||
                doc.mozFullScreenElement ||
                doc.msFullscreenElement;

            setIsFullscreen(!!fullscreen);
        };


        const checkScreenSize = () => {
            setIsScreenTooSmall(window.innerWidth < 1024);
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

        const handleKeyDown = (e: KeyboardEvent) => {
            // Block Meta, Ctrl, Alt entirely
            // if (e.metaKey || e.ctrlKey || e.altKey) {
            //     e.preventDefault();
            //     e.stopPropagation();
            //     toast.error("Modifier keys are disabled during the exam.");
            //     return;
            // }

            // Block Backspace navigation (but allow in inputs/textareas)
            if (
                e.key === "Backspace" &&
                (e.target as HTMLElement).tagName !== "INPUT" &&
                (e.target as HTMLElement).tagName !== "TEXTAREA"
            ) {
                e.preventDefault();
                toast.error("Back navigation is disabled during the exam.");
                return;
            }

            // Block F12 (DevTools)
            if (e.key === "F12") {
                e.preventDefault();
                toast.error("DevTools are disabled during the exam.");
                return;
            }

            // Block Cmd+← / Cmd+→ or Alt+← / Alt+→
            if (
                (e.key === "ArrowLeft" || e.key === "ArrowRight") &&
                (e.metaKey || e.altKey)
            ) {
                e.preventDefault();
                toast.error("Back/forward navigation is disabled.");
                return;
            }
        };

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            toast.error("Right click is disabled during the exam.");
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

        const blockHistoryNav = () => {
            history.pushState(null, "", window.location.href);
        };
        window.addEventListener("popstate", blockHistoryNav);
        blockHistoryNav();

        document.addEventListener("fullscreenchange", checkFullscreen);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        document.addEventListener("keydown", handleKeyDown, true);
        document.addEventListener("contextmenu", handleContextMenu);
        window.addEventListener("resize", checkScreenSize);

        checkFullscreen();
        checkScreenSize();

        return () => {
            window.removeEventListener("popstate", blockHistoryNav);
            document.removeEventListener("fullscreenchange", checkFullscreen);
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
            document.removeEventListener("keydown", handleKeyDown, true);
            document.removeEventListener("contextmenu", handleContextMenu);
            window.removeEventListener("resize", checkScreenSize);
        };
    }, [socket]);

    const handleEnterFullscreen = () => {
        const el = document.documentElement as FullscreenElement;

        if (el.requestFullscreen) {
            el.requestFullscreen();
        } else if (el.webkitRequestFullscreen) {
            el.webkitRequestFullscreen();
        } else if (el.mozRequestFullScreen) {
            el.mozRequestFullScreen();
        } else if (el.msRequestFullscreen) {
            el.msRequestFullscreen();
        }
    };


    if (isScreenTooSmall) {
        return <ScreenTooSmall />;
    }

    if (!isFullscreen) {
        return (
            <div className="w-full h-screen bg-black text-white flex items-center justify-center relative">
                <BackgroundGridPattern />
                <div className="absolute inset-0 bg-black/80 z-10 flex items-center justify-center px-4">
                    <div className="text-center max-w-lg">
                        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-red-500">
                            Enter fullscreen mode
                        </h1>
                        <p className="text-base sm:text-lg text-red-300 mb-6">
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