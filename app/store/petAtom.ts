// app/store/petAtom.ts
import { atom } from "jotai";
import { Pet } from "../types/pet";

// リフレッシュ用の内部カウンタ
const petRefreshAtom = atom(0);

// Promise型を保持する非同期atom
export const petAtom = atom<Promise<Pet | null>>(async (get) => {
    // リフレッシュを検知
    get(petRefreshAtom);

    // SSRガード (Next.jsのビルド/サーバーサイド実行時)
    if (typeof window === "undefined") return null;

    try {
        const response = await fetch("/api/pet");
        if (!response.ok) return null;
        const data = await response.json();
        return data.pet;
    } catch (error) {
        console.error("Failed to fetch pet:", error);
        return null;
    }
});

// リフレッシュをトリガーするatom
export const refreshPetAtom = atom(
    null,
    (get, set) => set(petRefreshAtom, (prev) => prev + 1)
);


