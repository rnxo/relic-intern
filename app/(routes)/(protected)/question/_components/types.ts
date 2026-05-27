export type OnboardingAnswers = {
    avg_task_duration: string;
    peak_performance_time: string;
    habit_type_ranking: string[];
    userBaseValue: { x: number; y: number };
    userBaseHabitPriority: {
        Exercise: number;
        Study: number;
        Meal: number;
        Sleep: number;
        Other: number;
    };
};

export const DURATION_SCORE: Record<string, number> = {
    under30: 1,
    under60: 2,
    under90: 3,
    under120: 4,
    over120: 5,
};

export const TIME_BLOCK_SCORE: Record<string, number> = {
    morning: 1,
    daytime: 2,
    evening: 3,
    night: 4,
    midnight: 5,
};

export const HABIT_NAME_TO_KEY: Record<string, keyof OnboardingAnswers["userBaseHabitPriority"]> = {
    運動: "Exercise",
    学習: "Study",
    食事: "Meal",
    睡眠: "Sleep",
    その他: "Other",
};
