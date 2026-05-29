"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Reorder } from "motion/react";
import { HabitTypeIcon } from "@/app/(routes)/(protected)/register-habit/_components/HabitTypeIcons";

const DEFAULT_RANKING = ["運動", "学習", "食事", "睡眠", "その他"];

interface Question3StepProps {
    value: string[];
    onChange: (val: string[]) => void;
    onNext: () => void;
    onBack: () => void;
}

export function Question3Step({ value, onChange, onNext, onBack }: Question3StepProps) {
    const [items, setItems] = useState<string[]>(
        value.length === DEFAULT_RANKING.length ? value : [...DEFAULT_RANKING]
    );

    const handleReorder = (next: string[]) => {
        setItems(next);
        onChange(next);
    };

    return (
        <div className="flex flex-col justify-between h-full px-10 pt-10 pb-6">
            <div className="space-y-2 text-left">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <p className="text-[0.75rem] font-semibold text-lumi-muted/40 uppercase tracking-[0.1em] mb-2">質問 3 / 3</p>
                    <h2 className="text-[1.4rem] font-bold text-lumi-fg tracking-tight leading-tight">
                        習慣化したい系統を順番に並べてください
                    </h2>
                    <p className="text-[0.82rem] text-lumi-muted/75 mt-2">
                        ドラッグして1位〜5位の順に並び替えてください
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                    className="overflow-y-auto max-h-[180px] pr-1"
                >
                    <Reorder.Group
                        axis="y"
                        values={items}
                        onReorder={handleReorder}
                        className="space-y-1.5 list-none"
                    >
                        {items.map((name, i) => (
                            <Reorder.Item
                                key={name}
                                value={name}
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-grab active:cursor-grabbing select-none"
                                style={{
                                    background: "color-mix(in srgb, var(--lumi-surface) 30%, transparent)",
                                    border: "1px solid color-mix(in srgb, var(--lumi-primary) 18%, transparent)",
                                }}
                                whileDrag={{
                                    scale: 1.03,
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                                    zIndex: 10,
                                }}
                            >
                                <span className="text-[0.75rem] font-bold text-lumi-primary/40 w-6 text-center shrink-0">
                                    {i + 1}位
                                </span>
                                <HabitTypeIcon type={name} size={28} />
                                <span className="text-sm font-semibold text-lumi-fg flex-1">{name}</span>
                                <span className="text-lumi-muted/30 text-lg shrink-0">⠿</span>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
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
                    className="px-8 py-3 rounded-xl text-sm font-semibold text-lumi-base transition-all duration-200 active:scale-[0.98]"
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
