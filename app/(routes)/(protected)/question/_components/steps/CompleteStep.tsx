"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { completeOnboarding } from "@/app/auth/actions";

interface CompleteStepProps {
    onBack: () => void;
}

export function CompleteStep({ onBack }: CompleteStepProps) {
    const [loading, setLoading] = useState(false);

    const handleComplete = async () => {
        setLoading(true);
        await completeOnboarding();
    };

    return (
        <div className="flex flex-col justify-between h-full px-10 py-6">
            <div className="flex flex-col items-center justify-center flex-1 space-y-4 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <h2 className="text-[1.6rem] font-bold text-lumi-fg tracking-tight leading-tight">
                        ありがとうございます！
                    </h2>
                    <p className="text-[0.85rem] text-lumi-muted/50 mt-3 leading-relaxed">
                        Lumiがあなたに合った体験を用意します。
                        <br />
                        一緒に習慣を育てていきましょう。
                    </p>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex justify-between"
            >
                <button
                    onClick={onBack}
                    disabled={loading}
                    className="px-8 py-3 rounded-xl text-sm font-semibold text-lumi-muted/60 border border-lumi-border/30 hover:border-lumi-primary/40 transition-all duration-200 active:scale-[0.98] disabled:opacity-40"
                >
                    戻る
                </button>
                <button
                    onClick={handleComplete}
                    disabled={loading}
                    className="px-8 py-3 rounded-xl text-sm font-semibold text-lumi-base transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
                    style={{
                        background: "linear-gradient(135deg, var(--lumi-primary) 0%, var(--lumi-secondary) 55%, var(--lumi-primary-hover) 100%)",
                        boxShadow: "0 4px 20px color-mix(in srgb, var(--lumi-primary) 35%, transparent)",
                    }}
                >
                    {loading ? "保存中..." : "ダッシュボードへ"}
                </button>
            </motion.div>
        </div>
    );
}
