import { cva } from 'class-variance-authority';

const dayCell = cva(
  "flex aspect-square w-full items-center justify-center rounded-[3px] border",
  {
    variants: {
      checked: {
        true: "border-solid border-lumi-primary bg-lumi-primary",
        false: "border-dashed border-lumi-border bg-transparent",
      },
    },
    defaultVariants: {
      checked: false,
    },
  }
);

type dummyData = {
  date: string;
  checked: boolean;
};

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];

export function CalendarHeatmap() {
  const dummyData: dummyData[] = [
    { date: '1', checked: true },
    { date: '2', checked: false },
    { date: '3', checked: true },
    { date: '4', checked: false },
    { date: '5', checked: true },
    { date: '6', checked: true },
    { date: '7', checked: false },
    { date: '8', checked: false },
    { date: '9', checked: false },
    { date: '10', checked: true },
    { date: '11', checked: false },
    { date: '12', checked: true },
    { date: '13', checked: false },
  ];

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
        {dummyData.map((d) => (
          <div
            key={d.date}
            className={dayCell({ checked: d.checked})}
          >
            <span className="text-center">{d.date}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        <span className="inline-block h-[11px] w-[11px] rounded-[3px] border border-dashed border-lumi-border bg-transparent" />
        <span className="text-[10.5px] text-lumi-muted">未達成</span>
        <span className="ml-2 inline-block h-[11px] w-[11px] rounded-[3px] border border-solid border-lumi-primary bg-lumi-primary" />
        <span className="text-[10.5px] text-lumi-muted">達成</span>
      </div>
    </div>
  );
}
