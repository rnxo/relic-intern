import type { Habit } from "@/app/features/habit/habit.type";
import { useHabits } from "@/app/features/habit/habit.state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Circle, Trash2 } from "lucide-react";
import RegisterHabitDialog from "./RegisterHabitDialog";

export function HabitItem({ habit }: { habit: Habit }) {
    const { deleteHabit, completeHabit } = useHabits(); // toggleHabitを取得

    // 作成日からの経過日数を計算
    const createdAtDate = habit.created_at ? new Date(habit.created_at) : new Date();
    const elapsedDays = Math.floor((new Date().getTime() - createdAtDate.getTime()) / (1000 * 60 * 60 * 24));

    return (
        <Card className={`group relative w-full transition-all duration-300 ${habit.is_completed ? "bg-[#24283b]/20 opacity-80" : "bg-[#24283b]/40"
            } backdrop-blur-sm border border-[#414868] rounded-2xl overflow-hidden hover:border-[#7aa2f7]/50`}>
            <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-5">
                    {/* チェックボタン */}
                    <button
                        onClick={() => completeHabit(habit.id)}
                        className="relative hover:scale-110 transition-transform focus:outline-none"
                    >
                        <Circle size={28} className={habit.is_completed ? "text-[#7aa2f7]" : "text-[#414868]"} />
                        {habit.is_completed && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-4 h-4 bg-[#7aa2f7] rounded-full shadow-[0_0_10px_rgba(122,162,247,0.5)]" />
                            </div>
                        )}
                    </button>

                    <div className="space-y-1">
                        <span className={`text-lg font-bold transition-colors ${habit.is_completed ? "text-gray-500 line-through" : "text-white group-hover:text-[#7dcfff]"
                            }`}>
                            {habit.title}
                        </span>
                        <div className="flex gap-2 items-center">
                            {/* 継続日数の表示バッジ */}
                            {Number(habit.streak_days) > 0 && (
                                <span className="flex items-center gap-1 text-2xl font-bold text-orange-400">
                                    🔥 {habit.streak_days}日継続
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    { /*経過分の日数を表示*/}
                    <div className="text-xs font-semibold text-white uppercase tracking-widest bg-[#7aa2f7] rounded-full p-2">
                        <span>{elapsedDays}/{habit.target_days}</span>
                    </div>
                    <span className="text-xs font-semibold text-[#7aa2f7] uppercase tracking-widest">進行中</span>

                    <div className="flex gap-2 transition-opacity">
                        <RegisterHabitDialog habit={habit} />
                        <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-red-400/10 rounded-xl"
                            onClick={() => deleteHabit(habit.id)}>
                            <Trash2 size={16} color="red" className="hover:opacity-40 transition-opacity" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


