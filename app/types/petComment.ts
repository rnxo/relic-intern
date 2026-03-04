/**
 * Supabase `pet_comment` テーブルと対応する型
 *
 * テーブル構成:
 *   id         : uuid         (PK, default: gen_random_uuid())
 *   pet_id     : uuid         (FK → pet.id)
 *   message    : text
 *   expression : text         ('happy' | 'sad' | 'angry' | 'neutral')
 *   created_at : timestamptz  (default: now())
 */
export type PetComment = {
    id: string;           // uuid
    petId: string;        // uuid (FK → pet.id) → DBカラム名: pet_id
    message: string;      // text: Geminiが生成したセリフ
    expression: 'happy' | 'sad' | 'angry' | 'neutral'; // text
    createdAt: string;    // timestamptz → DBカラム名: created_at
};

/**
 * Supabase INSERT 時に使う型（id・created_at はDB自動生成なので省略）
 */
export type NewPetComment = Omit<PetComment, 'id' | 'createdAt'>;
