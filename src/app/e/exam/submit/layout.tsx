"use client";

import { useEffect, useState } from "react";
import BackgroundGridPattern from "@/components/ui/BackgroundGridPattern";
import Header from "@/components/exam/Header";
import { useSocketStore } from "@/stores/socketstore";
import SplashScreen from "@/components/ui/SplashScreen";

export default function ExamSubmitLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [showSplash, setShowSplash] = useState(true);
    const initSocket = useSocketStore((s) => s.initSocket);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
            initSocket();
        }, 1200);

        return () => clearTimeout(timer);
    }, [initSocket]);

    if (showSplash) {
        return (
            <SplashScreen
                title="Crunching your data..."
                subtitle="Almost there"
            />
        );
    }

    return (
        <div className="relative min-h-screen bg-neutral-950 text-white overflow-x-hidden">
            <BackgroundGridPattern />
            <header className="px-4 pt-4">
                <Header page="submit" />
            </header>
            <main className="relative z-10 px-4 pb-10">{children}</main>
        </div>
    );
}