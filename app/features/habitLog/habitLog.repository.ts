import { getAuthUser } from "@/app/lib/auth";
import { createClient } from "@/app/lib/supabase/server";
import { getJstDateStr } from "@/app/utils/getJstDateStr";
import type { DateRange, HabitLog } from "./habitLog.type";

interface IHabitLogRepository {
  getByRange: (range: DateRange) => Promise<HabitLog[]>;
  add: (habitId: string, loggedOn?: string) => Promise<HabitLog>;
  remove: (habitId: string, loggedOn?: string) => Promise<void>;
}

export const habitLogRepository: IHabitLogRepository = {
  getByRange: async ({ from, to }) => {
    const supabase = await createClient();
    const user = await getAuthUser();

    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from("habit_logs")
      .select("*")
      .eq("user_id", user.id)
      .gte("logged_on", from)
      .lte("logged_on", to);

    if (error) throw new Error(error.message);
    return data as HabitLog[];
  },

  add: async (habitId, loggedOn = getJstDateStr()) => {
    const supabase = await createClient();
    const user = await getAuthUser();

    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from("habit_logs")
      .upsert(
        { habit_id: habitId, user_id: user.id, logged_on: loggedOn },
        { onConflict: "habit_id,logged_on" },
      )
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as HabitLog;
  },

  remove: async (habitId, loggedOn = getJstDateStr()) => {
    const supabase = await createClient();
    const user = await getAuthUser();

    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
      .from("habit_logs")
      .delete()
      .eq("habit_id", habitId)
      .eq("user_id", user.id)
      .eq("logged_on", loggedOn);

    if (error) throw new Error(error.message);
  },
};
