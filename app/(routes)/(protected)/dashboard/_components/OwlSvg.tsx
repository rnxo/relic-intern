"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Expression = 'happy' | 'sad' | 'angry' | 'neutral';

interface OwlSvgProps {
    expression: Expression;
    isJumping?: boolean;
}

export function OwlSvg({ expression, isJumping = false }: OwlSvgProps) {
    const [isHovered, setIsHovered] = useState(false);

    const isHappy = expression === 'happy';
    const isSad = expression === 'sad';
    const isAngry = expression === 'angry';
    const isNeutral = expression === 'neutral';

    // ホバー時はニュートラルもハッピーに
    const showHappyFace = isHappy || (isHovered && isNeutral);
    const showAngerEffect = isAngry && isHovered;
    const showSadEffect = isSad && isHovered;

    // フクロウカラーパレット（深夜感のある紫×ダークブラウン）
    const bodyColor = "#4a3f6b";       // 深紫
    const bellyColor = "#c9b8e8";      // 薄ラベンダー
    const wingColor = "#352b50";       // ダーク紫
    const eyeRingColor = "#f0c060";    // 黄金
    const beakColor = "#e8a030";       // オレンジ

    return (
        <motion.svg
            width="180"
            height="200"
            viewBox="0 0 220 240"
            xmlns="http://www.w3.org/2000/svg"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="overflow-visible"
            animate={{
                y: isJumping ? 0 : [0, -10, 0],
            }}
            transition={{
                duration: 4,
                repeat: isJumping ? 0 : Infinity,
                ease: "easeInOut"
            }}
        >
            {/* ========== ANGRY EFFECT: 炎エフェクト ========== */}
            <AnimatePresence>
                {showAngerEffect && (
                    <motion.g
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        exit={{ opacity: 0, scaleY: 0 }}
                    >
                        {[...Array(6)].map((_, i) => (
                            <motion.path
                                key={i}
                                d={`M ${85 + i * 10} 30 Q ${80 + i * 10} 15 ${88 + i * 10} 5 Q ${90 + i * 10} 20 ${92 + i * 10} 30`}
                                fill={["#ff4e50", "#fc913a", "#f9d423"][i % 3]}
                                opacity={0.85}
                                animate={{ scaleY: [1, 1.3, 1], y: [0, -5, 0] }}
                                transition={{ duration: 0.6 + i * 0.1, repeat: Infinity, ease: "easeInOut" }}
                            />
                        ))}
                    </motion.g>
                )}
            </AnimatePresence>

            {/* ========== SAD EFFECT: 雨粒エフェクト ========== */}
            <AnimatePresence>
                {showSadEffect && (
                    <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Dark cloud above */}
                        <path
                            d="M 75 25 Q 65 25 65 37 Q 65 48 80 48 Q 85 58 110 58 Q 135 58 140 48 Q 155 48 155 37 Q 155 25 145 25 Z"
                            fill="#2a2d40"
                            opacity={0.9}
                        />
                        {[...Array(10)].map((_, i) => (
                            <motion.line
                                key={i}
                                x1={80 + i * 8} y1={58}
                                x2={78 + i * 8} y2={75}
                                stroke="#7aa2f7"
                                strokeWidth="2"
                                animate={{ y: [0, 100], opacity: [0, 1, 0] }}
                                transition={{
                                    // TODO: 雨粒の揺らぎ用。本来はuseMemoで事前計算しrender外に出す
                                    // eslint-disable-next-line react-hooks/purity
                                    duration: 0.5 + Math.random() * 0.3,
                                    repeat: Infinity,
                                    delay: i * 0.08,
                                }}
                            />
                        ))}
                    </motion.g>
                )}
            </AnimatePresence>

            {/* ========== HAPPY EFFECT: キラキラ星 ========== */}
            <AnimatePresence>
                {showHappyFace && (
                    <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {[
                            { cx: 55, cy: 40, r: 3, delay: 0 },
                            { cx: 170, cy: 35, r: 2, delay: 0.2 },
                            { cx: 45, cy: 90, r: 2.5, delay: 0.4 },
                            { cx: 180, cy: 80, r: 3, delay: 0.1 },
                            { cx: 110, cy: 20, r: 2, delay: 0.3 },
                        ].map((star, i) => (
                            <motion.circle
                                key={i}
                                cx={star.cx} cy={star.cy} r={star.r}
                                fill="#f9d423"
                                animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
                                transition={{ duration: 1.2, repeat: Infinity, delay: star.delay }}
                            />
                        ))}
                    </motion.g>
                )}
            </AnimatePresence>

            {/* ========== BODY ========== */}
            <motion.g
                animate={{
                    scale: showHappyFace ? [1, 1.04, 1] : [1, 1.015, 1],
                }}
                transition={{
                    duration: showHappyFace ? 0.5 : 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                {/* 胴体メイン（楕円） */}
                <ellipse cx="110" cy="145" rx="68" ry="80" fill={bodyColor} />

                {/* お腹の白い部分 */}
                <ellipse cx="110" cy="158" rx="42" ry="52" fill={bellyColor} />

                {/* お腹の羽毛テクスチャ */}
                {[0, 1, 2, 3].map((row) =>
                    [0, 1, 2].map((col) => (
                        <ellipse
                            key={`feather-${row}-${col}`}
                            cx={88 + col * 12}
                            cy={128 + row * 20}
                            rx={7} ry={9}
                            fill={bellyColor}
                            opacity={0.4}
                        />
                    ))
                )}

                {/* 左翼 */}
                <motion.path
                    d="M 42 120 Q 20 140 30 185 Q 55 200 75 175 Z"
                    fill={wingColor}
                    animate={showHappyFace ? { rotate: [-5, 5, -5] } : {}}
                    transition={{ duration: 0.4, repeat: Infinity }}
                    style={{ transformOrigin: "65px 170px" }}
                />
                {/* 左翼羽詳細 */}
                <path d="M 42 130 Q 28 150 35 175" stroke={bodyColor} strokeWidth="2" fill="none" opacity="0.5" />
                <path d="M 50 125 Q 32 155 38 180" stroke={bodyColor} strokeWidth="2" fill="none" opacity="0.5" />

                {/* 右翼 */}
                <motion.path
                    d="M 178 120 Q 200 140 190 185 Q 165 200 145 175 Z"
                    fill={wingColor}
                    animate={showHappyFace ? { rotate: [5, -5, 5] } : {}}
                    transition={{ duration: 0.4, repeat: Infinity }}
                    style={{ transformOrigin: "155px 170px" }}
                />
                {/* 右翼羽詳細 */}
                <path d="M 178 130 Q 192 150 185 175" stroke={bodyColor} strokeWidth="2" fill="none" opacity="0.5" />
                <path d="M 170 125 Q 188 155 182 180" stroke={bodyColor} strokeWidth="2" fill="none" opacity="0.5" />

                {/* 尻尾的な下部の羽 */}
                <path d="M 85 220 Q 110 235 135 220 Q 110 215 85 220 Z" fill={wingColor} />
            </motion.g>

            {/* ========== HEAD ========== */}
            <motion.g
                animate={isAngry ? { rotate: [-2, 2, -2] } : {}}
                transition={{ duration: 0.3, repeat: Infinity }}
            >
                {/* 頭部メイン */}
                <circle cx="110" cy="82" r="58" fill={bodyColor} />

                {/* 耳羽 (ear tufts) - フクロウの特徴 */}
                {/* 左耳羽 */}
                <motion.path
                    d="M 68 34 L 58 10 L 78 28 Z"
                    fill={wingColor}
                    animate={isAngry ? { rotate: -15 } : showHappyFace ? { rotate: [0, -8, 0] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    style={{ transformOrigin: "68px 30px" }}
                />
                {/* 右耳羽 */}
                <motion.path
                    d="M 152 34 L 162 10 L 142 28 Z"
                    fill={wingColor}
                    animate={isAngry ? { rotate: 15 } : showHappyFace ? { rotate: [0, 8, 0] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    style={{ transformOrigin: "152px 30px" }}
                />

                {/* 顔の白い部分（ハート型のフェイスディスク） */}
                <path
                    d="M 110 48 Q 75 55 68 90 Q 68 130 110 138 Q 152 130 152 90 Q 145 55 110 48 Z"
                    fill={bellyColor}
                    opacity={0.55}
                />
            </motion.g>

            {/* ========== EYES ========== */}
            <motion.g
                animate={{
                    x: showHappyFace ? 0 : [0, 0, 2, -2, 0, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    times: [0, 0.4, 0.5, 0.6, 0.7, 1],
                }}
            >
                {/* 左目 - 大きな黄色のリング（フクロウらしさ） */}
                <circle cx="85" cy="82" r="20" fill={eyeRingColor} />
                <circle cx="135" cy="82" r="20" fill={eyeRingColor} />

                {/* 目の内側（ダーク） */}
                <circle cx="85" cy="82" r="14" fill="#1a1a2e" />
                <circle cx="135" cy="82" r="14" fill="#1a1a2e" />

                {/* 表情別の瞳 */}
                {showHappyFace ? (
                    // ∩ ∩ ハッピーな目（目をつぶっている感じ）
                    <g fill="none" stroke={eyeRingColor} strokeWidth="5" strokeLinecap="round">
                        <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            d="M 72 84 Q 85 68 98 84"
                        />
                        <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            d="M 122 84 Q 135 68 148 84"
                        />
                    </g>
                ) : isSad ? (
                    // ◡ ◡ 悲しい目
                    <g>
                        <circle cx="85" cy="82" r="8" fill="#5a4a8a" />
                        <circle cx="135" cy="82" r="8" fill="#5a4a8a" />
                        <path d="M 79 76 L 91 82" stroke="#7aa2f7" strokeWidth="3" strokeLinecap="round" />
                        <path d="M 129 76 L 141 82" stroke="#7aa2f7" strokeWidth="3" strokeLinecap="round" />
                    </g>
                ) : isAngry ? (
                    // 怒り目（眉毛と縦長の瞳）
                    <g>
                        <circle cx="85" cy="84" r="9" fill="#c0392b" />
                        <circle cx="135" cy="84" r="9" fill="#c0392b" />
                        {/* 怒り眉 */}
                        <path d="M 72 68 L 96 74" stroke="#1a1a2e" strokeWidth="4" strokeLinecap="round" />
                        <path d="M 148 68 L 124 74" stroke="#1a1a2e" strokeWidth="4" strokeLinecap="round" />
                        {/* 縦長瞳 */}
                        <ellipse cx="85" cy="84" rx="3" ry="7" fill="#1a1a2e" />
                        <ellipse cx="135" cy="84" rx="3" ry="7" fill="#1a1a2e" />
                    </g>
                ) : (
                    // 通常の目（丸い瞳）
                    <g>
                        <circle cx="85" cy="83" r="8" fill="#4a3f9a" />
                        <circle cx="135" cy="83" r="8" fill="#4a3f9a" />
                        {/* ハイライト */}
                        <circle cx="89" cy="79" r="3" fill="white" opacity="0.7" />
                        <circle cx="139" cy="79" r="3" fill="white" opacity="0.7" />
                        {/* 瞳 */}
                        <circle cx="85" cy="83" r="4" fill="#1a1a2e" />
                        <circle cx="135" cy="83" r="4" fill="#1a1a2e" />
                    </g>
                )}
            </motion.g>

            {/* ========== BEAK ========== */}
            <motion.g
                animate={showHappyFace ? { y: [0, 1, 0] } : {}}
                transition={{ duration: 0.4, repeat: Infinity }}
            >
                {/* くちばし（三角形のシャープなフクロウのくちばし） */}
                <path d="M 100 100 L 110 118 L 120 100 Q 110 96 100 100 Z" fill={beakColor} />
                <path d="M 100 100 Q 110 106 120 100" fill="#c07020" />

                {/* 表情に応じて口を変える */}
                {showHappyFace && (
                    <motion.path
                        d="M 97 112 Q 110 124 123 112"
                        stroke={beakColor}
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3 }}
                    />
                )}
                {isSad && (
                    <motion.path
                        d="M 97 118 Q 110 110 123 118"
                        stroke="#a05818"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                    />
                )}
            </motion.g>

            {/* ========== FEET ========== */}
            <g>
                {/* 左足 */}
                <path d="M 85 218 L 75 232 M 85 218 L 82 233 M 85 218 L 90 232" stroke={beakColor} strokeWidth="4" strokeLinecap="round" />
                {/* 右足 */}
                <path d="M 135 218 L 125 232 M 135 218 L 132 233 M 135 218 L 140 232" stroke={beakColor} strokeWidth="4" strokeLinecap="round" />
            </g>

            {/* ========== BLUSH (Happy) ========== */}
            <AnimatePresence>
                {showHappyFace && (
                    <motion.g
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 0.5, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                    >
                        <circle cx="62" cy="100" r="12" fill="#ff9eb5" filter="blur(5px)" />
                        <circle cx="158" cy="100" r="12" fill="#ff9eb5" filter="blur(5px)" />
                    </motion.g>
                )}
            </AnimatePresence>

            {/* ========== MOON & STAR decoration (夜型のシンボル) ========== */}
            <motion.g
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "110px 82px" }}
                opacity={0.3}
            >
                <circle cx="110" cy="30" r="5" fill="#f0c060" />
                <circle cx="116" cy="30" r="5" fill={bodyColor} />
            </motion.g>
        </motion.svg>
    );
}
