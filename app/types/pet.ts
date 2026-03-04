export type PetForm = 'lumi' | 'owl';

export type Pet = {
    id: string; // uuid
    level: number; // int8
    emotion: number; // int8
    trust: number; // int8
    exhaustion: number; // int8
    expression: 'happy' | 'sad' | 'angry' | 'neutral'; // text
    updatedAt: string; // timestamp (Date in DB, string in JSON)
}

/**
 * レベルに応じてペットの形態を判定する
 * Level 15以上 → フクロウ (夜型ユーザー向け)
 */
export function getPetForm(level: number): PetForm {
    if (level >= 15) return 'owl';
    return 'lumi';
}

