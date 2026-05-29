"use client"

import { useState, useId } from "react";
import { signup } from "@/app/auth/actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { motion, useReducedMotion, AnimatePresence, type Variants } from "motion/react";
import { validateSignup, hasErrors, translateSignupError, type SignupErrors } from "@/app/lib/authValidation";

type InputData = {
    userName: string;
    email: string;
    password: string;
};
type FormErrors = SignupErrors;

const STARS = [
    { id: 0,  x: 12, y: 8,  size: 1.5, delay: 0,   dur: 4.2 },
    { id: 1,  x: 78, y: 15, size: 1,   delay: 0.8,  dur: 5.1 },
    { id: 2,  x: 35, y: 72, size: 2,   delay: 1.5,  dur: 3.8 },
    { id: 3,  x: 88, y: 55, size: 1,   delay: 0.3,  dur: 6.0 },
    { id: 4,  x: 22, y: 40, size: 1.5, delay: 2.1,  dur: 4.5 },
    { id: 5,  x: 60, y: 88, size: 1,   delay: 0.6,  dur: 5.3 },
    { id: 6,  x: 48, y: 25, size: 2.5, delay: 1.2,  dur: 3.6 },
    { id: 7,  x: 92, y: 30, size: 1,   delay: 1.9,  dur: 7.0 },
    { id: 8,  x: 5,  y: 62, size: 1.5, delay: 0.4,  dur: 4.8 },
    { id: 9,  x: 70, y: 45, size: 1,   delay: 2.5,  dur: 5.5 },
    { id: 10, x: 55, y: 5,  size: 2,   delay: 1.0,  dur: 4.0 },
    { id: 11, x: 30, y: 90, size: 1,   delay: 1.7,  dur: 6.2 },
];

function GoogleIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );
}

type FocusInputProps = {
    id: string;
    type: string;
    value: string;
    placeholder: string;
    onChange: (v: string) => void;
    reduced: boolean;
    hasError?: boolean;
};

function FocusInput({ id, type, value, placeholder, onChange, reduced, hasError }: FocusInputProps) {
    const [focused, setFocused] = useState(false);
    return (
        <div className="relative">
            <motion.div
                className="absolute inset-0 rounded-xl pointer-events-none z-10"
                animate={reduced ? {} : focused ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{
                    boxShadow: hasError
                        ? "0 0 0 2px color-mix(in srgb, #ef4444 45%, transparent)"
                        : "0 0 0 2px color-mix(in srgb, var(--lumi-primary) 45%, transparent), 0 0 20px color-mix(in srgb, var(--lumi-primary) 18%, transparent)",
                    borderRadius: 12,
                }}
            />
            <Input
                id={id}
                type={type}
                value={value}
                placeholder={placeholder}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onChange={(e) => onChange(e.target.value)}
                aria-invalid={hasError}
                className={[
                    "h-auto bg-lumi-surface/50 rounded-xl px-4 py-2.5 text-lumi-fg placeholder:text-lumi-muted/25 focus-visible:ring-0 transition-colors duration-200 relative z-10",
                    hasError
                        ? "border-red-500/50 focus-visible:border-red-500/70"
                        : "border-lumi-border/35 focus-visible:border-lumi-primary/55",
                ].join(" ")}
            />
        </div>
    );
}

