import { createClient } from "@/app/lib/supabase/server";
import { Profile, UpdateProfileInput } from "./profile.type";

interface IProfileRepository {
  get: () => Promise<Profile>;
  update: (input: UpdateProfileInput) => Promise<Profile>;
}

const toProfile = (row: Record<string, unknown>): Profile => ({
  id: row.id as string,
  userName: row.user_name as string,
  maxFocusTime: row.max_focus_time as string,
  maxFocusTimeScore: row.max_focus_time_score as number,
  peakTimeBlock: row.peak_time_block as string,
  peakTimeBlockScore: row.peak_time_block_score as number,
  typeRankingScore: row.type_ranking_score as Profile["typeRankingScore"],
  createdAt: row.created_at as string,
  updatedAt: row.updated_at as string,
});

const toSnakeCase = (input: UpdateProfileInput): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  if (input.userName !== undefined) result.user_name = input.userName;
  if (input.maxFocusTime !== undefined) result.max_focus_time = input.maxFocusTime;
  if (input.maxFocusTimeScore !== undefined) result.max_focus_time_score = input.maxFocusTimeScore;
  if (input.peakTimeBlock !== undefined) result.peak_time_block = input.peakTimeBlock;
  if (input.peakTimeBlockScore !== undefined) result.peak_time_block_score = input.peakTimeBlockScore;
  if (input.typeRankingScore !== undefined) result.type_ranking_score = input.typeRankingScore;
  return result;
};

export const profileRepository: IProfileRepository = {
  get: async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) throw new Error(error.message);

    return toProfile(data);
  },

  update: async (input: UpdateProfileInput) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from('profile')
      .update(toSnakeCase(input))
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return toProfile(data);
  },
};
