"use client";

import { useState } from "react";
import { useReducedMotion, AnimatePresence, type Variants } from "motion/react";
import * as motion from "motion/react-client";
import { IntroStep } from "./steps/IntroStep";
import { Question1Step } from "./steps/Question1Step";
import { Question2Step } from "./steps/Question2Step";
import { Question3Step } from "./steps/Question3Step";
import { CompleteStep } from "./steps/CompleteStep";
import {
    OnboardingAnswers,
    DURATION_SCORE,
    TIME_BLOCK_SCORE,
    HABIT_NAME_TO_KEY,
} from "./types";
import type { TimeBlock } from "@/app/features/habit/habit.type";

const TOTAL_STEPS = 5;

const DEFAULT_HABIT_PRIORITY = { exercise: 0, study: 0, meal: 0, sleeping: 0, others: 0 };

function calcHabitPriority(ranking: string[]): OnboardingAnswers["userBaseHabitPriority"] {
    const result = { ...DEFAULT_HABIT_PRIORITY };
    ranking.forEach((name, index) => {
        const key = HABIT_NAME_TO_KEY[name];
        if (key) result[key] = 5 - index;
    });
    return result;
}

export default function QuestionContent() {
    const reduced = useReducedMotion() ?? false;
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<OnboardingAnswers>({
        avg_task_duration: "",
        peak_performance_time: "morning",
        habit_type_ranking: ["運動", "学習", "食事", "睡眠", "その他"],
        userBaseValue: { x: 0, y: 0 },
        userBaseHabitPriority: { ...DEFAULT_HABIT_PRIORITY },
    });

    const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
    const back = () => setStep((s) => Math.max(s - 1, 0));

    const setDuration = (val: string) => {
        setAnswers((prev) => ({
            ...prev,
            avg_task_duration: val,
            userBaseValue: { ...prev.userBaseValue, x: DURATION_SCORE[val] ?? 0 },
        }));
    };

    const setTimeBlock = (val: TimeBlock) => {
        setAnswers((prev) => ({
            ...prev,
            peak_performance_time: val,
            userBaseValue: { ...prev.userBaseValue, y: TIME_BLOCK_SCORE[val] ?? 0 },
        }));
    };

    const setHabitRanking = (val: string[]) => {
        setAnswers((prev) => ({
            ...prev,
            habit_type_ranking: val,
            userBaseHabitPriority: calcHabitPriority(val),
        }));
    };

    const cardVariants: Variants = {
        hidden: { opacity: 0, y: reduced ? 0 : 24, scale: reduced ? 1 : 0.97 },
        visible: {
            opacity: 1, y: 0, scale: 1,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
        },
    };

    return (
        <>
            <style>{`
                @keyframes lumi-drift-a {
                    from { transform: translate(0,0) scale(1); }
                    to   { transform: translate(50px,70px) scale(1.10); }
                }
                @keyframes lumi-drift-b {
                    from { transform: translate(0,0) scale(1); }
                    to   { transform: translate(-60px,-45px) scale(1.12); }
                }
                @keyframes lumi-drift-c {
                    from { transform: translate(0,0) scale(1); }
                    to   { transform: translate(35px,-55px) scale(1.08); }
                }
            `}</style>

            <div className="fixed inset-0 overflow-hidden flex items-center justify-center p-4 sm:p-8">

                <div className="absolute inset-0" style={{
                    background: "radial-gradient(ellipse 160% 110% at 60% 115%, #07080f 0%, color-mix(in srgb, var(--lumi-base) 80%, #000) 50%, color-mix(in srgb, var(--lumi-base) 90%, #000) 100%)"
                }} />
                <div className="absolute rounded-full pointer-events-none" style={{
                    width: 700, height: 700, top: -250, left: -190,
                    background: "radial-gradient(circle, color-mix(in srgb, var(--lumi-primary) 60%, transparent) 0%, color-mix(in srgb, var(--lumi-primary) 20%, transparent) 42%, transparent 70%)",
                    filter: "blur(72px)", opacity: 0.55,
                    animation: reduced ? "none" : "lumi-drift-a 22s ease-in-out infinite alternate",
                }} />
                <div className="absolute rounded-full pointer-events-none" style={{
                    width: 580, height: 580, bottom: -190, right: -150,
                    background: "radial-gradient(circle, color-mix(in srgb, var(--lumi-secondary) 55%, transparent) 0%, color-mix(in srgb, var(--lumi-secondary) 15%, transparent) 44%, transparent 70%)",
                    filter: "blur(82px)", opacity: 0.52,
                    animation: reduced ? "none" : "lumi-drift-b 26s ease-in-out infinite alternate",
                }} />
                <div className="absolute rounded-full pointer-events-none" style={{
                    width: 400, height: 290, top: "38%", right: "12%",
                    background: "radial-gradient(circle, color-mix(in srgb, var(--lumi-primary-hover) 32%, transparent) 0%, transparent 70%)",
                    filter: "blur(90px)", opacity: 0.28,
                    animation: reduced ? "none" : "lumi-drift-c 32s ease-in-out infinite alternate",
                }} />
                <div className="absolute inset-0 pointer-events-none" style={{
                    backgroundImage: "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/></filter><rect width='256' height='256' filter='url(%23n)' opacity='0.07'/></svg>\")",
                    backgroundSize: "256px 256px", opacity: 0.45,
                }} />
                <div className="absolute inset-0 pointer-events-none" style={{
                    background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, color-mix(in srgb, var(--lumi-base) 85%, #000) 100%)"
                }} />

                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative z-10 w-full max-w-[700px] h-[400px] rounded-2xl overflow-hidden backdrop-blur-2xl flex flex-col"
                    style={{
                        background: "linear-gradient(160deg, color-mix(in srgb, var(--lumi-base) 92%, transparent) 0%, color-mix(in srgb, var(--lumi-base) 88%, transparent) 100%)",
                        border: "1px solid color-mix(in srgb, var(--lumi-primary) 18%, transparent)",
                        boxShadow: [
                            "0 0 0 1px color-mix(in srgb, var(--lumi-primary) 5%, transparent)",
                            "0 48px 96px rgba(0,0,0,0.65)",
                            "0 0 120px color-mix(in srgb, var(--lumi-primary) 8%, transparent)",
                            "0 0 60px color-mix(in srgb, var(--lumi-secondary) 5%, transparent)",
                        ].join(", "),
                    }}
                >
                    <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full pointer-events-none" style={{
                        background: "radial-gradient(circle, color-mix(in srgb, var(--lumi-secondary) 6%, transparent) 0%, transparent 70%)",
                        filter: "blur(40px)", transform: "translate(40%, -40%)",
                    }} />
                    <div className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full pointer-events-none" style={{
                        background: "radial-gradient(circle, color-mix(in srgb, var(--lumi-primary) 8%, transparent) 0%, transparent 70%)",
                        filter: "blur(50px)", transform: "translate(-30%, 30%)",
                    }} />

                    {/* Progress bar */}
                    {step > 0 && step < TOTAL_STEPS - 1 && (
                        <div className="absolute top-0 left-0 right-0 h-0.5" style={{
                            background: "color-mix(in srgb, var(--lumi-border) 20%, transparent)"
                        }}>
                            <motion.div
                                className="h-full"
                                style={{ background: "linear-gradient(90deg, var(--lumi-primary), var(--lumi-secondary))" }}
                                animate={{ width: `${(step / (TOTAL_STEPS - 2)) * 100}%` }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            />
                        </div>
                    )}

                    { /* ステップ管理 */}
                    <div className="flex-1 relative">
                        <AnimatePresence mode="wait">
                            {step === 0 && (
                                <motion.div key="intro" className="absolute inset-0"
                                    initial={{ opacity: 0, x: reduced ? 0 : 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: reduced ? 0 : -20 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <IntroStep onNext={next} />
                                </motion.div>
                            )}
                            {step === 1 && (
                                <motion.div key="q1" className="absolute inset-0"
                                    initial={{ opacity: 0, x: reduced ? 0 : 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: reduced ? 0 : -20 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <Question1Step
                                        value={answers.avg_task_duration || undefined}
                                        onChange={setDuration}
                                        onNext={next}
                                    />
                                </motion.div>
                            )}
                            {step === 2 && (
                                <motion.div key="q2" className="absolute inset-0"
                                    initial={{ opacity: 0, x: reduced ? 0 : 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: reduced ? 0 : -20 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <Question2Step
                                        value={answers.peak_performance_time || undefined}
                                        onChange={setTimeBlock}
                                        onNext={next}
                                        onBack={back}
                                    />
                                </motion.div>
                            )}
                            {step === 3 && (
                                <motion.div key="q3" className="absolute inset-0"
                                    initial={{ opacity: 0, x: reduced ? 0 : 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: reduced ? 0 : -20 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <Question3Step
                                        value={answers.habit_type_ranking}
                                        onChange={setHabitRanking}
                                        onNext={next}
                                        onBack={back}
                                    />
                                </motion.div>
                            )}
                            {step === 4 && (
                                <motion.div key="done" className="absolute inset-0"
                                    initial={{ opacity: 0, x: reduced ? 0 : 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: reduced ? 0 : -20 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <CompleteStep answer={answers} onBack={back} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="absolute bottom-0 left-8 right-8 h-px pointer-events-none" style={{
                        background: "linear-gradient(90deg, transparent, color-mix(in srgb, var(--lumi-primary) 10%, transparent) 50%, transparent)"
                    }} />
                </motion.div>
            </div>
        </>
    );
}
