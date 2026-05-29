'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Habit } from '@/app/features/habit/habit.type';

const CX = 110;
const CY = 110;
const R = 85;

function toRad(deg: number) {
    return (deg - 90) * (Math.PI / 180);
}

function sectorPath(startDeg: number, endDeg: number): string {
    const s = toRad(startDeg);
    const e = toRad(endDeg);
    const x1 = CX + R * Math.cos(s);
    const y1 = CY + R * Math.sin(s);
    const x2 = CX + R * Math.cos(e);
    const y2 = CY + R * Math.sin(e);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${CX} ${CY} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
}

function labelPos(startDeg: number, endDeg: number, offset: number) {
    const mid = toRad((startDeg + endDeg) / 2);
    return {
        x: (CX + offset * Math.cos(mid)).toFixed(2),
        y: (CY + offset * Math.sin(mid)).toFixed(2),
    };
}

const TYPE_COLORS: Record<string, string> = {
    'exercises': 'var(--color-red-400)',
    'study': 'var(--color-blue-400)',
    'meal': 'var(--color-green-400)',
    'sleeping': 'var(--color-indigo-400)',
    'others': 'var(--color-purple-400)',
};

const VIEWS = ['今日の予定', '達成の内訳'];

function getTodayHabits(habits: Habit[]): Habit[] {
    const today = new Date().toISOString().split('T')[0];
    return habits.filter(h => {
        const start = h.created_at.split('T')[0];
        const endDate = new Date(start);
        endDate.setDate(endDate.getDate() + parseInt(h.target_days) - 1);
        const end = endDate.toISOString().split('T')[0];
        return start <= today && end >= today;
    });
}

function buildSegments(habits: Habit[]) {
    if (habits.length === 0) return [];
    const typeCounts: Record<string, number> = {};
    habits.forEach(h => {
        const type = h.type ?? 'others';
        typeCounts[type] = (typeCounts[type] ?? 0) + 1;
    });
    const total = habits.length;
    let currentDeg = 0;
    return Object.entries(typeCounts).map(([type, count]) => {
        const start = currentDeg;
        const end = currentDeg + (count / total) * 360;
        currentDeg = end;
        return {
            label: type,
            percent: Math.round((count / total) * 100),
            color: TYPE_COLORS[type] ?? TYPE_COLORS['その他'],
            start,
            end,
        };
    });
}

interface Props {
    habits: Habit[];
}

export default function TaskTypePieChart({ habits }: Props) {
    const [viewIndex, setViewIndex] = useState(0);

    const prev = () => setViewIndex(i => (i - 1 + VIEWS.length) % VIEWS.length);
    const next = () => setViewIndex(i => (i + 1) % VIEWS.length);

    const todayHabits = getTodayHabits(habits);
    const targetHabits = viewIndex === 0
        ? todayHabits
        : todayHabits.filter(h => h.is_completed);

    const segments = buildSegments(targetHabits);

    const isEmpty = segments.length === 0;
    const emptyMessage = viewIndex === 0
        ? '今日のタスクはありません'
        : '達成済みのタスクはありません';

    return (
        <div className="bg-lumi-surface/50 backdrop-blur-sm border border-lumi-border rounded-2xl p-6 h-full">
            <h3 className="text-base font-bold text-lumi-fg mb-4">今日の習慣レポート</h3>

            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={prev}
                    className="p-2 text-lumi-muted hover:text-lumi-fg hover:bg-lumi-surface rounded-xl transition-all"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-base font-semibold text-lumi-fg">{VIEWS[viewIndex]}</span>
                <button
                    onClick={next}
                    className="p-2 text-lumi-muted hover:text-lumi-fg hover:bg-lumi-surface rounded-xl transition-all"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {isEmpty ? (
                <div className="flex items-center justify-center h-48">
                    <p className="text-sm text-lumi-muted">{emptyMessage}</p>
                </div>
            ) : (
                <>
                    <div className="flex justify-center">
                        <svg viewBox="0 0 220 220" className="w-48 h-48">
                            {segments.length === 1 ? (
                                <circle cx={CX} cy={CY} r={R} fill={segments[0].color} />
                            ) : (
                                segments.map(seg => (
                                    <path
                                        key={seg.label}
                                        d={sectorPath(seg.start, seg.end)}
                                        fill={seg.color}
                                    />
                                ))
                            )}
                            {segments.map(seg => {
                                if (seg.percent < 8) return null;
                                const pos = labelPos(seg.start, seg.end, R * 0.6);
                                return (
                                    <text
                                        key={seg.label}
                                        x={pos.x}
                                        y={pos.y}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill="white"
                                        fontSize="13"
                                        fontWeight="700"
                                    >
                                        {seg.percent}%
                                    </text>
                                );
                            })}
                        </svg>
                    </div>

                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-3">
                        {segments.map(d => (
                            <div key={d.label} className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-sm flex-shrink-0"
                                    style={{ backgroundColor: d.color }}
                                />
                                <span className="text-xs text-lumi-muted">{d.label}</span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
