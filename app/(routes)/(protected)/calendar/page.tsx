'use client';

import { useState, Suspense } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHabits } from '@/app/features/habit/habit.state';
import MonthView from './_components/MonthView';

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
        <div className="flex flex-col min-h-screen bg-[#1a1b26] px-8 py-10">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#7aa2f7] to-[#7dcfff] flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl font-bold">L</span>
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">あなたの記録</h1>
                    <p className="text-[#9aa5ce] text-sm mt-0.5">成長の軌跡を見よう</p>
                </div>
            </div>

            {/* Month navigation */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={prevMonth}
                    className="p-2 text-[#9aa5ce] hover:text-white hover:bg-[#24283b] rounded-xl transition-all"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-lg font-bold text-white">{monthLabel}</span>
                <button
                    onClick={nextMonth}
                    className="p-2 text-[#9aa5ce] hover:text-white hover:bg-[#24283b] rounded-xl transition-all"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Calendar */}
            <MonthView year={year} month={month} habits={habits} />
        </div>
    );
}

export default function CalendarPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-[#1a1b26]">
                <div className="w-8 h-8 border-2 border-[#7aa2f7] border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <CalendarContent />
        </Suspense>
    );
}
