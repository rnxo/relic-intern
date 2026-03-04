"use client";

import { Habit } from "@/app/types/habit"
import { HabitItem } from "./HabitItem";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function HabitGroup({ title, habits }: { title: string, habits: Habit[] }) {
    const [isOpen, setIsOpen] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || habits.length === 0) return null;

    return (
        <div className="space-y-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 group cursor-pointer focus:outline-hidden"
            >
                <motion.div
                    animate={{ rotate: isOpen ? 0 : -90 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                    <ChevronDown className="text-[#7aa2f7] group-hover:text-[#7dcfff] transition-colors" size={20} />
                </motion.div>
                <div className="flex items-baseline gap-3">
                    <h3 className="text-xl font-bold text-white/90 tracking-wide group-hover:text-white transition-colors">
                        {title}
                    </h3>
                    <span className="text-xs font-medium text-[#414868] bg-[#24283b] px-2 py-0.5 rounded-full">
                        {habits.length} tasks
                    </span>
                </div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-3 pb-2 pt-1">
                            {habits.map((habit) => (
                                <HabitItem habit={habit} key={habit.id} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
