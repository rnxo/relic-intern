"use client";

import { motion } from "framer-motion";

export function PetSvg({ isJumping = false }: { isJumping?: boolean }) {
    return (
        <motion.svg
            width="180"
            height="180"
            viewBox="0 0 220 220"
            xmlns="http://www.w3.org/2000/svg"
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
            {/* Body */}
            <motion.g
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
                <circle cx="60" cy="60" r="28" fill="#7fa2e6" />
                <circle cx="160" cy="60" r="28" fill="#7fa2e6" />
                <circle cx="110" cy="110" r="80" fill="#7fa2e6" />
            </motion.g>

            {/* Eyes */}
            <motion.g
                animate={{ x: [0, 0, 3, -3, 0, 0] }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    times: [0, 0.5, 0.6, 0.7, 0.8, 1],
                    ease: "easeInOut"
                }}
            >
                <g>
                    <circle cx="85" cy="105" r="6" fill="#1c2238" />
                    <circle cx="87" cy="103" r="1.5" fill="white" opacity="0.6" />
                </g>
                <g>
                    <circle cx="135" cy="105" r="6" fill="#1c2238" />
                    <circle cx="137" cy="103" r="1.5" fill="white" opacity="0.6" />
                </g>
            </motion.g>

            {/* Mouth */}
            <motion.path
                stroke="#1c2238"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                animate={{
                    d: isJumping
                        ? "M 90 145 Q 110 170 130 145"
                        : "M 90 145 Q 110 140 130 145",
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            />
        </motion.svg>
    )
}
