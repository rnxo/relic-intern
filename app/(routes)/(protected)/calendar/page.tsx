'use client';

import { useState, Suspense } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHabits } from '@/app/features/habit/habit.state';
import MonthView from './_components/MonthView';
import TaskTypePieChart from './_components/TaskTypePieChart';

function CalendarContent() {
    const { habits } = useHabits();
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());

    const monthLabel = `${year}年 ${month + 1}月`;

    const prevMonth = () => {
        if (month === 0) { setYear(y => y - 1); setMonth(11); }
        else setMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (month === 11) { setYear(y => y + 1); setMonth(0); }
        else setMonth(m => m + 1);
    };

    return (
        <div className="flex flex-col h-screen bg-lumi-base px-8 py-6">
            <p className="text-lumi-muted text-sm mb-4">成長の軌跡を見よう</p>

            <div className="flex gap-6 flex-1 items-start min-h-0">
                {/* 左カラム: カレンダー */}
                <div className="flex flex-col flex-1 min-w-0 h-full">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={prevMonth}
                            className="p-2 text-[#9aa5ce] hover:text-white hover:bg-lumi-surface rounded-xl transition-all"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-lg font-bold text-white">{monthLabel}</span>
                        <button
                            onClick={nextMonth}
                            className="p-2 text-[#9aa5ce] hover:text-white hover:bg-lumi-surface rounded-xl transition-all"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                    <MonthView year={year} month={month} habits={habits} className="flex-1" />
                </div>

                {/* 右カラム: 円グラフ */}
                <div className="w-72 flex-shrink-0">
                    <TaskTypePieChart />
                </div>
            </div>
        </div>
    );
}

export default function CalendarPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-lumi-base">
                <div className="w-8 h-8 border-2 border-lumi-primary border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <CalendarContent />
        </Suspense>
    );
}