function SignUpForm({ reduced }: { reduced: boolean }) {
    const [input, setInput] = useState<InputData>({ userName: "", email: "", password: "" });
    const [errors, setErrors] = useState<FormErrors>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const userNameId = useId();
    const emailId = useId();
    const passwordId = useId();

    const handleChange = (key: keyof InputData, value: string) => {
        setInput((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
        if (serverError) setServerError(null);
    };

    const validate = (): boolean => {
        const next = validateSignup(input);
        setErrors(next);
        return !hasErrors(next);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setServerError(null);
        const userName = input.userName.trim() || "ゲスト";
        const result = await signup(userName, input.email, input.password);
        setLoading(false);
        if (result?.error) {
            setServerError(result.error);
        }
    };

    const labelClass = "text-[0.7rem] font-semibold text-lumi-muted/50 uppercase tracking-[0.1em] mb-1.5 block";
    const errorClass = "mt-1.5 text-[0.72rem] text-red-400/90 flex items-center gap-1";

    return (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
                <Label htmlFor={userNameId} className={labelClass}>ユーザー名</Label>
                <FocusInput
                    id={userNameId} type="text" value={input.userName}
                    placeholder="lumi_user" onChange={(v) => handleChange("userName", v)} reduced={reduced}
                />
            </div>
            <div>
                <Label htmlFor={emailId} className={labelClass}>メールアドレス</Label>
                <FocusInput
                    id={emailId} type="email" value={input.email}
                    placeholder="you@example.com" onChange={(v) => handleChange("email", v)}
                    reduced={reduced} hasError={!!errors.email}
                />
                <AnimatePresence>
                    {errors.email && (
                        <motion.p
                            role="alert"
                            className={errorClass}
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.18 }}
                        >
                            <span aria-hidden="true">✕</span>{errors.email}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
            <div>
                <Label htmlFor={passwordId} className={labelClass}>パスワード</Label>
                <FocusInput
                    id={passwordId} type="password" value={input.password}
                    placeholder="8文字以上" onChange={(v) => handleChange("password", v)}
                    reduced={reduced} hasError={!!errors.password}
                />
                <AnimatePresence>
                    {errors.password && (
                        <motion.p
                            role="alert"
                            className={errorClass}
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.18 }}
                        >
                            <span aria-hidden="true">✕</span>{errors.password}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {serverError && (
                    <motion.div
                        role="alert"
                        className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-[0.8rem]"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            background: "color-mix(in srgb, #ef4444 10%, transparent)",
                            border: "1px solid color-mix(in srgb, #ef4444 28%, transparent)",
                            color: "color-mix(in srgb, #ef4444 88%, white)",
                        }}
                    >
                        <span className="mt-px select-none" aria-hidden="true">⚠</span>
                        <span>{translateSignupError(serverError)}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative overflow-hidden rounded-xl mt-2">
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-auto py-3 rounded-xl text-sm font-semibold text-lumi-base active:scale-[0.98] transition-all duration-200 relative z-10 border-0"
                    style={{
                        background: "linear-gradient(135deg, var(--lumi-primary) 0%, var(--lumi-secondary) 55%, var(--lumi-primary-hover) 100%)",
                        boxShadow: "0 4px 20px color-mix(in srgb, var(--lumi-primary) 35%, transparent), 0 1px 0 rgba(255,255,255,0.15) inset",
                    }}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {loading ? (
                            <motion.span
                                key="loading"
                                initial={reduced ? {} : { opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={reduced ? {} : { opacity: 0 }}
                                className="flex items-center gap-2"
                            >
                                <span className="w-3.5 h-3.5 border-2 border-lumi-base/60 border-t-lumi-base rounded-full animate-spin" />
                                登録中...
                            </motion.span>
                        ) : (
                            <motion.span
                                key="idle"
                                initial={reduced ? {} : { opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={reduced ? {} : { opacity: 0 }}
                            >
                                Lumiをはじめる
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Button>
                {!reduced && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
                        style={{
                            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
                            skewX: -15,
                        }}
                    />
                )}
            </div>
        </form>
    );
}

export default function RegisterContent() {
    const reduced = useReducedMotion() ?? false;

    const cardVariants: Variants = {
        hidden: { opacity: 0, y: reduced ? 0 : 24, scale: reduced ? 1 : 0.97 },
        visible: {
            opacity: 1, y: 0, scale: 1,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
        },
    };
    const leftContainer: Variants = {
        hidden: {},
        visible: { transition: { staggerChildren: reduced ? 0 : 0.1, delayChildren: 0.25 } },
    };
    const leftItem: Variants = {
        hidden: { opacity: 0, y: reduced ? 0 : 12 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
    };
    const rightContainer: Variants = {
        hidden: {},
        visible: { transition: { staggerChildren: reduced ? 0 : 0.07, delayChildren: 0.4 } },
    };
    const rightItem: Variants = {
        hidden: { opacity: 0, x: reduced ? 0 : 10 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
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
                @keyframes lumi-pet-float {
                    0%, 100% { transform: translateY(0px); }
                    50%      { transform: translateY(-8px); }
                }
                @keyframes lumi-ring-pulse {
                    0%, 100% { opacity: 0.55; transform: scale(1);    }
                    50%      { opacity: 0.22; transform: scale(1.08); }
                }
                @keyframes lumi-ring-pulse-slow {
                    0%, 100% { opacity: 0.28; transform: scale(1);    }
                    50%      { opacity: 0.08; transform: scale(1.14); }
                }
            `}</style>

            <div className="fixed inset-0 overflow-hidden flex items-center justify-center p-4 sm:p-8">

                {/* Dark base */}
                <div className="absolute inset-0" style={{
                    background: "radial-gradient(ellipse 160% 110% at 60% 115%, #07080f 0%, color-mix(in srgb, var(--lumi-base) 80%, #000) 50%, color-mix(in srgb, var(--lumi-base) 90%, #000) 100%)"
                }} />

                {/* Blue nebula — top-left */}
                <div className="absolute rounded-full pointer-events-none" style={{
                    width: 700, height: 700, top: -250, left: -190,
                    background: "radial-gradient(circle, color-mix(in srgb, var(--lumi-primary) 60%, transparent) 0%, color-mix(in srgb, var(--lumi-primary) 20%, transparent) 42%, transparent 70%)",
                    filter: "blur(72px)", opacity: 0.55,
                    animation: reduced ? "none" : "lumi-drift-a 22s ease-in-out infinite alternate",
                }} />

                {/* Purple nebula — bottom-right */}
                <div className="absolute rounded-full pointer-events-none" style={{
                    width: 580, height: 580, bottom: -190, right: -150,
                    background: "radial-gradient(circle, color-mix(in srgb, var(--lumi-secondary) 55%, transparent) 0%, color-mix(in srgb, var(--lumi-secondary) 15%, transparent) 44%, transparent 70%)",
                    filter: "blur(82px)", opacity: 0.52,
                    animation: reduced ? "none" : "lumi-drift-b 26s ease-in-out infinite alternate",
                }} />

                {/* Cyan accent — center-right */}
                <div className="absolute rounded-full pointer-events-none" style={{
                    width: 400, height: 290, top: "38%", right: "12%",
                    background: "radial-gradient(circle, color-mix(in srgb, var(--lumi-primary-hover) 32%, transparent) 0%, transparent 70%)",
                    filter: "blur(90px)", opacity: 0.28,
                    animation: reduced ? "none" : "lumi-drift-c 32s ease-in-out infinite alternate",
                }} />

                {/* Grain noise */}
                <div className="absolute inset-0 pointer-events-none" style={{
                    backgroundImage: "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/></filter><rect width='256' height='256' filter='url(%23n)' opacity='0.07'/></svg>\")",
                    backgroundSize: "256px 256px", opacity: 0.45,
                }} />

                {/* Vignette */}
                <div className="absolute inset-0 pointer-events-none" style={{
                    background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, color-mix(in srgb, var(--lumi-base) 85%, #000) 100%)"
                }} />

                {/* ── Main card ── */}
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative z-10 flex flex-col md:flex-row w-full max-w-[860px] rounded-2xl overflow-hidden"
                    style={{
                        border: "1px solid color-mix(in srgb, var(--lumi-primary) 18%, transparent)",
                        boxShadow: [
                            "0 0 0 1px color-mix(in srgb, var(--lumi-primary) 5%, transparent)",
                            "0 48px 96px rgba(0,0,0,0.65)",
                            "0 0 120px color-mix(in srgb, var(--lumi-primary) 8%, transparent)",
                            "0 0 60px color-mix(in srgb, var(--lumi-secondary) 5%, transparent)",
                        ].join(", "),
                    }}
                >
                    {/* ═══ Left column: brand ═══ */}
                    <motion.div
                        variants={leftContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex-1 flex flex-col items-center justify-center px-8 py-12 md:py-10 relative overflow-hidden backdrop-blur-2xl"
                        style={{
                            background: "linear-gradient(170deg, color-mix(in srgb, var(--lumi-base) 78%, transparent) 0%, color-mix(in srgb, var(--lumi-base) 72%, transparent) 100%)",
                            borderBottom: "1px solid color-mix(in srgb, var(--lumi-primary) 10%, transparent)",
                        }}
                    >
                        {/* Inner glows */}
                        <div className="absolute inset-0 pointer-events-none" style={{
                            background: "radial-gradient(ellipse 220px 180px at 50% 34%, color-mix(in srgb, var(--lumi-primary) 8%, transparent) 0%, transparent 100%)"
                        }} />
                        <div className="absolute w-[220px] h-[220px] rounded-full -bottom-[90px] -left-[80px] pointer-events-none" style={{
                            background: "color-mix(in srgb, var(--lumi-primary) 14%, transparent)", filter: "blur(56px)"
                        }} />
                        <div className="absolute w-[150px] h-[150px] rounded-full top-[24px] -right-[44px] pointer-events-none" style={{
                            background: "color-mix(in srgb, var(--lumi-secondary) 14%, transparent)", filter: "blur(48px)"
                        }} />

                        {/* Star particles */}
                        {!reduced && STARS.map((star) => (
                            <motion.div
                                key={star.id}
                                className="absolute rounded-full pointer-events-none"
                                style={{
                                    left: `${star.x}%`, top: `${star.y}%`,
                                    width: star.size, height: star.size,
                                    background: "var(--lumi-fg)",
                                    boxShadow: `0 0 ${star.size * 2}px var(--lumi-primary)`,
                                }}
                                animate={{ opacity: [0.15, 0.85, 0.15], scale: [0.8, 1.3, 0.8] }}
                                transition={{ duration: star.dur, delay: star.delay, repeat: Infinity, ease: "easeInOut" }}
                            />
                        ))}

                        {/* Pet with aura rings */}
                        <motion.div variants={leftItem} className="relative flex items-center justify-center mb-5">
                            <div className="absolute rounded-full pointer-events-none" style={{
                                width: 160, height: 160,
                                background: "radial-gradient(circle, transparent 38%, color-mix(in srgb, var(--lumi-primary) 8%, transparent) 60%, transparent 80%)",
                                border: "1px solid color-mix(in srgb, var(--lumi-primary) 12%, transparent)",
                                animation: reduced ? "none" : "lumi-ring-pulse-slow 4.5s ease-in-out infinite",
                            }} />
                            <div className="absolute rounded-full pointer-events-none" style={{
                                width: 132, height: 132,
                                background: "radial-gradient(circle, transparent 30%, color-mix(in srgb, var(--lumi-primary) 14%, transparent) 55%, transparent 75%)",
                                border: "1px solid color-mix(in srgb, var(--lumi-primary) 22%, transparent)",
                                animation: reduced ? "none" : "lumi-ring-pulse 3.5s ease-in-out infinite",
                            }} />
                            <div className="absolute rounded-full pointer-events-none" style={{
                                width: 108, height: 108,
                                background: "radial-gradient(circle, color-mix(in srgb, var(--lumi-primary) 18%, transparent) 0%, color-mix(in srgb, var(--lumi-secondary) 10%, transparent) 50%, transparent 75%)",
                                filter: "blur(8px)",
                                animation: reduced ? "none" : "lumi-ring-pulse 2.8s ease-in-out infinite 0.6s",
                            }} />
                            <div style={{ animation: reduced ? "none" : "lumi-pet-float 5s ease-in-out infinite", position: "relative", zIndex: 2 }}>
                                <Image
                                    alt="Lumi ペット"
                                    src="/lumi-lv1.svg"
                                    width={90}
                                    height={90}
                                    priority
                                    style={{
                                        filter: "drop-shadow(0 0 12px color-mix(in srgb, var(--lumi-primary) 55%, transparent)) drop-shadow(0 0 28px color-mix(in srgb, var(--lumi-secondary) 25%, transparent))"
                                    }}
                                />
                            </div>
                        </motion.div>

                        {/* Brand title */}
                        <motion.p
                            variants={leftItem}
                            className="text-[2.8rem] font-bold tracking-tight leading-none select-none relative z-10 bg-gradient-to-br from-lumi-fg via-lumi-primary to-lumi-secondary bg-clip-text text-transparent"
                        >
                            Lumi
                        </motion.p>

                        <motion.p
                            variants={leftItem}
                            className="text-[0.8rem] text-lumi-muted/55 mt-2 uppercase tracking-[0.12em] relative z-10"
                        >
                            あなただけの相棒
                        </motion.p>

                        {/* Feature badge */}
                        <motion.span
                            variants={leftItem}
                            className="mt-4 inline-flex items-center gap-1.5 text-[0.68rem] px-3 py-1.5 rounded-full relative z-10"
                            style={{
                                border: "1px solid color-mix(in srgb, var(--lumi-secondary) 30%, transparent)",
                                color: "color-mix(in srgb, var(--lumi-secondary) 85%, white)",
                                background: "color-mix(in srgb, var(--lumi-secondary) 9%, transparent)",
                            }}
                        >
                            ✦ 感情を持つAIペットと共に成長
                        </motion.span>
                    </motion.div>

                    {/* ═══ Right column: form ═══ */}
                    <motion.div
                        variants={rightContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex-[1.2] flex flex-col justify-center px-8 py-10 backdrop-blur-2xl relative"
                        style={{
                            background: "linear-gradient(160deg, color-mix(in srgb, var(--lumi-base) 92%, transparent) 0%, color-mix(in srgb, var(--lumi-base) 88%, transparent) 100%)",
                        }}
                    >
                        {/* Corner glow */}
                        <div className="absolute top-0 right-0 w-[180px] h-[180px] rounded-full pointer-events-none" style={{
                            background: "radial-gradient(circle, color-mix(in srgb, var(--lumi-secondary) 6%, transparent) 0%, transparent 70%)",
                            filter: "blur(40px)",
                            transform: "translate(40%, -40%)",
                        }} />

                        {/* Heading */}
                        <motion.div variants={rightItem} className="mb-7">
                            <h1 className="text-[1.5rem] font-bold text-lumi-fg tracking-tight leading-tight">
                                はじめましょう
                            </h1>
                            <p className="text-[0.8rem] text-lumi-muted/50 mt-1.5">
                                アカウントを作成してLumiと旅を始めよう
                            </p>
                        </motion.div>

                        {/* Google sign-in (disabled) */}
                        <motion.div variants={rightItem}>
                            <Button
                                type="button"
                                variant="outline"
                                disabled
                                aria-disabled="true"
                                className="w-full h-auto py-2.5 rounded-xl text-sm text-lumi-muted/65 hover:text-lumi-muted/65 cursor-not-allowed gap-2.5"
                                style={{
                                    background: "color-mix(in srgb, var(--lumi-surface) 25%, transparent)",
                                    border: "1px solid color-mix(in srgb, var(--lumi-primary) 18%, transparent)",
                                }}
                            >
                                <GoogleIcon />
                                Googleで続ける
                                <span className="ml-auto text-[0.6rem] text-lumi-muted/35 font-normal">近日公開</span>
                            </Button>
                        </motion.div>

                        {/* OR divider */}
                        <motion.div variants={rightItem} className="flex items-center gap-3 my-6">
                            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, color-mix(in srgb, var(--lumi-primary) 16%, transparent))" }} />
                            <span className="text-[0.7rem] tracking-[0.06em] text-lumi-muted/35">または</span>
                            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, color-mix(in srgb, var(--lumi-primary) 16%, transparent), transparent)" }} />
                        </motion.div>

                        {/* Form */}
                        <motion.div variants={rightItem}>
                            <SignUpForm reduced={reduced} />
                        </motion.div>

                        {/* Bottom link */}
                        <motion.p
                            variants={rightItem}
                            className="text-center text-[0.73rem] leading-relaxed mt-6 text-lumi-muted/35"
                        >
                            すでにアカウントをお持ちの方は{" "}
                            <Link
                                href="/login"
                                className="text-lumi-primary/60 transition-all duration-200 hover:text-lumi-primary/90 hover:underline underline-offset-2"
                            >
                                ログイン
                            </Link>
                        </motion.p>

                        {/* Bottom line */}
                        <div className="absolute bottom-0 left-8 right-8 h-px pointer-events-none" style={{
                            background: "linear-gradient(90deg, transparent, color-mix(in srgb, var(--lumi-primary) 10%, transparent) 50%, transparent)"
                        }} />
                    </motion.div>
                </motion.div>
            </div>
        </>
    );
}
