"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

type Expression = "joy" | "normal" | "sad";

type PetSvgProps = {
    isJumping?: boolean;
    expression?: Expression;
};

// ---- 通常目サブコンポーネント（AnimatePresence の key 切り替え用） ----
function NormalEyes({ enableGlance }: { enableGlance: boolean }) {
    if (enableGlance) {
        return (
            <motion.g
                initial={{ opacity: 0 }}
                animate={{ x: [0, 0, 3, -3, 0, 0], opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                    x: {
                        duration: 10,
                        repeat: Infinity,
                        times: [0, 0.5, 0.6, 0.7, 0.8, 1],
                        ease: "easeInOut",
                    },
                    opacity: { duration: 0.2 },
                }}
            >
                <circle cx="85" cy="105" r="6" fill="#1c2238" />
                <circle cx="87" cy="103" r="1.5" fill="white" opacity="0.6" />
                <circle cx="135" cy="105" r="6" fill="#1c2238" />
                <circle cx="137" cy="103" r="1.5" fill="white" opacity="0.6" />
            </motion.g>
        );
    }
    return (
        <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            <circle cx="85" cy="105" r="6" fill="#1c2238" />
            <circle cx="87" cy="103" r="1.5" fill="white" opacity="0.6" />
            <circle cx="135" cy="105" r="6" fill="#1c2238" />
            <circle cx="137" cy="103" r="1.5" fill="white" opacity="0.6" />
        </motion.g>
    );
}

// ---- アニメーション設定 ----

const bodyAnimation = {
    joy: {
        y: [0, -18, 0],
        transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" as const },
    },
    normal: {
        y: [0, -10, 0],
        transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const },
    },
    sad: {
        rotate: [-2, 2, -2],
        transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const },
    },
};

const bodyAnimationReduced = {
    joy: {},
    normal: {},
    sad: {},
};

const bodyScaleAnimation = {
    joy: { scale: [1, 1.03, 1], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const } },
    normal: { scale: [1, 1.02, 1], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const } },
    sad: { scale: [1, 1.01, 1], transition: { duration: 5, repeat: Infinity, ease: "easeInOut" as const } },
};


export function PetSvg({ isJumping = false, expression = "normal" }: PetSvgProps) {
    const prefersReducedMotion = useReducedMotion();

    // body の y/rotate アニメーション（isJumping 中は停止）
    const bodyAnim = prefersReducedMotion
        ? bodyAnimationReduced[expression]
        : isJumping
        ? { y: 0 }
        : bodyAnimation[expression];

    // body scale アニメーション
    const bodyScale = prefersReducedMotion
        ? {}
        : bodyScaleAnimation[expression];

    // 口のパス
    const mouthPath = (() => {
        if (expression === "joy") return "M 90 145 Q 110 175 130 145";
        if (expression === "sad") return "M 90 155 Q 110 140 130 155";
        // normal: isJumping で小さな笑顔 / それ以外はフラット
        return isJumping
            ? "M 90 145 Q 110 170 130 145"
            : "M 90 145 Q 110 140 130 145";
    })();

    return (
        <motion.svg
            width="180"
            height="180"
            viewBox="0 0 220 220"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
            animate={bodyAnim}
        >
            {/* ---- Body ---- */}
            <motion.g animate={bodyScale}>
                <circle cx="60" cy="60" r="28" fill="#7fa2e6" />
                <circle cx="160" cy="60" r="28" fill="#7fa2e6" />
                <circle cx="110" cy="110" r="80" fill="#7fa2e6" />
            </motion.g>

            {/* ---- Joy: 頬の赤み ---- */}
            <AnimatePresence>
                {expression === "joy" && (
                    <motion.g
                        key="blush"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        <ellipse
                            cx="80"
                            cy="125"
                            rx="14"
                            ry="8"
                            fill="#ffb7b7"
                            opacity="0.5"
                        />
                        <ellipse
                            cx="140"
                            cy="125"
                            rx="14"
                            ry="8"
                            fill="#ffb7b7"
                            opacity="0.5"
                        />
                    </motion.g>
                )}
            </AnimatePresence>

            {/* ---- Eyes: expression で切り替え ---- */}
            <AnimatePresence mode="wait">
                {expression === "joy" ? (
                    // 三日月目（^ 形）
                    <motion.g
                        key="eyes-joy"
                        initial={{ opacity: 0, scaleY: 0.3 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        exit={{ opacity: 0, scaleY: 0.3 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        {/* 左目 */}
                        <path
                            d="M 79 105 Q 85 99 91 105"
                            stroke="#1c2238"
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                        />
                        {/* 右目 */}
                        <path
                            d="M 129 105 Q 135 99 141 105"
                            stroke="#1c2238"
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                        />
                    </motion.g>
                ) : (
                    // 通常の丸目（normal / sad 共通）
                    <NormalEyes
                        key="eyes-normal"
                        enableGlance={!prefersReducedMotion && expression === "normal"}
                    />
                )}
            </AnimatePresence>

            {/* ---- Sad: 涙 ---- */}
            <AnimatePresence>
                {expression === "sad" && !prefersReducedMotion && (
                    <motion.g
                        key="tears"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* 左涙 */}
                        <motion.ellipse
                            cx="85"
                            cy="118"
                            rx="3"
                            ry="5"
                            fill="#7fa2e6"
                            animate={{ cy: [118, 140], opacity: [0.8, 0] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeIn",
                                repeatDelay: 0.5,
                            }}
                        />
                        {/* 右涙 */}
                        <motion.ellipse
                            cx="135"
                            cy="118"
                            rx="3"
                            ry="5"
                            fill="#7fa2e6"
                            animate={{ cy: [118, 140], opacity: [0.8, 0] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeIn",
                                delay: 0.7,
                                repeatDelay: 0.5,
                            }}
                        />
                    </motion.g>
                )}
            </AnimatePresence>

            {/* ---- Mouth ---- */}
            <motion.path
                stroke="#1c2238"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                animate={{ d: mouthPath }}
                transition={{ duration: 0.35, ease: "easeOut" }}
            />
        </motion.svg>
    );
}
