"use client";

import { motion } from "motion/react";

interface IntroStepProps {
    onNext: () => void;
}

export function IntroStep({ onNext }: IntroStepProps) {
    return (
        <div className="flex flex-col justify-between h-full px-10 py-6">
            <div className="flex flex-col items-center justify-center flex-1 text-center mt-12">
                <motion.h1
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-[1.6rem] font-bold text-lumi-fg tracking-tight leading-tight"
                >
                    はじめる前に、いくつか質問させてください
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                    className="text-[0.85rem] text-lumi-muted/75 mt-3 leading-relaxed"
                >
                    あなたのことを知ることで、Lumiはより良いサポートができます。
                    <br />
                    全部で3つの質問です。
                </motion.p>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-end"
            >
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
