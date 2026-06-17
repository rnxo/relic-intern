"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PetSvg } from "./PetSvg";
import { Award } from "lucide-react";
import { PetEmotionStatusCard } from "./PetEmotionStatusCard";
import { Pet } from "@/app/features/pet/pet.type";


export default function PetView({ pet }: { pet: Pet | null }) {
  const [hoverExpression, setHoverExpression] = useState<"joy" | "normal" | "sad" | null>(null);

  const displayExpression = hoverExpression ?? pet?.expression ?? "normal";
  return (
    <div className="flex flex-col items-center py-8 px-4 space-y-6 bg-lumi-base">
      {/* ペットSVG + グロー */}
      <motion.div
        className="relative group cursor-pointer"
        transition={{ duration: 0.8, ease: "easeOut" }}
        onHoverStart={() => setHoverExpression("joy")}
        onHoverEnd={() => setHoverExpression(null)}
        role="img"
        aria-label={`Lumiのペット — 表情: ${displayExpression}`}
      >
        <div
          className="absolute -inset-4 rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
          style={{
            background: "linear-gradient(to right, var(--lumi-primary), var(--lumi-primary-hover))",
          }}
          aria-hidden="true"
        />
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key="lumi"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <PetSvg expression={displayExpression} />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* レベルバッジ */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="flex items-center gap-2 bg-lumi-primary text-white px-6 py-2 rounded-full shadow-lg"
        aria-label={`レベル ${pet?.intimate_level || 1}`}
      >
        <Award size={18} aria-hidden="true" />
        <span className="font-bold text-sm">
          Level {pet?.intimate_level || 1}
        </span>
      </motion.div>

      {/* Lumi感情ステータス */}
      {pet && <PetEmotionStatusCard pet={pet} />}
    </div>
  );
}