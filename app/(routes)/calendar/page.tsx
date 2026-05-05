'use client';

import { useState, Suspense } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAtomValue } from 'jotai';
import { habitsAtom } from '@/app/store/habitAtom';
import MonthView from './_components/MonthView';

type TabType = 'day' | 'week' | 'month';

function CalendarContent() {
    const habits = useAtomValue(habitsAtom);
    const today = new Date();
    const [tab, setTab] = useState<TabType>('month');
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

            {/* Tab switcher */}
            <div className="flex bg-[#24283b] rounded-2xl p-1 mb-6">
                {(['day', 'week', 'month'] as TabType[]).map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${tab === t
                            ? 'bg-[#7aa2f7] text-white shadow-md'
                            : 'text-[#9aa5ce] hover:text-[#c0caf5]'
                            }`}
                    >
                        {t === 'day' ? 'Day' : t === 'week' ? 'Week' : 'Month'}
                    </button>
                ))}
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
            {tab === 'month' && (
                <MonthView year={year} month={month} habits={habits} />
            )}
            {tab === 'week' && (
                <div className="flex-1 flex items-center justify-center text-[#9aa5ce]">
                    週表示は準備中です
                </div>
            )}
            {tab === 'day' && (
                <div className="flex-1 flex items-center justify-center text-[#9aa5ce]">
                    日表示は準備中です
                </div>
            )}
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
