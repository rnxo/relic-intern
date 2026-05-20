import { createClient } from "@/app/lib/supabase/server";
import type { Pet } from "./pet.type";

/*
    petに必要なロジック
    - petデータの取得
    - petデータの更新
    - 
*/

interface IPetRepository {
    get: () => Promise<Pet>;
    update: (input: Pet) => Promise<Pet>;
}

export const petRepository: IPetRepository = {
    get: async () => {
        const supabase = await createClient();
        const { data: { user }} = await supabase.auth.getUser();

        if(!user) throw new Error("Unauthorized");

        const { data } = await supabase
            .from('pet')
            .select('*')
            .eq('user_id', user.id)
            .single();
        
        if(!data) throw new Error("ERROR: failed to get pet data");
        return data as Pet;
    },
    update: async (input: Pet) => {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if(!user) throw new Error("Unauthorized");

        const { data } = await supabase
            .from('pet')
            .update(input)
            .eq('user_id', user.id)
            .single();
        
        if(!data) throw new Error("ERROR: failed to update pet data");

        return data as Pet;
    }
}