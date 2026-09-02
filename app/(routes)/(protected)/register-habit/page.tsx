"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useHabits } from "@/app/features/habit/habit.state";
import { NewHabitInput } from "@/app/features/habit/habit.type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TimeBlockSelector } from "./_components/TimeBlockSelector";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ChevronLeft, Pencil, Plus, Check, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { HabitTypeCardList } from "./_components/HabitTypeCardList";

function RegisterHabitContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const habitId = searchParams.get("habitId"); //編集モードの場合、URLにhabitIdを付与

  const { habits, addNewHabit, updateHabit } = useHabits();
  const editingHabit = habitId ? habits.find((h) => h.id === habitId) : undefined;
  const isEditMode = !!editingHabit;

  const [input, setInput] = useState<NewHabitInput>(() =>
    editingHabit
      ? {
          title: editingHabit.title,
          duration: editingHabit.duration ?? "90",
          time_block: editingHabit.time_block,
          target_days: editingHabit.target_days,
          type: editingHabit.type ?? "exercise",
          heaviness: editingHabit.heaviness,
        }
      : {
          title: "",
          duration: "90",
          time_block: "morning",
          target_days: "7",
          type: "exercise",
        }
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (key: keyof NewHabitInput, value: string) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.title.trim()) return;

    setIsSubmitting(true);
    try {
      if (isEditMode && habitId) {
        await updateHabit(habitId, input);
      } else {
        await addNewHabit(input);
      }
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to save habit:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-lumi-base text-lumi-fg">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-2xl mx-auto px-4 py-6 sm:px-6 sm:py-8 space-y-6"
      >
        {/* 戻るボタン */}
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="min-h-11 text-lumi-muted hover:text-lumi-fg hover:bg-lumi-surface gap-2 rounded-xl cursor-pointer transition-all duration-200"
          aria-label="ダッシュボードに戻る"
        >
          <ChevronLeft size={20} aria-hidden="true" />
          <span>ダッシュボードに戻る</span>
        </Button>

        {/* ページタイトル */}
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-lumi-fg">
            {isEditMode ? "習慣を編集する" : "新しい習慣を始める"}
          </h1>
          <p className="text-sm text-lumi-muted leading-relaxed">
            {isEditMode
              ? "内容を変更してLumiと一緒に続けましょう。"
              : "一歩ずつ、確実に。あなたの成長をLumiと一緒に記録しましょう。"}
          </p>
        </div>

        {/* フォームカード */}
        <Card className="bg-lumi-surface/50 backdrop-blur-md border border-lumi-border rounded-3xl overflow-hidden shadow-xl">
          <CardHeader className="border-b border-lumi-border/30 pb-6">
            <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-3">
              <div className="p-2.5 bg-lumi-primary/20 rounded-xl flex-shrink-0">
                {isEditMode
                  ? <Pencil className="text-lumi-primary" size={20} aria-hidden="true" />
                  : <Plus className="text-lumi-primary" size={20} aria-hidden="true" />
                }
              </div>
              <span className="text-lumi-muted text-base sm:text-lg">
                {isEditMode ? "習慣の編集" : "習慣の設定"}
              </span>
            </CardTitle>
            <CardDescription className="text-lumi-muted text-sm">
              習慣の名前とタイミングを決めてください。
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 px-4 sm:px-6 pb-8">
            <form onSubmit={handleSubmit} className="space-y-7">
              {/* 習慣名 */}
              <div className="space-y-2.5">
                <Label
                  htmlFor="title"
                  className="text-xs font-bold text-lumi-primary uppercase tracking-wider"
                >
                  習慣名
                </Label>
                <Input
                  id="title"
                  placeholder="例: 朝の読書、スクワット..."
                  value={input.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full h-12 rounded-2xl bg-lumi-base border-2 border-lumi-primary/30 hover:border-lumi-primary focus:border-lumi-primary text-lumi-fg placeholder:text-lumi-muted/50 transition-colors"
                  required
                  aria-required="true"
                />
              </div>

              {/* 時間帯 */}
              <div className="space-y-2.5">
                <Label className="text-xs font-bold text-lumi-primary uppercase tracking-wider">
                  実行する時間帯
                </Label>
                <TimeBlockSelector
                  value={input.time_block}
                  onChange={handleChange}
                />
              </div>

              {/* 習慣カテゴリ */}
              <div className="space-y-2.5">
                <Label className="text-xs font-bold text-lumi-primary uppercase tracking-wider">
                  登録する習慣の系統
                </Label>
                <HabitTypeCardList
                  value={input.type}
                  onChange={(typeName) => handleChange("type", typeName)}
                />
              </div>

              {/* 目標日数 */}
              <div className="space-y-2.5">
                <Label className="text-xs font-bold text-lumi-primary uppercase tracking-wider">
                  目標日数
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {["7", "14", "21", "30"].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleChange("target_days", day)}
                      className={`min-h-[52px] rounded-xl border font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lumi-primary ${
                        input.target_days === day
                          ? "bg-lumi-primary border-lumi-primary text-white shadow-lg"
                          : "bg-lumi-base/30 border-lumi-border text-lumi-muted hover:border-lumi-primary/50 hover:text-lumi-fg"
                      }`}
                      aria-pressed={input.target_days === day}
                      aria-label={`目標日数 ${day} 日`}
                    >
                      {input.target_days === day && <Check size={14} aria-hidden="true" />}
                      {day}日
                    </button>
                  ))}
                </div>
              </div>

              {/* 送信ボタン */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pt-2"
              >
                <Button
                  type="submit"
                  disabled={isSubmitting || !input.title.trim()}
                  className="w-full min-h-14 bg-lumi-primary hover:bg-lumi-primary-hover text-white font-black text-base rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  aria-label={isEditMode ? "変更を保存する" : "習慣を登録する"}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" aria-label="送信中..." />
                  ) : (
                    <>
                      <Check size={20} aria-hidden="true" />
                      <span>{isEditMode ? "変更を保存する" : "習慣を登録する"}</span>
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function RegisterHabitPage() {
  return (
    <Suspense>
      <RegisterHabitContent />
    </Suspense>
  );
}
