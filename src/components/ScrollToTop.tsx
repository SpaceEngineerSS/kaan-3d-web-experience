"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

export function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 600);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollUp = useCallback(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.25 }}
                    onClick={scrollUp}
                    className="fixed bottom-20 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition-colors duration-300 hover:border-[#00d4ff]/30 md:bottom-6 md:right-6 md:h-11 md:w-11"
                    style={{
                        background: "rgba(0, 0, 0, 0.6)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                    }}
                    aria-label="Scroll to top"
                >
                    <ChevronUp className="h-5 w-5 text-white/60" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
