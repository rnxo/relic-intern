"use client"

import { motion } from "motion/react"
import { Sparkles } from "lucide-react"

export function LumiBrandLogo() {
  return (
    <motion.div
      className="flex items-center gap-2.5"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* グロウオーブアイコン */}
      <div className="relative flex items-center justify-center w-9 h-9 shrink-0">
        <div className="absolute inset-0 rounded-full bg-lumi-primary/25 blur-md" />
        <motion.div
          className="relative w-7 h-7 rounded-full bg-gradient-to-br from-lumi-primary to-lumi-secondary flex items-center justify-center shadow-lg"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles size={13} className="text-white drop-shadow-sm" />
        </motion.div>
      </div>

      {/* ロゴテキスト */}
      <div className="flex flex-col leading-none gap-0.5">
        <span className="font-black text-2xl tracking-tight bg-gradient-to-r from-lumi-primary to-lumi-secondary bg-clip-text text-transparent select-none">
          Lumi
        </span>
      </div>
    </motion.div>
  )
}
