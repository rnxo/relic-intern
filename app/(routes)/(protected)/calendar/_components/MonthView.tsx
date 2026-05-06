'use client';

import { useMemo } from 'react';
import { Habit } from '@/app/types/habit';

interface MonthViewProps {
    year: number;
    month: number;
    habits: Habit[];
}

function getEmojiForDay(completedCount: number, totalCount: number): string | null {
    if (completedCount === 0) return null;
    const ratio = completedCount / Math.max(totalCount, 1);
    if (ratio >= 1) return '🤩';
    if (ratio >= 0.5) return '😊';
    return '😐';
}

export default function MonthView({ year, month, habits }: MonthViewProps) {
    const completionMap = useMemo(() => {
        const map: Record<string, { completed: number; total: number }> = {};
        for (const habit of habits) {
            const dateKey = habit.completedAt?.split('T')[0];
            if (dateKey) {
                if (!map[dateKey]) map[dateKey] = { completed: 0, total: 0 };
                map[dateKey].completed += 1;
            }
        }
        return map;
    }, [habits]);

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells: { day: number; currentMonth: boolean; dateStr: string }[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
        const d = daysInPrevMonth - i;
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevYear = month === 0 ? year - 1 : year;
        cells.push({
            day: d,
            currentMonth: false,
            dateStr: `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
        });
    }

    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({
            day: d,
            currentMonth: true,
            dateStr: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
        });
    }

    const remaining = 7 - (cells.length % 7);
    if (remaining < 7) {
        const nextMonth = month === 11 ? 0 : month + 1;
        const nextYear = month === 11 ? year + 1 : year;
        for (let d = 1; d <= remaining; d++) {
            cells.push({
                day: d,
                currentMonth: false,
                dateStr: `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
            });
        }
    }

    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) {
        weeks.push(cells.slice(i, i + 7));
    }

    const dayLabels = ['日', '月', '火', '水', '木', '金', '土'];

    return (
        <div className="w-full rounded-2xl border border-[#414868]/40 overflow-hidden">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-[#414868]/40">
                {dayLabels.map((label, i) => (
                    <div
                        key={label}
                        className={`py-3 text-center text-sm font-medium ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-[#9aa5ce]'}`}
                    >
                        {label}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            {weeks.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7">
                    {week.map((cell, di) => {
                        const isToday = cell.dateStr === todayStr;
                        const stat = completionMap[cell.dateStr];
                        const emoji = stat ? getEmojiForDay(stat.completed, habits.length) : null;

                        return (
                            <div
                                key={cell.dateStr}
                                className={`min-h-24 p-2 border-b border-r border-[#414868]/30 flex flex-col ${!cell.currentMonth ? 'opacity-30' : ''} ${wi === weeks.length - 1 ? 'border-b-0' : ''} ${di === 6 ? 'border-r-0' : ''}`}
                            >
                                <span
                                    className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${isToday
                                        ? 'bg-[#7aa2f7] text-white'
                                        : di === 0
                                            ? 'text-red-400'
                                            : di === 6
                                                ? 'text-blue-400'
                                                : 'text-[#c0caf5]'
                                        }`}
                                >
                                    {cell.day}
                                </span>
                                {emoji && (
                                    <span className="mt-auto text-xl self-end pr-1 pb-1">{emoji}</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
