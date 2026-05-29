"use client";

import { motion } from "motion/react";
import { SelectCard } from "@/app/(routes)/(protected)/register-habit/_components/SelectCard";
import type { TimeBlock } from "@/app/features/habit/habit.type";

const TIME_BLOCKS: { value: TimeBlock; label: string; time: string }[] = [
    { value: "morning",  label: "朝方",  time: "6:00 - 10:00" },
    { value: "daytime",  label: "日中",  time: "10:00 - 16:00" },
    { value: "evening",  label: "夕方",  time: "16:00 - 18:00" },
    { value: "night",    label: "夜",    time: "18:00 - 22:00" },
    { value: "midnight", label: "深夜",  time: "22:00 - 25:00" },
];

interface Question2StepProps {
    value: TimeBlock | undefined;
    onChange: (val: TimeBlock) => void;
    onNext: () => void;
    onBack: () => void;
}

export function Question2Step({ value, onChange, onNext, onBack }: Question2StepProps) {
    return (
        <div className="flex flex-col justify-between h-full px-10 pt-10 pb-6">
            <div className="space-y-8 text-left">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <p className="text-[0.75rem] font-semibold text-lumi-muted/40 uppercase tracking-[0.1em] mb-2">質問 2 / 3</p>
                    <h2 className="text-[1.4rem] font-bold text-lumi-fg tracking-tight leading-tight">
                        もっともパフォーマンスが高い時間帯は？
                    </h2>
                    <p className="text-[0.82rem] text-lumi-muted/75 mt-2">
                        集中力や作業効率が最も高い時間帯を選んでください
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                    className="flex gap-2 flex-wrap"
                >
                    {TIME_BLOCKS.map((block) => (
                        <SelectCard
                            key={block.value}
                            type="button"
                            className="border-2 hover:border-lumi-primary flex-1 min-w-[80px]"
                            isSelected={value === block.value}
                            onClick={() => onChange(block.value)}
                        >
                            <div className="flex flex-col items-center justify-center gap-1">
                                <span className="text-base font-bold text-lumi-primary">{block.label}</span>
                                <span className="text-[0.65rem] text-lumi-primary/40">{block.time}</span>
                            </div>
                        </SelectCard>
                    ))}
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-between"
            >
                <button
                    onClick={onBack}
                    className="px-8 py-3 rounded-xl text-sm font-semibold text-lumi-muted/60 border border-lumi-border/30 hover:border-lumi-primary/40 transition-all duration-200 active:scale-[0.98]"
                >
                    戻る
                </button>
                <button
                    onClick={onNext}
                    disabled={!value}
                    className="px-8 py-3 rounded-xl text-sm font-semibold text-lumi-base transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                        background: "linear-gradient(135deg, var(--lumi-primary) 0%, var(--lumi-secondary) 55%, var(--lumi-primary-hover) 100%)",
                        boxShadow: "0 4px 20px color-mix(in srgb, var(--lumi-primary) 35%, transparent)",
                    }}
                >
                    次へ
                </button>
            </motion.div>
        </div>
    );
}
