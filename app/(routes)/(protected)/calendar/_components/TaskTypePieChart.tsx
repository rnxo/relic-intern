'use client';

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

const DUMMY_DATA = [
    { label: '完了', percent: 65, color: '#7aa2f7' },
    { label: '未完了', percent: 35, color: '#3b4a7a' },
];

export default function TaskTypePieChart() {
    let currentDeg = 0;
    const segments = DUMMY_DATA.map(d => {
        const start = currentDeg;
        const end = currentDeg + (d.percent / 100) * 360;
        currentDeg = end;
        return { ...d, start, end };
    });

    return (
        <div className="bg-[#24283b]/50 backdrop-blur-sm border border-[#414868] rounded-2xl p-6 h-full">
            <h3 className="text-base font-bold text-white mb-4">タスク完了率</h3>

            <div className="flex justify-center">
                <svg viewBox="0 0 220 220" className="w-48 h-48">
                    {segments.map(seg => (
                        <path
                            key={seg.label}
                            d={sectorPath(seg.start, seg.end)}
                            fill={seg.color}
                        />
                    ))}
                    {segments.map(seg => {
                        const pos = labelPos(seg.start, seg.end, R * 0.6);
                        return (
                            <text
                                key={seg.label}
                                x={pos.x}
                                y={pos.y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="white"
                                fontSize="14"
                                fontWeight="700"
                            >
                                {seg.percent}%
                            </text>
                        );
                    })}
                </svg>
            </div>

            <div className="flex justify-center gap-6 mt-2">
                {DUMMY_DATA.map(d => (
                    <div key={d.label} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-sm flex-shrink-0"
                            style={{ backgroundColor: d.color }}
                        />
                        <span className="text-xs text-[#9aa5ce]">{d.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
