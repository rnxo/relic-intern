"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function PetSvg({ expression, isJumping = false }: { expression: 'happy' | 'sad' | 'angry' | 'neutral', isJumping?: boolean }) {
    const [isHovered, setIsHovered] = useState(false);

    // 表情とホバー状態の組み合わせによる判定
    const isHappy = expression === 'happy';
    const isSad = expression === 'sad';
    const isAngry = expression === 'angry';
    const isNeutral = expression === 'neutral';

    // ホバー時に幸せそうな顔にする（ニュートラルまたはハッピーの時）
    const showHappyFace = isHappy || (isHovered && isNeutral);
    const showAngerEffect = isAngry && isHovered;
    const showSadEffect = isSad && isHovered;

    return (
        <motion.svg
            width="180"
            height="180"
            viewBox="0 0 220 220"
            xmlns="http://www.w3.org/2000/svg"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="overflow-visible" // エフェクトが枠外に出ても見えるようにする
            animate={{
                y: isJumping ? 0 : [0, -10, 0],
            }}
            transition={{
                duration: 4,
                repeat: isJumping ? 0 : Infinity,
                ease: "easeInOut"
            }}
        >
            {/* Volcano Effect (Angry + Hover) - Under bits */}
            <AnimatePresence>
                {showAngerEffect && (
                    <motion.g
                        initial={{ opacity: 0, scaleY: 0, originY: "50px" }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        exit={{ opacity: 0, scaleY: 0 }}
                    >
                        {/* Volcano Mountain */}
                        <path d="M 80 50 L 110 20 L 140 50 Z" fill="#3a3a3a" />
                        <path d="M 100 30 L 110 20 L 120 30 Z" fill="#ff4e50" /> {/* Crater rim */}
                    </motion.g>
                )}
            </AnimatePresence>

            {/* Body */}
            <motion.g
                animate={{
                    scale: showHappyFace ? [1, 1.05, 1] : [1, 1.02, 1],
                }}
                transition={{
                    duration: showHappyFace ? 0.4 : 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <circle cx="60" cy="60" r="28" fill="#7fa2e6" />
                <circle cx="160" cy="60" r="28" fill="#7fa2e6" />
                <circle cx="110" cy="110" r="80" fill="#7fa2e6" />
            </motion.g>

            {/* Volcano Lava Flow (Angry + Hover) - Over Body but Under Face */}
            <AnimatePresence>
                {showAngerEffect && (
                    <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Magma Flowing Down Body */}
                        <motion.path
                            d="M 105 35 Q 110 60 100 90"
                            stroke="#ff4e50"
                            strokeWidth="8"
                            strokeLinecap="round"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
                        />
                        <motion.path
                            d="M 115 35 Q 110 70 120 100"
                            stroke="#fc913a"
                            strokeWidth="6"
                            strokeLinecap="round"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.3, delay: 0.2 }}
                        />

                        {/* Eruption Particles */}
                        {[...Array(8)].map((_, i) => (
                            <motion.circle
                                key={i}
                                r="4"
                                fill={["#ff4e50", "#fc913a", "#f9d423"][i % 3]}
                                initial={{ cx: 110, cy: 25 }}
                                animate={{
                                    cx: 110 + (Math.random() - 0.5) * 120,
                                    cy: 25 - 60 - Math.random() * 60,
                                    opacity: [1, 0],
                                    scale: [1, 0.5]
                                }}
                                transition={{
                                    duration: 1 + Math.random(),
                                    repeat: Infinity,
                                    delay: i * 0.15
                                }}
                            />
                        ))}
                    </motion.g>
                )}
            </AnimatePresence>

            {/* Thunderstorm Effect (Sad + Hover) - Brought to Front to overlap */}
            <AnimatePresence>
                {showSadEffect && (
                    <motion.g
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                    >
                        {/* Dark Cloud (Centered more) */}
                        <path
                            d="M 80 35 Q 70 35 70 45 Q 70 55 85 55 Q 90 65 110 65 Q 130 65 135 55 Q 150 55 150 45 Q 150 35 140 35 Z"
                            fill="#464a5e"
                            filter="drop-shadow(0px 4px 4px rgba(0,0,0,0.5))"
                        />
                        {/* Lightning (Centered) */}
                        <motion.path
                            d="M 110 65 L 100 85 L 115 85 L 105 105"
                            stroke="#ffcc00"
                            strokeWidth="4"
                            fill="none"
                            animate={{
                                opacity: [0, 1, 0, 1, 0, 0, 1, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        {/* Rain (Overlapping body) */}
                        {[...Array(12)].map((_, i) => (
                            <motion.line
                                key={i}
                                x1={75 + i * 7}
                                y1={65}
                                x2={73 + i * 7}
                                y2={85}
                                stroke="#7aa2f7"
                                strokeWidth="2.5"
                                animate={{
                                    y: [0, 120],
                                    opacity: [0, 1, 0]
                                }}
                                transition={{
                                    duration: 0.4 + Math.random() * 0.4,
                                    repeat: Infinity,
                                    delay: i * 0.05
                                }}
                            />
                        ))}
                    </motion.g>
                )}
            </AnimatePresence>

            {/* Blushing (頬の赤らみ) */}
            <AnimatePresence>
                {showHappyFace && (
                    <motion.g
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 0.5, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                    >
                        <circle cx="70" cy="125" r="12" fill="#ff7eb6" filter="blur(4px)" />
                        <circle cx="150" cy="125" r="12" fill="#ff7eb6" filter="blur(4px)" />
                    </motion.g>
                )}
            </AnimatePresence>

            {/* Eyes */}
            <motion.g
                animate={{
                    x: showHappyFace ? 0 : [0, 0, 3, -3, 0, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    times: [0, 0.5, 0.6, 0.7, 0.8, 1],
                    ease: "easeInOut"
                }}
            >
                {showHappyFace ? (
                    // ∩ ∩ 笑顔の目
                    <g fill="none" stroke="#1c2238" strokeWidth="6" strokeLinecap="round">
                        <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            d="M 75 110 Q 85 95 95 110"
                        />
                        <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            d="M 125 110 Q 135 95 145 110"
                        />
                    </g>
                ) : isSad ? (
                    // ◡ ◡ 悲しい目
                    <g fill="none" stroke="#1c2238" strokeWidth="6" strokeLinecap="round">
                        <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            d="M 75 105 Q 85 120 95 105"
                        />
                        <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            d="M 125 105 Q 135 120 145 105"
                        />
                    </g>
                ) : isAngry ? (
                    // \ / 怒った目
                    <g fill="none" stroke="#1c2238" strokeWidth="6" strokeLinecap="round">
                        <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            d="M 75 100 L 95 115"
                        />
                        <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            d="M 145 100 L 125 115"
                        />
                    </g>
                ) : (
                    // 通常の目
                    <>
                        <g>
                            <circle cx="85" cy="105" r="6" fill="#1c2238" />
                            <circle cx="87" cy="103" r="1.5" fill="white" opacity="0.6" />
                        </g>
                        <g>
                            <circle cx="135" cy="105" r="6" fill="#1c2238" />
                            <circle cx="137" cy="103" r="1.5" fill="white" opacity="0.6" />
                        </g>
                    </>
                )}
            </motion.g>

            {/* Mouth */}
            <motion.path
                stroke="#1c2238"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                animate={{
                    d: (isHappy || isJumping)
                        ? "M 90 145 Q 110 170 130 145" // 喜びの大きな口 (∪)
                        : isSad
                            ? "M 90 155 Q 110 140 130 155" // 悲しい時のへの字口 (∩)
                            : isAngry
                                ? "M 95 150 L 125 150" // 怒った時の真一文字
                                : showHappyFace
                                    ? "M 90 145 Q 110 140 130 145" // 撫でられた時の小さな笑み (∩)
                                    : "M 90 145 Q 110 140 130 145", // 通常の口 (∩)
                }}
                transition={{
                    duration: 0.3,
                    ease: "easeOut"
                }}
            />
        </motion.svg>
    )
}
