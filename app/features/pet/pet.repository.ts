import { createClient } from "@/app/lib/supabase/server";
import type { Pet, UpdatePetType } from "./pet.type";
import { getAuthUser } from "@/app/lib/auth";

/*
    petに必要なロジック
    - petデータの取得
    - petデータの更新
    - 
*/

interface IPetRepository {
    get: () => Promise<Pet>;
    update: (input: UpdatePetType) => Promise<Pet>;
}

export const petRepository: IPetRepository = {
    get: async () => {
        const supabase = await createClient();
        const user = await getAuthUser();

        if(!user) throw new Error("Unauthorized");

        const { data } = await supabase
            .from('pet')
            .select('*')
            .eq('user_id', user.id)
            .select()
            .single();
        
        if(!data) throw new Error("ERROR: failed to get pet data");
        return data as Pet;
    },
    update: async (input: UpdatePetType) => {
        const supabase = await createClient();
        const user = await getAuthUser();;
        
        if(!user) throw new Error("Unauthorized");

        const { data, error } = await supabase
            .from('pet')
            .update(input)
            .eq('user_id', user.id)
            .select()
            .single();
        console.log(JSON.stringify(input, null, 2));
        console.log(error);
        if(!data) throw new Error("ERROR: failed to update pet data");

        return data as Pet;
    }
}