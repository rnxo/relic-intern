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
import { ChevronLeft, Pencil, Plus, Check } from "lucide-react";
import { motion } from "motion/react";
import { HabitTypeCardList } from "./_components/HabitTypeCardList";
import { DurationSelectorFiled } from "./_components/DurationSelectorField";

function RegisterHabitContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const habitId = searchParams.get("habitId");

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
    <div className="min-h-screen bg-[#1a1b26] text-white p-8 pl-28">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-2xl mx-auto space-y-8"
      >
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="text-[#9aa5ce] hover:text-white hover:bg-[#24283b] gap-2 rounded-xl"
        >
          <ChevronLeft size={20} />
          <span>ダッシュボードに戻る</span>
        </Button>

        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">
            {isEditMode ? "習慣を編集する" : "新しい習慣を始める"}
          </h1>
          <p className="text-gray-400">
            {isEditMode
              ? "内容を変更してLumiと一緒に続けましょう。"
              : "一歩ずつ、確実に。あなたの成長をLumiと一緒に記録しましょう。"}
          </p>
        </div>

        <Card className="bg-[#24283b]/50 backdrop-blur-md border border-[#414868] rounded-3xl overflow-hidden shadow-2xl">
          <CardHeader className="border-b border-[#414868]/30 pb-8">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="p-3 bg-[#7aa2f7]/20 rounded-2xl">
                {isEditMode
                  ? <Pencil className="text-[#7aa2f7]" size={24} />
                  : <Plus className="text-[#7aa2f7]" size={24} />
                }
              </div>
              <span className="text-[#9aa5ce]">
                {isEditMode ? "習慣の編集" : "習慣の設定"}
              </span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              習慣の名前とタイミングを決めてください。
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-8 px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title */}
              <div className="space-y-3">
                <Label
                  htmlFor="title"
                  className="text-sm font-bold text-[#7aa2f7] uppercase tracking-wider ml-1"
                >
                  習慣名
                </Label>
                <Input
                  id="title"
                  placeholder="例: 朝の読書、スクワット..."
                  value={input.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full h-12 rounded-2xl bg-lumi-base border-2 border-lumi-primary/30 hover:border-lumi-primary"
                  required
                />
              </div>

              <div className="space-y-3 flex-col">
                <Label className="text-sm font-bold text-lumi-primary">
                  所要時間
                </Label>
                <div className="flex justify-center">
                  <DurationSelectorFiled
                    value={input.duration}
                    onChange={(val) => handleChange("duration", val)}
                  />
                </div>
              </div>

              {/* Time Block */}
              <div className="space-y-3">
                <Label className="text-sm font-bold text-[#7aa2f7] uppercase tracking-wider ml-1">
                  実行する時間帯
                </Label>
                <TimeBlockSelector
                  value={input.time_block}
                  onChange={handleChange}
                />
              </div>

              {/* Habit Type */}
              <div className="space-y-3">
                <Label className="text-sm font-bold text-lumi-primary">
                  登録する習慣の系統
                </Label>
                <HabitTypeCardList
                  value={input.type}
                  onChange={(typeName) => handleChange("type", typeName)}
                />
              </div>

              {/* Target Days */}
              <div className="space-y-4">
                <Label className="text-sm font-bold text-[#7aa2f7] tracking-wider ml-1">
                  目標日数
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {["7", "14", "21", "30"].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleChange("target_days", day)}
                      className={`h-12 rounded-xl border font-bold transition-all flex items-center justify-center gap-2 ${
                        input.target_days === day
                          ? "bg-[#7aa2f7] border-[#7aa2f7] text-white shadow-[0_0_15px_rgba(122,162,247,0.3)]"
                          : "bg-[#1a1b26]/30 border-[#414868] text-gray-400 hover:border-[#7aa2f7]/50"
                      }`}
                    >
                      {input.target_days === day && <Check size={16} />}
                      {day}日
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pt-4"
              >
                <Button
                  type="submit"
                  disabled={isSubmitting || !input.title.trim()}
                  className="w-full h-16 bg-[#7aa2f7] hover:bg-[#7dcfff] text-white font-black text-xl rounded-2xl shadow-xl shadow-[#7aa2f7]/10 flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check size={24} />
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
