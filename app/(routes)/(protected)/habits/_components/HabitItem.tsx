"use client";

import type { Habit } from "@/app/features/habit/habit.type";
import { useHabits } from "@/app/features/habit/habit.state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Circle, CheckCircle2, Pencil, Trash2, Flame } from "lucide-react";
import { HabitTypeTag } from "./HabitTypeTag";
import { useRouter } from "next/navigation";

const getDurationColorClass = (duration: string | undefined): string => {
  const d = Number(duration);
  if (!duration || isNaN(d)) return "border border-lumi-primary bg-lumi-primary/15 text-lumi-primary";
  if (d <= 30) return "border border-green-400 bg-green-400/15 text-green-400";
  if (d <= 60) return "border border-yellow-400 bg-yellow-400/15 text-yellow-400";
  if (d <= 90) return "border border-orange-400 bg-orange-400/15 text-orange-400";
  return "border border-red-400 bg-red-400/15 text-red-400";
};

export function HabitItem({ habit }: { habit: Habit }) {
  const { deleteHabit, completeHabit } = useHabits();
  const router = useRouter();

  const createdAtDate = habit.created_at
    ? new Date(habit.created_at)
    : new Date();
  const elapsedDays = Math.floor(
    (new Date().getTime() - createdAtDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <Card
      className={`group relative w-full transition-all duration-300 ${
        habit.is_completed
          ? "bg-lumi-surface/20 opacity-70"
          : "bg-lumi-surface/40"
      } backdrop-blur-sm border border-lumi-border rounded-2xl hover:border-lumi-primary/50`}
    >
      <CardContent className="p-3 sm:p-5">
        {/* ── 上段: チェック + タイトル + アクションボタン ── */}
        <div className="flex items-center gap-3">
          {/* チェックボタン */}
          <button
            onClick={() => completeHabit(habit.id)}
            className="relative shrink-0 min-h-11 min-w-11 flex items-center justify-center hover:scale-110 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-lumi-primary rounded-full cursor-pointer"
            aria-pressed={habit.is_completed}
          >
            {habit.is_completed ? (
              <CheckCircle2
                size={28}
                className="text-lumi-primary"
                aria-hidden="true"
              />
            ) : (
              <Circle
                size={28}
                className="text-lumi-border"
                aria-hidden="true"
              />
            )}
          </button>

          {/* タイトル + タグ */}
          <div className="flex-1 min-w-0 space-y-1">
            <p
              className={`text-sm sm:text-base font-bold leading-tight transition-colors ${
                habit.is_completed
                  ? "text-lumi-muted line-through"
                  : "text-lumi-fg group-hover:text-lumi-primary-hover"
              }`}
            >
              {habit.title}
            </p>

            {/* メタ情報: タイプタグ + ストリーク */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <HabitTypeTag type={habit.type} />
              {Number(habit.streak_days) > 0 && (
                <span className="flex items-center gap-0.5 text-xs font-bold text-orange-400">
                  <Flame size={12} aria-hidden="true" />
                  {habit.streak_days}日継続
                </span>
              )}
            </div>
          </div>

          {/* アクションボタン群 */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="min-h-11 min-w-11 text-lumi-primary hover:text-lumi-primary-hover hover:bg-lumi-primary/10 rounded-xl cursor-pointer"
              onClick={() => router.push(`/register-habit?habitId=${habit.id}`)}
              aria-label={`${habit.title}を編集`}
            >
              <Pencil size={15} aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="min-h-11 min-w-11 hover:bg-red-400/10 rounded-xl cursor-pointer"
              onClick={() => deleteHabit(habit.id)}
              aria-label={`${habit.title}を削除`}
            >
              <Trash2 size={15} className="text-red-400" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* ── 下段: 所要時間 + 進捗バッジ ── */}
        <div className="flex items-center gap-2 mt-2.5 pl-13 flex-wrap">
          {/* 所要時間バッジ */}
          <span
            className={`text-xs font-semibold tracking-wide ${getDurationColorClass(habit.duration)} rounded-full px-2.5 py-1`}
            aria-label={`所要時間 ${habit.duration} 分`}
          >
            {habit.duration} min
          </span>

          {/* 経過日数バッジ */}
          <span
            className="text-xs font-semibold text-white bg-lumi-primary rounded-full px-2.5 py-1 tabular-nums"
            aria-label={`経過 ${elapsedDays} 日 / 目標 ${habit.target_days} 日`}
          >
            {elapsedDays}/{habit.target_days}日
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
