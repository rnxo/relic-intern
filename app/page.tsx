"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { Button } from "@/components/ui/button";

// ── 星フィールド定数（LoginContent と同パターン） ──────────────────────────────
const STARS = [
    { id: 0,  x: 8,  y: 12, size: 1.5, delay: 0,    dur: 4.2 },
    { id: 1,  x: 75, y: 18, size: 1,   delay: 0.8,  dur: 5.1 },
    { id: 2,  x: 32, y: 68, size: 2,   delay: 1.5,  dur: 3.8 },
    { id: 3,  x: 90, y: 52, size: 1,   delay: 0.3,  dur: 6.0 },
    { id: 4,  x: 18, y: 38, size: 1.5, delay: 2.1,  dur: 4.5 },
    { id: 5,  x: 58, y: 85, size: 1,   delay: 0.6,  dur: 5.3 },
    { id: 6,  x: 45, y: 22, size: 2.5, delay: 1.2,  dur: 3.6 },
    { id: 7,  x: 95, y: 28, size: 1,   delay: 1.9,  dur: 7.0 },
    { id: 8,  x: 4,  y: 60, size: 1.5, delay: 0.4,  dur: 4.8 },
    { id: 9,  x: 68, y: 44, size: 1,   delay: 2.5,  dur: 5.5 },
    { id: 10, x: 52, y: 4,  size: 2,   delay: 1.0,  dur: 4.0 },
    { id: 11, x: 28, y: 92, size: 1,   delay: 1.7,  dur: 6.2 },
    { id: 12, x: 82, y: 76, size: 1.5, delay: 0.9,  dur: 4.7 },
    { id: 13, x: 14, y: 82, size: 1,   delay: 2.3,  dur: 5.8 },
    { id: 14, x: 62, y: 10, size: 2,   delay: 0.5,  dur: 3.9 },
    { id: 15, x: 38, y: 50, size: 1,   delay: 1.4,  dur: 6.5 },
];

// ── フィーチャーカードデータ ────────────────────────────────────────────────────
type Feature = {
    icon: React.ReactNode;
    title: string;
    description: string;
    accent: "primary" | "secondary" | "cyan";
};

function ChecklistIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.6" />
            <path d="M8 12l2.5 2.5L16 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function HeartIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 12 21 12 21Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
    );
}

function StarIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
    );
}

const FEATURES: Feature[] = [
    {
        icon: <ChecklistIcon />,
        title: "習慣トラッキング",
        description: "朝・昼・夜の時間ブロックごとに習慣を記録。毎日の積み重ねが可視化され、継続しやすくなります。",
        accent: "primary",
    },
    {
        icon: <HeartIcon />,
        title: "ペットとの絆",
        description: "タスクを達成するたびにLumiとの信頼度が上昇。レベルアップでペットの形態が変化します。",
        accent: "secondary",
    },
    {
        icon: <StarIcon />,
        title: "感情フィードバック",
        description: "Lumiはあなたの努力を映す鏡。joy・normal・sadの感情でリアルタイムに応答します。",
        accent: "cyan",
    },
];

// ── FeatureCard コンポーネント ─────────────────────────────────────────────────
type FeatureCardProps = {
    feature: Feature;
    reduced: boolean;
    index: number;
};

