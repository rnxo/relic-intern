import { atom } from "jotai";

/**
 * テスト用の時間を保持するAtom
 * nullの場合は現在の時刻を使用する
 */
export const testTimeAtom = atom<number | null>(null);
