"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useHabits } from "@/app/hooks/habitHooks";
import { Habit } from "@/app/types/habit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { ChevronLeft, Plus, Check } from "lucide-react";
import { motion } from "motion/react";

export default function RegisterHabitPage() {
    const router = useRouter();
    const { addNewHabit } = useHabits();

    const [title, setTitle] = useState("");
    const [timeBlock, setTimeBlock] = useState<Habit['timeBlock']>("morning");
    const [streakDays, setStreakDays] = useState("7");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsSubmitting(true);
        try {
            await addNewHabit({ title, timeBlock, streakDays });
            router.push("/dashboard");
        } catch (error) {
            console.error("Failed to add habit:", error);
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
                    onClick={() => router.back()}
                    className="text-[#9aa5ce] hover:text-white hover:bg-[#24283b] gap-2 rounded-xl"
                >
                    <ChevronLeft size={20} />
                    <span>ダッシュボードに戻る</span>
                </Button>

                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold tracking-tight">新しい習慣を始める</h1>
                    <p className="text-gray-400">一歩ずつ、確実に。あなたの成長をLumiと一緒に記録しましょう。</p>
                </div>

                <Card className="bg-[#24283b]/50 backdrop-blur-md border border-[#414868] rounded-3xl overflow-hidden shadow-2xl">
                    <CardHeader className="border-b border-[#414868]/30 pb-8">
                        <CardTitle className="text-2xl font-bold flex items-center gap-3">
                            <div className="p-3 bg-[#7aa2f7]/20 rounded-2xl">
                                <Plus className="text-[#7aa2f7]" size={24} />
                            </div>
                            <span className="text-[#9aa5ce]">習慣の設定</span>
                        </CardTitle>
                        <CardDescription className="text-gray-400">習慣の名前とタイミングを決めてください。</CardDescription>
                    </CardHeader>

                    <CardContent className="pt-8 px-8 pb-10">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Title */}
                            <div className="space-y-3">
                                <Label htmlFor="title" className="text-sm font-bold text-[#7aa2f7] uppercase tracking-wider ml-1">習慣名</Label>
                                <Input
                                    id="title"
                                    placeholder="例: 朝の読書、スクワット..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="h-14 bg-[#1a1b26]/50 border-[#414868] rounded-2xl text-lg focus:ring-2 focus:ring-[#7aa2f7] transition-all placeholder:text-gray-600 text-white"
                                    required
                                />
                            </div>

                            {/* Time Block */}
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-[#7aa2f7] uppercase tracking-wider ml-1">実行する時間帯</Label>
                                <Select value={timeBlock} onValueChange={(val: any) => setTimeBlock(val)}>
                                    <SelectTrigger className="h-14 bg-[#1a1b26]/50 border-[#414868] rounded-2xl text-white focus:ring-2 focus:ring-[#7aa2f7] transition-all">
                                        <SelectValue placeholder="時間帯を選択" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1a1b26] border-[#414868] text-white rounded-2xl">
                                        <SelectGroup>
                                            <SelectLabel className="text-gray-500">タイムブロック</SelectLabel>
                                            <SelectItem value="morning" className="focus:bg-[#24283b] focus:text-[#7aa2f7]">Morning (6:00 - 9:00)</SelectItem>
                                            <SelectItem value="daytime" className="focus:bg-[#24283b] focus:text-[#7aa2f7]">Daytime (12:00 - 15:00)</SelectItem>
                                            <SelectItem value="night" className="focus:bg-[#24283b] focus:text-[#7aa2f7]">Night (18:00 - 21:00)</SelectItem>
                                            <SelectItem value="midnight" className="focus:bg-[#24283b] focus:text-[#7aa2f7]">Midnight (21:00 - 24:00)</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Target Days */}
                            <div className="space-y-4">
                                <Label className="text-sm font-bold text-[#7aa2f7] uppercase tracking-wider ml-1">目標日数</Label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {["7", "14", "21", "30"].map((day) => (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => setStreakDays(day)}
                                            className={`h-12 rounded-xl border font-bold transition-all flex items-center justify-center gap-2 ${streakDays === day
                                                ? "bg-[#7aa2f7] border-[#7aa2f7] text-white shadow-[0_0_15px_rgba(122,162,247,0.3)]"
                                                : "bg-[#1a1b26]/30 border-[#414868] text-gray-400 hover:border-[#7aa2f7]/50"
                                                }`}
                                        >
                                            {streakDays === day && <Check size={16} />}
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
                                    disabled={isSubmitting || !title.trim()}
                                    className="w-full h-16 bg-[#7aa2f7] hover:bg-[#7dcfff] text-white font-black text-xl rounded-2xl shadow-xl shadow-[#7aa2f7]/10 flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Check size={24} />
                                            <span>習慣を登録する</span>
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
