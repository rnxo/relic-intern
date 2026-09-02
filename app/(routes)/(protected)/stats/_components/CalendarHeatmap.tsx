import { cva } from 'class-variance-authority';
import type { DailyHeatmapCell } from '../_lib/dummyMonthlyHeatmap';

const dayCell = cva(
  "flex aspect-square w-full items-center justify-center rounded-[3px] border text-xs",
  {
    variants: {
      checked: {
        true: "border-solid border-lumi-primary bg-lumi-primary text-lumi-base",
        false: "border-dashed border-lumi-border bg-transparent",
      },
    },
    defaultVariants: {
      checked: false,
    },
  }
);

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];

type CalendarHeatmapProps = {
  cells: DailyHeatmapCell[];
};

export function CalendarHeatmap({ cells }: CalendarHeatmapProps) {
  // 1日が実際の曜日列に来るよう、月初の曜日番号(0=日)分だけ空セルを差し込む
  const leadingBlanks = cells.length > 0 ? cells[0].weekday : 0;

  return (
    <div className="mb-3 rounded-xl bg-lumi-surface/60 p-3">
      <div className="mb-2 grid grid-cols-7 gap-2">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className="w-full text-center text-sm text-lumi-muted">
            {label}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <div key={`blank-${i}`} aria-hidden="true" />
        ))}
        {cells.map((cell) => (
          <div key={cell.day} className={dayCell({ checked: cell.isChecked })}>
            <span className="text-center">{cell.day}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        <span className="inline-block h-[11px] w-[11px] rounded-[3px] border border-dashed border-lumi-border bg-transparent" />
        <span className="text-[10.5px] text-lumi-muted">unchecked</span>
        <span className="ml-2 inline-block h-[11px] w-[11px] rounded-[3px] border border-solid border-lumi-primary bg-lumi-primary" />
        <span className="text-[10.5px] text-lumi-muted">checked</span>
      </div>
    </div>
  );
}
