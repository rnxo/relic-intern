
export const TIME_BLOCK_MAX = {
    morning: 3,
    daytime: 5,
    night: 5,
    midnight: 2,
} as const;

export const TIME_BLOCK_HOURS = {
    morning: { start: 5, end: 11 },
    daytime: { start: 11, end: 18 },
    night: { start: 18, end: 24 },
    midnight: { start: 0, end: 5 },
} as const;

export type TimeBlock = keyof typeof TIME_BLOCK_MAX;

export function getTimeBlockByHour(hour: number): TimeBlock {
    if (hour >= 5 && hour < 11) return 'morning';
    if (hour >= 11 && hour < 18) return 'daytime';
    if (hour >= 18 && hour < 24) return 'night';
    return 'midnight';
}

export function isBlockPassed(block: TimeBlock, currentHour: number): boolean {
    const { end } = TIME_BLOCK_HOURS[block];
    // 深夜ブロックの特殊処理（0時〜5時）
    if (block === 'midnight') {
        return currentHour >= end;
    }
    return currentHour >= end;
}


export function calculateBlockPoints(timeBlock: TimeBlock, completedCount: number) {
    let tp = 0;
    let ep = 0;

    const max = TIME_BLOCK_MAX[timeBlock];

    // Exhaustion Point (Based on density and detailed table)
    if (completedCount > max) {
        ep = max; // "over" condition
    } else {
        // Based on the detailed tables provided
        if (max === 5) {
            if (completedCount >= 3) ep = 1;
            else ep = 0;
        } else if (max === 3) {
            if (completedCount >= 2) ep = 1;
            else ep = 0;
        } else if (max === 2) {
            if (completedCount >= 2) ep = 1;
            else ep = 0;
        }
    }

    // Trust Point (Based on detailed table)
    if (max === 5) {
        if (completedCount <= 1) tp = -1;
        else if (completedCount === 2) tp = 1;
        else if (completedCount === 3) tp = 1;
        else if (completedCount === 4) tp = 2;
        else if (completedCount >= 5) tp = 3;
    } else if (max === 3) {
        if (completedCount <= 1) tp = -2;
        else if (completedCount === 2) tp = 1;
        else if (completedCount >= 3) tp = 2;
    } else if (max === 2) {
        if (completedCount <= 1) tp = -1;
        else if (completedCount >= 2) tp = 2;
    }

    return { tp, ep };
}

export type PetGrowthStatus = {
    dailyTrust: number;
    dailyExhaustion: number;
    dailyEmotion: number;
    newTotalTrust: number;
    newTotalExhaustion: number;
    newTotalEmotion: number;
    willLevelUp: boolean;
    willLevelDown: boolean;

}

export function calculateExpression(trust: number, exhaustion: number): 'joy' | 'neutral' {
    if (trust >= 65 && exhaustion <= 30) {
        return "joy";
    }
    return "neutral";
}
