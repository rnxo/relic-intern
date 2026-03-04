
import { atom } from "jotai";
import { habitsAtom } from "./habitAtom";
import { petAtom, refreshPetAtom } from "./petAtom";
import { testTimeAtom } from "./testTimeAtom";
import { calculateBlockPoints, TimeBlock, isBlockPassed, calculateExpression } from "../lib/petCalculations";

/**
 * 今日の活動による統計情報を計算する派生Atom
 */
export const dailyPetStatsAtom = atom(async (get) => {
    const habits = await get(habitsAtom);
    const pet = await get(petAtom);
    const testHour = get(testTimeAtom);

    if (!pet) return null;

    // 現在の時（テスト用設定があればそれを使う）
    const currentHour = testHour !== null ? testHour : new Date().getHours();
    const todayStr = new Date().toISOString().split('T')[0];

    // 今日完了したタスクを抽出
    const completedToday = habits.filter(h =>
        h.isCompleted && h.completedAt && h.completedAt.split('T')[0] === todayStr
    );

    const blocks: TimeBlock[] = ['morning', 'daytime', 'night', 'midnight'];

    let dailyTrust = 0;
    let dailyExhaustion = 0;

    blocks.forEach(block => {
        const count = completedToday.filter(h => h.timeBlock === block).length;

        // --- ここがポイント：時間を過ぎたブロックのみ信頼度/疲労度を計算に含める ---
        // ただし、もし上限を超えている(over)場合は、時間が過ぎていなくても疲労度は加算する
        // (ご要望が「時間を過ぎたら計算」なので、基本はPassed判定に従います)

        if (isBlockPassed(block, currentHour)) {
            const { tp, ep } = calculateBlockPoints(block, count);
            dailyTrust += tp;
            dailyExhaustion += ep;
        } else {
            // 時間を過ぎていないが、もし「達成数が上限を超えている」場合は
            // 疲労度のみ先行して反映させる（詰め込みすぎの警告として）
            const max = (block === 'morning' ? 3 : block === 'midnight' ? 2 : 5);
            if (count > max) {
                const { ep } = calculateBlockPoints(block, count);
                dailyExhaustion += ep;
            }
        }
    });

    const dailyEmotion = dailyTrust - dailyExhaustion;

    return {
        dailyTrust,
        dailyExhaustion,
        dailyEmotion,
        currentTotalTrust: pet.trust,
        currentTotalExhaustion: pet.exhaustion,
        currentTotalEmotion: pet.emotion,
        level: pet.level,
        currentHour
    };
});

/**
 * ペットの統計情報を更新するアクションAtom
 */
export const updatePetStatsAtom = atom(
    null,
    async (get, set, trustDelta: number, exhaustDelta: number) => {
        const pet = await get(petAtom);
        if (!pet) return;

        let nextTrust = pet.trust + trustDelta;
        let nextExhaustion = pet.exhaustion + exhaustDelta;
        let nextEmotion = pet.emotion + (trustDelta - exhaustDelta);
        let nextLevel = pet.level;

        if (nextTrust >= 100) {
            nextLevel += 1;
            nextTrust = 50;
            nextExhaustion = 0;
            nextEmotion = 0;
        } else if (nextExhaustion >= 100) {
            nextLevel = Math.max(0, nextLevel - 1);
            nextTrust = 0;
            nextExhaustion = 50;
            nextEmotion = 0;
        }

        const nextExpression = calculateExpression(nextTrust, nextExhaustion);
        const updates = {
            level: nextLevel,
            trust: nextTrust,
            exhaustion: nextExhaustion,
            emotion: nextEmotion,
            expression: nextExpression,
            updatedAt: new Date().toISOString()
        };

        try {
            const response = await fetch("/api/pet", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });

            if (response.ok) {
                set(refreshPetAtom);
            }
        } catch (error) {
            console.error("Failed to update pet stats:", error);
        }
    }
);
