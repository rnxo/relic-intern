const PRIMARY = "#7fa2e6";
const MID = "#5a85cc";

function ExerciseIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
      {/* Left plate */}
      <rect x="1" y="14" width="11" height="16" rx="4" fill={PRIMARY} />
      <rect x="3" y="17" width="3" height="10" rx="1.5" fill="white" opacity="0.35" />
      {/* Bar */}
      <rect x="12" y="19" width="20" height="6" rx="3" fill={MID} />
      {/* Right plate */}
      <rect x="32" y="14" width="11" height="16" rx="4" fill={PRIMARY} />
      <rect x="34" y="17" width="3" height="10" rx="1.5" fill="white" opacity="0.35" />
    </svg>
  );
}

function StudyIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
      {/* Left page */}
      <path d="M22 10 C18 10 8 12 6 16 L6 36 C8 32 18 32 22 34 Z" fill={PRIMARY} />
      {/* Right page */}
      <path d="M22 10 C26 10 36 12 38 16 L38 36 C36 32 26 32 22 34 Z" fill={MID} />
      {/* Spine */}
      <path d="M22 10 L22 34" stroke="#1c2238" strokeWidth="2" strokeLinecap="round" />
      {/* Left text lines */}
      <line x1="10" y1="19" x2="20" y2="18" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="10" y1="23" x2="20" y2="22" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="10" y1="27" x2="18" y2="26" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      {/* Right text lines */}
      <line x1="24" y1="18" x2="34" y2="19" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="24" y1="22" x2="34" y2="23" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="26" y1="26" x2="34" y2="27" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

function SleepIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
      {/* Crescent moon using evenodd fill rule */}
      {/* Outer circle: cx=18, cy=22, r=14 | Inner (cutout) circle: cx=23, cy=17, r=11 */}
      <path
        fillRule="evenodd"
        d="M 32 22 A 14 14 0 1 0 4 22 A 14 14 0 1 0 32 22 Z M 34 17 A 11 11 0 1 0 12 17 A 11 11 0 1 0 34 17 Z"
        fill={PRIMARY}
      />
      {/* Stars */}
      <circle cx="36" cy="8" r="2.5" fill={PRIMARY} />
      <circle cx="41" cy="20" r="1.8" fill={PRIMARY} />
      <circle cx="37" cy="33" r="1.5" fill={PRIMARY} />
    </svg>
  );
}

function MealIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
      {/* Steam */}
      <path d="M 15 17 C 11 13 19 10 15 6" stroke={PRIMARY} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M 22 16 C 18 12 26 9 22 5" stroke={PRIMARY} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M 29 17 C 25 13 33 10 29 6" stroke={PRIMARY} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Bowl body */}
      <path d="M 6 24 Q 6 39 22 39 Q 38 39 38 24 Z" fill={PRIMARY} />
      {/* Bowl rim */}
      <rect x="5" y="19" width="34" height="7" rx="3.5" fill={MID} />
      {/* Rim highlight */}
      <rect x="8" y="21" width="12" height="2.5" rx="1.25" fill="white" opacity="0.4" />
    </svg>
  );
}

function OtherIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
      {/* 4-point sparkle */}
      <path
        d="M 22 4 L 27 17 L 40 22 L 27 27 L 22 40 L 17 27 L 4 22 L 17 17 Z"
        fill={PRIMARY}
      />
      {/* Small accent dots at corners */}
      <circle cx="10" cy="10" r="2" fill={PRIMARY} opacity="0.55" />
      <circle cx="34" cy="10" r="2" fill={PRIMARY} opacity="0.55" />
      <circle cx="10" cy="34" r="2" fill={PRIMARY} opacity="0.55" />
      <circle cx="34" cy="34" r="2" fill={PRIMARY} opacity="0.55" />
      {/* Center shine */}
      <circle cx="22" cy="22" r="5" fill="white" opacity="0.35" />
    </svg>
  );
}


export function HabitTypeIcon({ type, size = 40 }: { type: string; size?: number }) {
  switch (type) {
    case "運動": return <ExerciseIcon size={size} />;
    case "学習": return <StudyIcon size={size} />;
    case "睡眠": return <SleepIcon size={size} />;
    case "食事": return <MealIcon size={size} />;
    case "その他": return <OtherIcon size={size} />;
  }
}
