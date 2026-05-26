'use client';

import { useMemo } from 'react';
import type { Habit } from '@/app/features/habit/habit.type';

interface MonthViewProps {
    year: number;
    month: number;
    habits: Habit[];
}

export default function MonthView({ year, month, habits }: MonthViewProps) {
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

    // 習慣ごとの表示期間を計算（created_at〜created_at + target_days - 1日）
    const habitRanges = useMemo(() =>
        habits.map(h => {
            const start = h.created_at.split('T')[0];
            const startDate = new Date(start);
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + parseInt(h.target_days) - 1);
            return {
                habit: h,
                start,
                end: endDate.toISOString().split('T')[0],
            };
        }),
        [habits]
    );

    // その週と重なる習慣を、何列目〜何列目に描画するか付きで返す
    function getWeekHabits(week: typeof cells) {
        const weekStart = week[0].dateStr;
        const weekEnd = week[6].dateStr;

        return habitRanges
            .filter(({ start, end }) => start <= weekEnd && end >= weekStart)
            .map(({ habit, start, end }) => {
                let startCol = 1;
                let endCol = 7;

                for (let i = 0; i < 7; i++) {
                    if (week[i].dateStr < start) startCol = i + 2;
                    else break;
                }
                for (let i = 6; i >= 0; i--) {
                    if (week[i].dateStr > end) endCol = i;
                    else break;
                }

                return { habit, startCol, endCol };
            });
    }

    return (
        <div className="w-full rounded-2xl border border-[#414868]/40 overflow-hidden">
            {/* 曜日ヘッダー */}
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

            {/* 週ごとの行 */}
            {weeks.map((week, wi) => {
                const weekHabits = getWeekHabits(week);
                return (
                    <div key={wi} className={`border-b border-[#414868]/30 ${wi === weeks.length - 1 ? 'border-b-0' : ''}`}>
                        {/* 日付数字 */}
                        <div className="grid grid-cols-7">
                            {week.map((cell, di) => {
                                const isToday = cell.dateStr === todayStr;
                                return (
                                    <div
                                        key={cell.dateStr}
                                        className={`p-2 border-r border-[#414868]/30 last:border-r-0 ${!cell.currentMonth ? 'opacity-30' : ''}`}
                                    >
                                        <span
                                            className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${
                                                isToday
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
                                    </div>
                                );
                            })}
                        </div>

                        {/* 習慣バー */}
                        <div className={`grid grid-cols-7 gap-y-1 px-1 ${weekHabits.length > 0 ? 'pb-2' : 'h-8'}`}>
                            {weekHabits.map(({ habit, startCol, endCol }) => (
                                <div
                                    key={habit.id}
                                    style={{
                                        gridColumnStart: startCol,
                                        gridColumnEnd: endCol + 1,
                                    }}
                                    className="bg-emerald-500/80 rounded px-2 py-0.5 text-white text-xs font-medium truncate"
                                >
                                    {habit.title}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
