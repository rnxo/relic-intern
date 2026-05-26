/*
    petに関するビジネスロジック
    - petデータの取得
    - petデータの更新
        - trustの計算結果の値を取得 -> pet.trust更新
        - exhaustionの計算結果の値を取得 -> pet.exhaustion更新
        - pet.trust & pet.exhaustionを元にpet.intimate_level更新
*/

import { petRepository } from "./pet.repository";
import type { Pet } from "./pet.type";

export const petService = {
    get: async () => petRepository.get(),
    update: async (input: Pet) => petRepository.update(input),
}