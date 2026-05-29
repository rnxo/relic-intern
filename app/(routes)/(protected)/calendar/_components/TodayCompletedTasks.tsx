'use client';

import { CheckCircle2 } from 'lucide-react';
import type { Habit } from '@/app/features/habit/habit.type';

interface Props {
    habits: Habit[];
}

function getTodayCompletedHabits(habits: Habit[]): Habit[] {
    const today = new Date().toISOString().split('T')[0];
    return habits.filter(h => {
        if (!h.is_completed) return false;
        const start = h.created_at.split('T')[0];
        const endDate = new Date(start);
        endDate.setDate(endDate.getDate() + parseInt(h.target_days) - 1);
        const end = endDate.toISOString().split('T')[0];
        return start <= today && end >= today;
    });
}

export default function TodayCompletedTasks({ habits }: Props) {
    const completed = getTodayCompletedHabits(habits);

    return (
        <div className="bg-lumi-surface/50 backdrop-blur-sm border border-lumi-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-lumi-fg">今日の達成済タスク</h3>
                <span className="text-xs text-lumi-muted bg-lumi-primary/10 text-lumi-primary px-2 py-0.5 rounded-full">
                    {completed.length}件
                </span>
            </div>

            {completed.length === 0 ? (
                <p className="text-sm text-lumi-muted text-center py-4">
                    まだ達成したタスクはありません
                </p>
            ) : (
                <ul className="flex flex-col gap-2">
                    {completed.map(habit => (
                        <li key={habit.id} className="flex items-center gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-lumi-primary flex-shrink-0" />
                            <span className="text-sm text-lumi-fg truncate">{habit.title}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
