/* 
    petに必要なデータ
    - id
    - user_id
    - intimate_level 親密レベル
    - trust
    - exhaustion
    - expression 
    - updated_at
    - created_at
    - 
*/

export type Pet = {
    id: string;
    user_id: string;
    intimate_level: number;
    trust: number;
    exhaustion: number;
    expression: 'joy' | 'neutral';
    updated_at?: string;
    created_at?: string;
}

export type GetTrustArg = Pick<Pet, 'trust'>