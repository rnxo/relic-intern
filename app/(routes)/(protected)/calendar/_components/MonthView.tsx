'use client';

import { useMemo, useState } from 'react';
import type { Habit } from '@/app/features/habit/habit.type';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface MonthViewProps {
    year: number;
    month: number;
    habits: Habit[];
    className?: string;
}

export default function MonthView({ year, month, habits, className = '' }: MonthViewProps) {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

    const MAX_VISIBLE_HABITS = 4;
    const dayLabels = ['日', '月', '火', '水', '木', '金', '土'];

    function getHabitsForDate(dateStr: string): Habit[] {
        return habitRanges
            .filter(({ start, end }) => start <= dateStr && end >= dateStr)
            .map(({ habit }) => habit);
    }

    function formatSelectedDate(dateStr: string): string {
        const d = new Date(dateStr);
        return `${d.getMonth() + 1}月${d.getDate()}日`;
    }

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
        <>
        <div className={`w-full rounded-2xl border border-lumi-border/40 overflow-hidden flex flex-col ${className}`}>
            {/* 曜日ヘッダー */}
            <div className="grid grid-cols-7 border-b border-lumi-border/40 flex-shrink-0">
                {dayLabels.map((label, i) => (
                    <div
                        key={label}
                        className={`py-3 text-center text-sm font-medium ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-lumi-muted'}`}
                    >
                        {label}
                    </div>
                ))}
            </div>

            {/* 週ごとの行 */}
            {weeks.map((week, wi) => {
                const weekHabits = getWeekHabits(week);
                const visibleHabits = weekHabits.slice(0, MAX_VISIBLE_HABITS);
                const hiddenHabits = weekHabits.slice(MAX_VISIBLE_HABITS);

                // 非表示習慣が各日(col 1〜7)で何件あるか
                const hiddenCountByCol = Array(7).fill(0);
                hiddenHabits.forEach(({ startCol, endCol }) => {
                    for (let col = startCol; col <= endCol; col++) {
                        hiddenCountByCol[col - 1]++;
                    }
                });
                const hasOverflow = hiddenCountByCol.some(c => c > 0);

                return (
                    <div key={wi} className={`flex flex-col flex-1 border-b border-lumi-border/30 ${wi === weeks.length - 1 ? 'border-b-0' : ''}`}>
                        {/* 日付数字 */}
                        <div className="grid grid-cols-7">
                            {week.map((cell, di) => {
                                const isToday = cell.dateStr === todayStr;
                                return (
                                    <div
                                        key={cell.dateStr}
                                        onClick={() => setSelectedDate(cell.dateStr)}
                                        className={`p-2 border-r border-lumi-border/30 last:border-r-0 cursor-pointer hover:bg-lumi-surface/50 transition-colors ${!cell.currentMonth ? 'opacity-30' : ''}`}
                                    >
                                        <span
                                            className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${
                                                isToday
                                                    ? 'bg-lumi-primary text-white'
                                                    : di === 0
                                                    ? 'text-red-400'
                                                    : di === 6
                                                    ? 'text-blue-400'
                                                    : 'text-lumi-fg'
                                            }`}
                                        >
                                            {cell.day}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* 習慣バー（最大4件） */}
                        <div className={`grid grid-cols-7 gap-y-0.5 px-0.5 pt-0.5 items-start content-start ${visibleHabits.length > 0 ? 'pb-0.5' : ''}`}>
                            {visibleHabits.map(({ habit, startCol, endCol }) => (
                                <div
                                    key={habit.id}
                                    style={{
                                        gridColumnStart: startCol,
                                        gridColumnEnd: endCol + 1,
                                    }}
                                    className="bg-emerald-500/80 rounded-sm px-1 leading-4 text-white text-[10px] font-medium truncate"
                                >
                                    {habit.title}
                                </div>
                            ))}
                        </div>

                        {/* オーバーフロー表示 */}
                        {hasOverflow && (
                            <div className="grid grid-cols-7 px-0.5 pb-1 flex-1">
                                {hiddenCountByCol.map((count, di) => (
                                    <div key={di} className="px-1 text-[9px] text-lumi-muted">
                                        {count > 0 ? `+${count}` : ''}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>

        <Dialog open={selectedDate !== null} onOpenChange={(open) => { if (!open) setSelectedDate(null); }}>

            <DialogContent className="bg-lumi-surface border-lumi-border text-lumi-fg max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-lumi-fg">
                        {selectedDate ? formatSelectedDate(selectedDate) : ''}
                    </DialogTitle>
                </DialogHeader>
                {selectedDate && (() => {
                    const dayHabits = getHabitsForDate(selectedDate);
                    return dayHabits.length === 0 ? (
                        <p className="text-lumi-muted text-sm">この日のタスクはありません</p>
                    ) : (
                        <ul className="flex flex-col gap-2">
                            {dayHabits.map(habit => (
                                <li key={habit.id} className="flex items-center gap-2 text-sm">
                                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${habit.is_completed ? 'bg-lumi-primary' : 'bg-lumi-border'}`} />
                                    <span className={habit.is_completed ? 'line-through text-lumi-muted' : 'text-lumi-fg'}>
                                        {habit.title}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    );
                })()}
            </DialogContent>
        </Dialog>
        </>
    );
}
