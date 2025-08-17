import Link from "next/link";
import { motion } from "framer-motion";
import BackgroundGridPattern from "@/components/ui/BackgroundGridPattern";

export default function NotFound() {
    return (
        <div className="h-screen w-screen bg-neutral-950 flex items-center justify-center text-white relative">
            <BackgroundGridPattern />
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center text-center px-6"
            >
                <h1 className="text-6xl sm:text-8xl font-bold mb-4">404</h1>
                <p className="text-lg sm:text-xl text-gray-400 mb-8">
                    Oops! The page you’re looking for doesn’t exist.
                </p>
                <Link
                    href="/"
                    className="px-6 py-3 rounded-xl bg-white text-black font-medium hover:bg-gray-200 transition"
                >
                    Go Back Home
                </Link>
            </motion.div>
        </div>
    );
}
