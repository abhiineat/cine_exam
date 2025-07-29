"use client";

import { useEffect } from "react";
import { useSocketStore } from "@/stores/socketstore";

export default function ExamLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const initSocket = useSocketStore((s) => s.initSocket);
    const closeSocket = useSocketStore((s) => s.closeSocket);

    useEffect(() => {
        initSocket();
        return () => closeSocket();
    }, []);

    return <>{children}</>;
}