function FeatureCard({ feature, reduced, index }: FeatureCardProps) {
    const accentStyle: Record<Feature["accent"], React.CSSProperties> = {
        primary: {
            color: "var(--lumi-primary)",
            background: "color-mix(in srgb, var(--lumi-primary) 12%, transparent)",
            border: "1px solid color-mix(in srgb, var(--lumi-primary) 22%, transparent)",
        },
        secondary: {
            color: "var(--lumi-secondary)",
            background: "color-mix(in srgb, var(--lumi-secondary) 12%, transparent)",
            border: "1px solid color-mix(in srgb, var(--lumi-secondary) 22%, transparent)",
        },
        cyan: {
            color: "var(--lumi-primary-hover)",
            background: "color-mix(in srgb, var(--lumi-primary-hover) 12%, transparent)",
            border: "1px solid color-mix(in srgb, var(--lumi-primary-hover) 22%, transparent)",
        },
    };

    const glowStyle: Record<Feature["accent"], string> = {
        primary: "color-mix(in srgb, var(--lumi-primary) 8%, transparent)",
        secondary: "color-mix(in srgb, var(--lumi-secondary) 8%, transparent)",
        cyan: "color-mix(in srgb, var(--lumi-primary-hover) 8%, transparent)",
    };

    return (
        <motion.div
            initial={reduced ? {} : { opacity: 0, y: 24 }}
            whileInView={reduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col gap-4 rounded-2xl p-6 backdrop-blur-xl cursor-default"
            style={{
                background: "color-mix(in srgb, var(--lumi-surface) 60%, transparent)",
                border: "1px solid color-mix(in srgb, var(--lumi-border) 35%, transparent)",
                boxShadow: `0 8px 32px rgba(0,0,0,0.18), 0 0 48px ${glowStyle[feature.accent]}`,
            }}
        >
            {/* 内部グロー */}
            <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                    background: `radial-gradient(ellipse 140px 100px at 50% 0%, ${glowStyle[feature.accent]} 0%, transparent 70%)`,
                }}
            />
            {/* アイコン */}
            <div
                className="relative z-10 w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={accentStyle[feature.accent]}
            >
                {feature.icon}
            </div>
            {/* テキスト */}
            <div className="relative z-10">
                <h3 className="text-[1rem] font-semibold text-lumi-fg mb-1.5 leading-snug">
                    {feature.title}
                </h3>
                <p className="text-[0.82rem] text-lumi-muted leading-relaxed">
                    {feature.description}
                </p>
            </div>
        </motion.div>
    );
}

