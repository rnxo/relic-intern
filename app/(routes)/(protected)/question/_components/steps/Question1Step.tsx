"use client";

import { motion } from "motion/react";
import { SelectCard } from "@/app/(routes)/(protected)/register-habit/_components/SelectCard";

const DURATION_OPTIONS = [
    { label: "30分未満", value: "under30" },
    { label: "60分未満", value: "under60" },
    { label: "90分未満", value: "under90" },
    { label: "120分未満", value: "under120" },
    { label: "120分以上", value: "over120" },
];

interface Question1StepProps {
    value: string | undefined;
    onChange: (val: string) => void;
    onNext: () => void;
}

export function Question1Step({ value, onChange, onNext }: Question1StepProps) {
    return (
        <div className="flex flex-col justify-between h-full px-10 pt-10 pb-6">
            <div className="space-y-8 text-left">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <p className="text-[0.75rem] font-semibold text-lumi-muted/40 uppercase tracking-[0.1em] mb-2">質問 1 / 3</p>
                    <h2 className="text-[1.4rem] font-bold text-lumi-fg tracking-tight leading-tight">
                        タスクの平均的な所要時間は？
                    </h2>
                    <p className="text-[0.82rem] text-lumi-muted/75 mt-2">
                        あなたが取り組む習慣の平均的な時間を選んでください
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                    className="flex items-center justify-between gap-2"
                >
                    {DURATION_OPTIONS.map((opt) => (
                        <SelectCard
                            key={opt.value}
                            type="button"
                            className="border-2 hover:border-lumi-primary flex-1"
                            isSelected={value === opt.value}
                            onClick={() => onChange(opt.value)}
                        >
                            <div className="flex flex-col items-center justify-center">
                                <span className="text-sm font-bold text-lumi-primary leading-tight">{opt.label}</span>
                            </div>
                        </SelectCard>
                    ))}
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-end"
            >
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
