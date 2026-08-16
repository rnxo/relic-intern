import { getAuthUser } from "@/app/lib/auth";
import type { Habit, NewHabitInput, UpdateHabitInput } from "./habit.type";
import { createClient } from "@/app/lib/supabase/server";
import { getElapsedDays } from "@/app/utils/getElapsedDays";



interface IHabitRepository {
    getAll:() => Promise<Habit[]>;
    getById: (id: string) => Promise<Habit>;
    create: (input: NewHabitInput) => Promise<Habit>;
    update: (id: string, input: UpdateHabitInput) => Promise<Habit>;
    delete: (id: string) => void;
}

export const habitRepository: IHabitRepository = {
    getAll: async () => {
        const supabase = await createClient();
        const user = await getAuthUser();

        if(!user) throw new Error("unauthorized user is trying to get some secured data");

        const todayStr = new Date().toISOString().split('T')[0];

        const { error: resetError } = await supabase
            .from('habits')
            .update({ is_checked: false })
            .eq('user_id', user.id)
            .eq('is_checked', true)
            .lt('checked_at', todayStr);

        if(resetError) throw new Error(resetError.message);

        const { data, error } = await supabase
            .from('habits')
            .select('*')
            .eq('user_id', user.id);

        if(error) throw new Error(error.message);

        const habits = data as Habit[];

        const idsToComplete = habits
            .filter((h) => !h.is_completed && getElapsedDays(h.created_at) > Number(h.target_days))
            .map((h) => h.id);

        if(idsToComplete.length > 0) {
            const { error: completeError } = await supabase
                .from('habits')
                .update({ is_completed: true })
                .in('id', idsToComplete)
                .eq('user_id', user.id);

            if(completeError) throw new Error(completeError.message);

            habits.forEach((h) => {
                if(idsToComplete.includes(h.id)) h.is_completed = true;
            });
        }
        return habits;
    },
    getById: async (id: string) => {
        const supabase = await createClient();
        const user = await getAuthUser();

        if(!user) throw new Error("Unautorized");

        const { data, error } = await supabase
            .from('habits')
            .select('*')
            .eq('user_id', user.id)
            .eq('id', id)
            .single()
        
        if(error) throw new Error(error.message);

        return data as Habit
    },
    create: async (input: NewHabitInput) => {
        const supabase = await createClient();
        const user = await getAuthUser();

        if(!user) throw new Error("Unauthorized");

        const { data, error } = await supabase
            .from('habits')
            .insert({
                user_id: user.id,
                title: input.title,
                time_block: input.time_block,
                target_days: input.target_days,
                type: input.type,
                duration: input.duration,
                heaviness: input.heaviness,
            })
            .select()
            .single();
        
        if(error) throw new Error(error.message);
        return data as Habit;
    },
    update: async (id: string, input: UpdateHabitInput) => {
        const supabase = await createClient();
        const user = await getAuthUser();

        if(!user) throw new Error("Unauthorized");


        const { data, error } = await supabase
            .from('habits')
            .update(input)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();
        
        if (error) throw new Error(error.message);
        return data as Habit;
    },
    delete: async (id: string) => {
        const supabase = await createClient();
        const user = await getAuthUser();

        if(!user) throw new Error("Unauthorized");

        const { error } = await supabase
            .from('habits')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if(error) throw new Error(error.message);
    },
}