// ── メインページ ──────────────────────────────────────────────────────────────
export default function WelcomePage() {
    const reduced = useReducedMotion() ?? false;

    // Variants
    const heroContainer: Variants = {
        hidden: {},
        visible: { transition: { staggerChildren: reduced ? 0 : 0.1, delayChildren: 0.2 } },
    };
    const heroItem: Variants = {
        hidden: { opacity: 0, y: reduced ? 0 : 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
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
                    50%      { transform: translateY(-10px); }
                }
                @keyframes lumi-ring-pulse {
                    0%, 100% { opacity: 0.55; transform: scale(1);    }
                    50%      { opacity: 0.22; transform: scale(1.08); }
                }
                @keyframes lumi-ring-pulse-slow {
                    0%, 100% { opacity: 0.28; transform: scale(1);    }
                    50%      { opacity: 0.08; transform: scale(1.14); }
                }
                @keyframes lumi-shimmer {
                    from { transform: translateX(-100%) skewX(-15deg); }
                    to   { transform: translateX(300%) skewX(-15deg); }
                }
            `}</style>

            <main className="relative min-h-[100dvh] overflow-x-hidden flex flex-col">

                {/* ── 背景レイヤー ── */}
                <div className="fixed inset-0 -z-10">
                    {/* ベース */}
                    <div className="absolute inset-0" style={{
                        background: "radial-gradient(ellipse 160% 110% at 60% 115%, #07080f 0%, color-mix(in srgb, var(--lumi-base) 80%, #000) 50%, color-mix(in srgb, var(--lumi-base) 90%, #000) 100%)"
                    }} />
                    {/* Blue nebula — top-left */}
                    <div className="absolute rounded-full pointer-events-none" style={{
                        width: 700, height: 700, top: -250, left: -190,
                        background: "radial-gradient(circle, color-mix(in srgb, var(--lumi-primary) 60%, transparent) 0%, color-mix(in srgb, var(--lumi-primary) 20%, transparent) 42%, transparent 70%)",
                        filter: "blur(72px)", opacity: 0.45,
                        animation: reduced ? "none" : "lumi-drift-a 22s ease-in-out infinite alternate",
                    }} />
                    {/* Purple nebula — bottom-right */}
                    <div className="absolute rounded-full pointer-events-none" style={{
                        width: 580, height: 580, bottom: -190, right: -150,
                        background: "radial-gradient(circle, color-mix(in srgb, var(--lumi-secondary) 55%, transparent) 0%, color-mix(in srgb, var(--lumi-secondary) 15%, transparent) 44%, transparent 70%)",
                        filter: "blur(82px)", opacity: 0.42,
                        animation: reduced ? "none" : "lumi-drift-b 26s ease-in-out infinite alternate",
                    }} />
                    {/* Cyan accent — center */}
                    <div className="absolute rounded-full pointer-events-none" style={{
                        width: 400, height: 290, top: "38%", right: "12%",
                        background: "radial-gradient(circle, color-mix(in srgb, var(--lumi-primary-hover) 32%, transparent) 0%, transparent 70%)",
                        filter: "blur(90px)", opacity: 0.22,
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
                </div>

                {/* ── 星フィールド ── */}
                {!reduced && STARS.map((star) => (
                    <motion.div
                        key={star.id}
                        className="fixed rounded-full pointer-events-none -z-10"
                        style={{
                            left: `${star.x}%`, top: `${star.y}%`,
                            width: star.size, height: star.size,
                            background: "var(--lumi-fg)",
                            boxShadow: `0 0 ${star.size * 2.5}px var(--lumi-primary)`,
                        }}
                        animate={{ opacity: [0.15, 0.85, 0.15], scale: [0.8, 1.3, 0.8] }}
                        transition={{ duration: star.dur, delay: star.delay, repeat: Infinity, ease: "easeInOut" }}
                    />
                ))}

                {/* ══════════════════════════════════════════════
                    ヒーローセクション
                ══════════════════════════════════════════════ */}
                <section className="flex-1 flex flex-col items-center justify-center px-4 pt-16 pb-10 sm:pt-20 sm:pb-14">
                    <motion.div
                        variants={heroContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col items-center text-center max-w-lg mx-auto w-full"
                    >
                        {/* ── ペット + オーラリング ── */}
                        <motion.div variants={heroItem} className="relative flex items-center justify-center mb-7 sm:mb-8">
                            {/* 外側リング */}
                            <div className="absolute rounded-full pointer-events-none" style={{
                                width: 200, height: 200,
                                background: "radial-gradient(circle, transparent 38%, color-mix(in srgb, var(--lumi-primary) 8%, transparent) 60%, transparent 80%)",
                                border: "1px solid color-mix(in srgb, var(--lumi-primary) 12%, transparent)",
                                animation: reduced ? "none" : "lumi-ring-pulse-slow 4.5s ease-in-out infinite",
                            }} />
                            {/* 中リング */}
                            <div className="absolute rounded-full pointer-events-none" style={{
                                width: 162, height: 162,
                                background: "radial-gradient(circle, transparent 30%, color-mix(in srgb, var(--lumi-primary) 14%, transparent) 55%, transparent 75%)",
                                border: "1px solid color-mix(in srgb, var(--lumi-primary) 22%, transparent)",
                                animation: reduced ? "none" : "lumi-ring-pulse 3.5s ease-in-out infinite",
                            }} />
                            {/* グロー */}
                            <div className="absolute rounded-full pointer-events-none" style={{
                                width: 128, height: 128,
                                background: "radial-gradient(circle, color-mix(in srgb, var(--lumi-primary) 18%, transparent) 0%, color-mix(in srgb, var(--lumi-secondary) 10%, transparent) 50%, transparent 75%)",
                                filter: "blur(8px)",
                                animation: reduced ? "none" : "lumi-ring-pulse 2.8s ease-in-out infinite 0.6s",
                            }} />
                            {/* ペット画像 */}
                            <div style={{ animation: reduced ? "none" : "lumi-pet-float 5s ease-in-out infinite", position: "relative", zIndex: 2 }}>
                                <Image
                                    alt="Lumi ペット"
                                    src="/lumi-lv1.svg"
                                    width={112}
                                    height={112}
                                    priority
                                    style={{
                                        filter: "drop-shadow(0 0 14px color-mix(in srgb, var(--lumi-primary) 55%, transparent)) drop-shadow(0 0 32px color-mix(in srgb, var(--lumi-secondary) 25%, transparent))"
                                    }}
                                />
                            </div>
                        </motion.div>

                        {/* ── アプリ名 ── */}
                        <motion.h1
                            variants={heroItem}
                            className="text-[3.6rem] sm:text-[4.5rem] font-bold tracking-tight leading-none select-none bg-gradient-to-br from-lumi-fg via-lumi-primary to-lumi-secondary bg-clip-text text-transparent mb-3"
                        >
                            Lumi
                        </motion.h1>

                        {/* ── キャッチコピー ── */}
                        <motion.p
                            variants={heroItem}
                            className="text-[1rem] sm:text-[1.08rem] text-lumi-muted leading-relaxed max-w-[340px] sm:max-w-[400px] mb-2"
                        >
                            習慣を育てるたびに、ペットが育つ。<br />
                            あなたの努力をLumiが感じ取ります。
                        </motion.p>

                        {/* ── バッジ ── */}
                        <motion.span
                            variants={heroItem}
                            className="inline-flex items-center gap-1.5 text-[0.7rem] px-3.5 py-1.5 rounded-full mb-9 sm:mb-10"
                            style={{
                                border: "1px solid color-mix(in srgb, var(--lumi-secondary) 30%, transparent)",
                                color: "color-mix(in srgb, var(--lumi-secondary) 85%, white)",
                                background: "color-mix(in srgb, var(--lumi-secondary) 9%, transparent)",
                            }}
                        >
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
                                <path d="M5 0l1.18 3.64H10L7.09 5.9 8.09 9.5 5 7.27 1.91 9.5l1-3.6L0 3.64h3.82z"/>
                            </svg>
                            感情を持つペットコンパニオン
                        </motion.span>

                        {/* ── CTA ボタン ── */}
                        <motion.div
                            variants={heroItem}
                            className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-[320px] sm:max-w-none sm:w-auto"
                        >
                            {/* はじめる（グラデーションボタン） */}
                            <Link href="/register" className="w-full sm:w-auto">
                                <div className="relative overflow-hidden rounded-xl w-full sm:w-auto">
                                    <Button
                                        asChild={false}
                                        className="w-full sm:w-auto h-auto px-8 py-3.5 rounded-xl text-[0.92rem] font-semibold text-lumi-base border-0 relative z-10 cursor-pointer active:scale-[0.98] transition-transform duration-150"
                                        style={{
                                            background: "linear-gradient(135deg, var(--lumi-primary) 0%, var(--lumi-secondary) 55%, var(--lumi-primary-hover) 100%)",
                                            boxShadow: "0 4px 24px color-mix(in srgb, var(--lumi-primary) 40%, transparent), 0 1px 0 rgba(255,255,255,0.15) inset",
                                        }}
                                    >
                                        はじめる
                                    </Button>
                                    {!reduced && (
                                        <div
                                            className="absolute inset-0 pointer-events-none z-20"
                                            style={{
                                                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
                                                animation: "lumi-shimmer 3.2s ease-in-out infinite 1.5s",
                                            }}
                                        />
                                    )}
                                </div>
                            </Link>

                            {/* ログイン（アウトラインボタン） */}
                            <Link href="/login" className="w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    className="w-full sm:w-auto h-auto px-8 py-3.5 rounded-xl text-[0.92rem] font-medium text-lumi-fg cursor-pointer active:scale-[0.98] transition-all duration-200 hover:text-lumi-primary"
                                    style={{
                                        background: "color-mix(in srgb, var(--lumi-surface) 40%, transparent)",
                                        border: "1px solid color-mix(in srgb, var(--lumi-border) 50%, transparent)",
                                        backdropFilter: "blur(12px)",
                                    }}
                                >
                                    ログイン
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </section>

                {/* ══════════════════════════════════════════════
                    フィーチャーセクション
                ══════════════════════════════════════════════ */}
                <section
                    aria-label="機能紹介"
                    className="px-4 pb-16 sm:pb-20"
                >
                    {/* セクション上部ライン */}
                    <div className="max-w-3xl mx-auto mb-8">
                        <div className="h-px w-full" style={{
                            background: "linear-gradient(90deg, transparent, color-mix(in srgb, var(--lumi-primary) 20%, transparent) 50%, transparent)"
                        }} />
                    </div>

                    <motion.p
                        initial={reduced ? {} : { opacity: 0, y: 10 }}
                        whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center text-[0.72rem] uppercase tracking-[0.14em] text-lumi-muted/50 mb-6"
                    >
                        できること
                    </motion.p>

                    {/* 3カラムグリッド（モバイルは1列） */}
                    <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {FEATURES.map((feature, i) => (
                            <FeatureCard
                                key={feature.title}
                                feature={feature}
                                reduced={reduced}
                                index={i}
                            />
                        ))}
                    </div>

                    {/* フッター */}
                    <motion.p
                        initial={reduced ? {} : { opacity: 0 }}
                        whileInView={reduced ? {} : { opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-center text-[0.7rem] text-lumi-muted/35 mt-10 tracking-wide"
                    >
                        Lumi — あなたの習慣の相棒
                    </motion.p>
                </section>

            </main>
        </>
    );
}
