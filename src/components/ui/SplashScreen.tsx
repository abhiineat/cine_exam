"use client";

import { motion } from "framer-motion";
import BackgroundGridPattern from "@/components/ui/BackgroundGridPattern";

export default function SplashScreen({
    title = "Loading...",
    subtitle = "Please wait a moment!",
}: {
    title?: string;
    subtitle?: string;
}) {
    return (
        <div className="h-screen w-screen bg-neutral-950 flex flex-col items-center justify-center text-white relative">
            <BackgroundGridPattern />
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex flex-col items-center gap-6 relative z-10"
            >
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <img
                        src="/icons/csi_logo.svg"
                        alt="CSI Logo"
                        className="w-20 h-20"
                    />
                </motion.div>

                <p className="text-gray-400 text-2xl text-center">
                    <span className="text-white font-semibold">
                        Computer Society of India - AKGEC Chapter
                    </span>
                </p>

                <h1 className="text-lg font-semibold text-center">
                    {title}
                </h1>
                <p className="text-gray-400 text-center">{subtitle}</p>
            </motion.div>
        </div>
    );
}