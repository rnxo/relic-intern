import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "motion/react";
import { useHabits } from "@/app/features/habit/habit.state";
import { Habit } from "@/app/features/habit/habit.type";
import { PetSvg } from "./PetSvg";
import { usePet } from "@/app/features/pet/pet.state";
import { Award } from "lucide-react";
import { PetEmotionStatusCard } from "./PetEmotionStatusCard";

export default function PetView() {
  const { habits } = useHabits();
  const { pet } = usePet();
  const [hoverExpression, setHoverExpression] = useState<"joy" | "normal" | "sad" | null>(null);

  const displayExpression = hoverExpression ?? pet?.expression ?? "normal";

  const todayTotalCompletedHabits: Habit[] =
    habits?.filter((h) => h.is_completed) || [];
  const todayTotalHabitsCount: number = todayTotalCompletedHabits?.length || 0;

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

      {/* 今日のタスク達成数カード */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-[280px]"
      >
        <Card
          className="w-full bg-lumi-surface/50 backdrop-blur-md border border-lumi-border rounded-3xl p-6 hover:border-lumi-primary/30 transition-all"
        >
          <CardContent className="flex flex-col items-center justify-center p-0 space-y-2">
            <motion.span
              key={todayTotalHabitsCount}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl font-extrabold text-lumi-primary tabular-nums"
              aria-label={`今日のタスク達成数 ${todayTotalHabitsCount}`}
            >
              {todayTotalHabitsCount}
            </motion.span>
            <span className="text-sm font-medium text-lumi-muted">
              今日のタスク達成数
            </span>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lumi感情ステータス */}
      {pet && <PetEmotionStatusCard pet={pet} />}
    </div>
  );
}
