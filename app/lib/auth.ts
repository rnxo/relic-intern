import { cache } from "react";
import { createClient } from "./supabase/server";

export const getAuthUser = cache( async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if(!user) throw new Error("Unauthorized");

  return user;
});