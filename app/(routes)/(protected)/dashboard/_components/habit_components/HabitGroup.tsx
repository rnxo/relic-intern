"use client";

import { Habit } from "@/app/features/habit/habit.type";
import { HabitItem } from "./HabitItem";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function HabitGroup({ title, habits }: { title: string, habits: Habit[] }) {
    const [isOpen, setIsOpen] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // TODO: SSRハイドレーション不一致の回避策。別手段への置き換えを検討
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted || habits.length === 0) return null;

    return (
        <section className="space-y-3" aria-label={`${title}の習慣グループ`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-lumi-primary rounded-lg min-h-[44px] px-1"
                aria-expanded={isOpen}
                aria-controls={`habit-group-${title}`}
            >
                <motion.div
                    animate={{ rotate: isOpen ? 0 : -90 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                    <ChevronDown
                        className="text-lumi-primary group-hover:text-lumi-primary-hover transition-colors duration-200"
                        size={20}
                        aria-hidden="true"
                    />
                </motion.div>
                <div className="flex items-baseline gap-3">
                    <h2 className="text-base sm:text-lg font-bold text-lumi-fg/90 tracking-wide group-hover:text-lumi-fg transition-colors duration-200">
                        {title}
                    </h2>
                    <span className="text-xs font-medium text-lumi-muted bg-lumi-surface px-2 py-0.5 rounded-full border border-lumi-border/50">
                        {habits.length} tasks
                    </span>
                </div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        id={`habit-group-${title}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-2.5 pb-2 pt-1">
                            {habits.map((habit) => (
                                <HabitItem habit={habit} key={habit.id} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
